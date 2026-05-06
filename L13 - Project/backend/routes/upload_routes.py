import os
import shutil
from datetime import date, datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import models
from database import get_db
from auth import get_current_user
from config import PLAN_LIMITS, UPLOAD_DIR
from services import ocr, pdf as pdf_service
from services.cleaning import clean_text

router = APIRouter(tags=["upload"])

ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".tiff", ".bmp", ".webp"}

# How long upload RECORDS stay in the DB before auto-deletion
# Files themselves are deleted from disk immediately after text extraction
UPLOAD_RECORD_TTL_HOURS = 24


def _reset_daily_uploads_if_needed(user: models.User, db: Session):
    """Reset the daily counter if it's a new day."""
    today = str(date.today())
    if user.last_upload_date != today:
        user.uploads_today = 0
        user.last_upload_date = today
        db.commit()
        db.refresh(user)


def _delete_expired_uploads(user_id: int, db: Session):
    """
    Delete upload DB records older than TTL for this user.
    The actual file on disk is already gone (deleted right after extraction).
    Also cascade-deletes any generations linked to expired uploads.
    """
    cutoff = datetime.utcnow() - timedelta(hours=UPLOAD_RECORD_TTL_HOURS)
    expired = db.query(models.Upload).filter(
        models.Upload.user_id == user_id,
        models.Upload.created_at < cutoff,
    ).all()

    for upload in expired:
        # Safety: if file somehow still exists, delete it
        if upload.filepath and os.path.exists(upload.filepath):
            try:
                os.remove(upload.filepath)
            except OSError:
                pass
        db.delete(upload)

    if expired:
        db.commit()


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # 1. Reset daily counter if new day
    _reset_daily_uploads_if_needed(current_user, db)

    # 2. Check daily upload limit
    plan = PLAN_LIMITS[current_user.plan]
    if current_user.uploads_today >= plan["uploads_per_day"]:
        raise HTTPException(
            status_code=429,
            detail=(
                f"Daily upload limit reached "
                f"({plan['uploads_per_day']} uploads/day on {current_user.plan} plan). "
                f"Resets tomorrow at midnight."
            )
        )

    # 3. Validate file extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {ext}. Allowed: PDF, PNG, JPG, JPEG, TIFF, BMP, WEBP")

    # 4. Save file TEMPORARILY to extract text
    tmp_dir = os.path.join(UPLOAD_DIR, "tmp", str(current_user.id))
    os.makedirs(tmp_dir, exist_ok=True)
    # Use timestamp in filename to avoid collisions
    safe_filename = f"{int(datetime.utcnow().timestamp())}_{file.filename}"
    tmp_filepath = os.path.join(tmp_dir, safe_filename)

    with open(tmp_filepath, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # 5. Extract text
    try:
        if ext == ".pdf":
            extracted_text = pdf_service.extract_text_from_pdf(tmp_filepath)
        else:
            extracted_text = ocr.extract_text_from_image(tmp_filepath)
        cleaned = clean_text(extracted_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text extraction failed: {str(e)}")
    finally:
        # DELETE FILE FROM DISK immediately after extraction — no storage used
        if os.path.exists(tmp_filepath):
            os.remove(tmp_filepath)
        # Clean up empty tmp dir if possible
        try:
            os.rmdir(tmp_dir)
        except OSError:
            pass

    if not cleaned:
        raise HTTPException(status_code=422, detail="No readable text found in this file. Make sure it contains actual text, not just images.")

    # 6. Save only the extracted TEXT to DB (no file path stored)
    expires_at = datetime.utcnow() + timedelta(hours=UPLOAD_RECORD_TTL_HOURS)
    upload = models.Upload(
        filename=file.filename,
        filepath=None,          # ✅ No file stored on disk
        extracted_text=cleaned,
        user_id=current_user.id,
        expires_at=expires_at,
    )
    db.add(upload)
    current_user.uploads_today += 1
    db.commit()
    db.refresh(upload)

    # 7. Clean up old expired records for this user
    _delete_expired_uploads(current_user.id, db)

    return {
        "upload_id": upload.id,
        "filename": upload.filename,
        "text_preview": cleaned[:500],
        "char_count": len(cleaned),
        "expires_at": expires_at.isoformat(),
        "message": "File processed successfully. Text extracted and file removed from server.",
    }


@router.get("/uploads")
def get_my_uploads(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Reset daily counter on any API call — so it's always up to date
    _reset_daily_uploads_if_needed(current_user, db)

    uploads = (
        db.query(models.Upload)
        .filter(models.Upload.user_id == current_user.id)
        .order_by(models.Upload.created_at.desc())
        .all()
    )
    now = datetime.utcnow()
    return [
        {
            "id": u.id,
            "filename": u.filename,
            "char_count": len(u.extracted_text),
            "created_at": u.created_at,
            "expires_at": u.expires_at,
            "expires_in_hours": round((u.expires_at - now).total_seconds() / 3600, 1)
                                if u.expires_at and u.expires_at > now else 0,
        }
        for u in uploads
    ]


@router.get("/uploads/{upload_id}")
def get_upload(
    upload_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    upload = db.query(models.Upload).filter(
        models.Upload.id == upload_id,
        models.Upload.user_id == current_user.id,
    ).first()
    if not upload:
        raise HTTPException(status_code=404, detail="Upload not found or already expired")
    return {
        "id": upload.id,
        "filename": upload.filename,
        "extracted_text": upload.extracted_text,
        "created_at": upload.created_at,
        "expires_at": upload.expires_at,
    }