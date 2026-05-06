from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import models
from database import get_db
from auth import get_current_user
from config import PLAN_LIMITS

router = APIRouter(tags=["plan"])


class ChangePlanRequest(BaseModel):
    plan: str


@router.get("/user-plan")
def get_user_plan(current_user: models.User = Depends(get_current_user)):
    plan_info = PLAN_LIMITS[current_user.plan]
    return {
        "current_plan": current_user.plan,
        "uploads_today": current_user.uploads_today,
        "limits": plan_info,
        "all_plans": PLAN_LIMITS,
    }


@router.post("/change-plan")
def change_plan(
    data: ChangePlanRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if data.plan not in PLAN_LIMITS:
        raise HTTPException(status_code=400, detail=f"Invalid plan: {data.plan}. Choose from: {list(PLAN_LIMITS.keys())}")

    if data.plan == current_user.plan:
        raise HTTPException(status_code=400, detail="You are already on this plan")

    # In production, payment verification would happen here
    # For now, direct upgrade (contact admin flow)
    old_plan = current_user.plan
    current_user.plan = data.plan
    db.commit()

    return {
        "message": f"Plan changed from {old_plan} to {data.plan}",
        "new_plan": data.plan,
        "limits": PLAN_LIMITS[data.plan],
    }
