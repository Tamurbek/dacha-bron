from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.review import Review as ReviewModel
from app.schemas.review import Review, ReviewCreate, ReviewUpdate, ReviewPagination
import math

router = APIRouter()

@router.get("/", response_model=ReviewPagination)
def read_reviews(
    db: Session = Depends(get_db),
    page: int = 1,
    size: int = 10,
    listing_id: int = None,
    start_date: str = None,
    end_date: str = None,
    search: str = None
) -> Any:
    skip = (page - 1) * size
    query = db.query(ReviewModel).order_by(ReviewModel.created_at.desc())
    
    if listing_id:
        query = query.filter(ReviewModel.listing_id == listing_id)
    
    if start_date:
        query = query.filter(ReviewModel.created_at >= start_date)
    if end_date:
        query = query.filter(ReviewModel.created_at <= end_date)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (ReviewModel.user_name.ilike(search_filter)) | 
            (ReviewModel.comment.ilike(search_filter))
        )
        
    total = query.count()
    reviews = query.offset(skip).limit(size).all()
    
    return {
        "items": reviews,
        "total": total,
        "page": page,
        "size": size,
        "pages": math.ceil(total / size) if total > 0 else 0
    }

@router.post("/", response_model=Review)
def create_review(
    *,
    db: Session = Depends(get_db),
    review_in: ReviewCreate
) -> Any:
    review = ReviewModel(**review_in.model_dump())
    db.add(review)
    db.commit()
    db.refresh(review)
    return review

@router.get("/{id}", response_model=Review)
def read_review(
    *,
    db: Session = Depends(get_db),
    id: int
) -> Any:
    review = db.query(ReviewModel).filter(ReviewModel.id == id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review

@router.put("/{id}", response_model=Review)
def update_review(
    *,
    db: Session = Depends(get_db),
    id: int,
    review_in: ReviewUpdate
) -> Any:
    review = db.query(ReviewModel).filter(ReviewModel.id == id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    update_data = review_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(review, field, value)
    
    db.add(review)
    db.commit()
    db.refresh(review)
    return review

@router.delete("/{id}", response_model=Review)
def delete_review(
    *,
    db: Session = Depends(get_db),
    id: int
) -> Any:
    review = db.query(ReviewModel).filter(ReviewModel.id == id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    db.delete(review)
    db.commit()
    return review
