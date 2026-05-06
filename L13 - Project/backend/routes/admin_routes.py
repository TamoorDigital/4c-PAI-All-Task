from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import models
from database import get_db
from auth import get_admin_user
from config import PLAN_LIMITS

router = APIRouter(prefix="/admin", tags=["admin"])


class AdminChangePlanRequest(BaseModel):
    user_id: int
    plan: str


class AdminDeleteUserRequest(BaseModel):
    user_id: int


@router.get("/users")
def get_all_users(
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_admin_user),
):
    users = db.query(models.User).all()
    return [
        {
            "id": u.id,
            "email": u.email,
            "username": u.username,
            "plan": u.plan,
            "is_admin": u.is_admin,
            "is_active": u.is_active,
            "uploads_today": u.uploads_today,
            "created_at": u.created_at,
        }
        for u in users
    ]


@router.post("/delete-user")
def delete_user(
    data: AdminDeleteUserRequest,
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_admin_user),
):
    user = db.query(models.User).filter(models.User.id == data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_admin:
        raise HTTPException(status_code=403, detail="Cannot delete an admin user")

    # Soft delete
    user.is_active = False
    db.commit()
    return {"message": f"User {user.email} deactivated successfully"}


@router.post("/change-plan")
def admin_change_plan(
    data: AdminChangePlanRequest,
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_admin_user),
):
    if data.plan not in PLAN_LIMITS:
        raise HTTPException(status_code=400, detail=f"Invalid plan: {data.plan}")

    user = db.query(models.User).filter(models.User.id == data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.plan = data.plan
    db.commit()
    return {"message": f"Plan changed to {data.plan} for {user.email}"}


@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_admin_user),
):
    total_users = db.query(models.User).count()
    active_users = db.query(models.User).filter(models.User.is_active == True).count()
    total_uploads = db.query(models.Upload).count()
    total_generations = db.query(models.Generation).count()

    plan_counts = {}
    for plan in PLAN_LIMITS:
        count = db.query(models.User).filter(models.User.plan == plan).count()
        plan_counts[plan] = count

    return {
        "total_users": total_users,
        "active_users": active_users,
        "total_uploads": total_uploads,
        "total_generations": total_generations,
        "users_by_plan": plan_counts,
    }
