from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User as UserModel
from app.schemas.user import User, UserCreate, UserUpdate, UserPagination
import math

router = APIRouter()

@router.get("/", response_model=UserPagination)
def read_users(
    db: Session = Depends(get_db),
    page: int = 1,
    size: int = 10,
    search: str = None
) -> Any:
    skip = (page - 1) * size
    
    query = db.query(UserModel).order_by(UserModel.id.desc())
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (UserModel.full_name.ilike(search_filter)) | 
            (UserModel.email.ilike(search_filter))
        )
    
    total = query.count()
    users = query.offset(skip).limit(size).all()
    
    return {
        "items": users,
        "total": total,
        "page": page,
        "size": size,
        "pages": math.ceil(total / size) if total > 0 else 0
    }

@router.put("/{id}", response_model=User)
def update_user(
    *,
    db: Session = Depends(get_db),
    id: int,
    user_in: UserUpdate
) -> Any:
    user = db.query(UserModel).filter(UserModel.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user_in.model_dump(exclude_unset=True)
    if update_data.get("password"):
        # Hash password in real app
        user.hashed_password = update_data["password"]
        del update_data["password"]
        
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.delete("/{id}", response_model=User)
def delete_user(
    *,
    db: Session = Depends(get_db),
    id: int
) -> Any:
    user = db.query(UserModel).filter(UserModel.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return user

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
