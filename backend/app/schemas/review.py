from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class ReviewBase(BaseModel):
    listing_id: Optional[int] = None
    user_name: Optional[str] = None
    rating: Optional[int] = 5
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    listing_id: int
    user_name: str
    rating: int
    comment: str

class ReviewUpdate(ReviewBase):
    pass

class Review(ReviewBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ReviewPagination(BaseModel):
    items: List[Review]
    total: int
    page: int
    size: int
    pages: int
