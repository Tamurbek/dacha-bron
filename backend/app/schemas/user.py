from typing import Optional, List
from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserBase(BaseModel):
    email: Optional[str] = None
    full_name: Optional[str] = None
    role: Optional[str] = "user"
    status: Optional[str] = "active"

class UserCreate(UserBase):
    email: EmailStr
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserInDBBase(UserBase):
    id: Optional[int] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass

class UserPagination(BaseModel):
    items: List[User]
    total: int
    page: int
    size: int
    pages: int
