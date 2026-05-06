import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import models
from database import get_db
from auth import get_current_user
from config import PLAN_LIMITS
from services.llm import generate_mcq, generate_short, generate_long
from services.cleaning import truncate_text

router = APIRouter(tags=["generate"])

PLAN_ORDER = ["free", "basic", "advanced"]

# Exam level requires at least basic plan
DIFFICULTY_MIN_PLAN = {
    "basic":     "free",
    "important": "free",
    "exam":      "basic",
}


class GenerateRequest(BaseModel):
    upload_id: int
    count: int
    difficulty: str = "important"


def _get_upload_or_404(upload_id: int, user_id: int, db: Session) -> models.Upload:
    upload = db.query(models.Upload).filter(
        models.Upload.id == upload_id,
        models.Upload.user_id == user_id
    ).first()
    if not upload:
        raise HTTPException(status_code=404, detail="Upload not found")
    return upload


def _validate_count(count: int, limit: int, gen_type: str, plan: str):
    if count < 1:
        raise HTTPException(status_code=400, detail="Count must be at least 1")
    if count > limit:
        raise HTTPException(
            status_code=403,
            detail=f"{gen_type} limit for '{plan}' plan is {limit}. You requested {count}. Please upgrade your plan."
        )


def _validate_difficulty(difficulty: str, user_plan: str):
    """Block exam-level difficulty for free plan users."""
    if difficulty not in DIFFICULTY_MIN_PLAN:
        raise HTTPException(status_code=400, detail=f"Invalid difficulty: {difficulty}. Choose: basic, important, exam")
    required_plan = DIFFICULTY_MIN_PLAN[difficulty]
    user_rank     = PLAN_ORDER.index(user_plan) if user_plan in PLAN_ORDER else 0
    required_rank = PLAN_ORDER.index(required_plan)
    if user_rank < required_rank:
        raise HTTPException(
            status_code=403,
            detail=f"'Exam Level' difficulty requires Basic or Advanced plan. Your current plan is '{user_plan}'. Please upgrade."
        )


@router.post("/generate-mcq")
def generate_mcq_route(
    req: GenerateRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plan = PLAN_LIMITS[current_user.plan]
    _validate_count(req.count, plan["mcq_limit"], "MCQ", current_user.plan)
    _validate_difficulty(req.difficulty, current_user.plan)
    upload = _get_upload_or_404(req.upload_id, current_user.id, db)

    text = truncate_text(upload.extracted_text)
    if not text:
        raise HTTPException(status_code=422, detail="No text available in this upload")

    try:
        result = generate_mcq(text, req.count, req.difficulty)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    gen = models.Generation(
        gen_type="mcq",
        content=json.dumps(result),
        count=len(result),
        difficulty=req.difficulty,
        user_id=current_user.id,
        upload_id=upload.id,
    )
    db.add(gen)
    db.commit()
    db.refresh(gen)
    return {"generation_id": gen.id, "type": "mcq", "count": len(result), "data": result}


@router.post("/generate-short")
def generate_short_route(
    req: GenerateRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plan = PLAN_LIMITS[current_user.plan]
    _validate_count(req.count, plan["short_limit"], "Short Questions", current_user.plan)
    _validate_difficulty(req.difficulty, current_user.plan)
    upload = _get_upload_or_404(req.upload_id, current_user.id, db)

    text = truncate_text(upload.extracted_text)
    if not text:
        raise HTTPException(status_code=422, detail="No text available in this upload")

    try:
        result = generate_short(text, req.count)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    gen = models.Generation(
        gen_type="short",
        content=json.dumps(result),
        count=len(result),
        difficulty=req.difficulty,
        user_id=current_user.id,
        upload_id=upload.id,
    )
    db.add(gen)
    db.commit()
    db.refresh(gen)
    return {"generation_id": gen.id, "type": "short", "count": len(result), "data": result}


@router.post("/generate-long")
def generate_long_route(
    req: GenerateRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plan = PLAN_LIMITS[current_user.plan]
    _validate_count(req.count, plan["long_limit"], "Long Questions", current_user.plan)
    _validate_difficulty(req.difficulty, current_user.plan)
    upload = _get_upload_or_404(req.upload_id, current_user.id, db)

    text = truncate_text(upload.extracted_text)
    if not text:
        raise HTTPException(status_code=422, detail="No text available in this upload")

    try:
        result = generate_long(text, req.count)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    gen = models.Generation(
        gen_type="long",
        content=json.dumps(result),
        count=len(result),
        difficulty=req.difficulty,
        user_id=current_user.id,
        upload_id=upload.id,
    )
    db.add(gen)
    db.commit()
    db.refresh(gen)
    return {"generation_id": gen.id, "type": "long", "count": len(result), "data": result}


@router.get("/generations")
def get_my_generations(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    gens = db.query(models.Generation).filter(
        models.Generation.user_id == current_user.id
    ).order_by(models.Generation.created_at.desc()).all()
    return [
        {"id": g.id, "type": g.gen_type, "count": g.count, "difficulty": g.difficulty,
         "upload_id": g.upload_id, "created_at": g.created_at}
        for g in gens
    ]


@router.get("/generations/{gen_id}")
def get_generation(
    gen_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    gen = db.query(models.Generation).filter(
        models.Generation.id == gen_id,
        models.Generation.user_id == current_user.id
    ).first()
    if not gen:
        raise HTTPException(status_code=404, detail="Generation not found")
    return {
        "id": gen.id, "type": gen.gen_type, "count": gen.count,
        "difficulty": gen.difficulty, "upload_id": gen.upload_id,
        "data": json.loads(gen.content), "created_at": gen.created_at,
    }