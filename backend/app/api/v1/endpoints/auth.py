from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.config import settings
from app.schemas.token import Token

router = APIRouter()

@router.post("/login/access-token", response_model=Token)
def login_access_token(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    # This is a placeholder for actual authentication logic
    # In a real app, you'd verify the user's password here
    if form_data.username == "admin" and form_data.password == "admin":
        return {
            "access_token": "fake-admin-token",
            "token_type": "bearer",
        }
    raise HTTPException(status_code=400, detail="Incorrect email or password")
