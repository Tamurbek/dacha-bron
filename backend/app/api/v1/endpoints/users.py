from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User as UserModel
from app.schemas.user import User, UserCreate

router = APIRouter()

@router.get("/", response_model=List[User])
def read_users(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    users = db.query(UserModel).offset(skip).limit(limit).all()
    return users

@router.post("/", response_model=User)
def create_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate
) -> Any:
    user = db.query(UserModel).filter(UserModel.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    # Note: In a real app, hash the password
    user = UserModel(
        email=user_in.email,
        hashed_password=user_in.password, # Placeholder
        full_name=user_in.full_name,
        role=user_in.role,
        status=user_in.status
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
