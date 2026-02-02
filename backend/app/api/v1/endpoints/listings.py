from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.listing import Listing as ListingModel
from app.schemas.listing import Listing, ListingCreate, ListingUpdate, ListingPagination
import json
import math
from app.core.redis_client import redis_client

router = APIRouter()

@router.get("/", response_model=ListingPagination)
def read_listings(
    db: Session = Depends(get_db),
    page: int = 1,
    size: int = 10,
    region: str = None,
    search: str = None
) -> Any:
    skip = (page - 1) * size
    
    query = db.query(ListingModel).order_by(ListingModel.id.desc())
    if region:
        query = query.filter(ListingModel.region == region)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (ListingModel.title.ilike(search_filter)) | 
            (ListingModel.location.ilike(search_filter))
        )
    
    total = query.count()
    listings = query.offset(skip).limit(size).all()
    
    return {
        "items": listings,
        "total": total,
        "page": page,
        "size": size,
        "pages": math.ceil(total / size) if total > 0 else 0
    }

@router.post("/", response_model=Listing)
def create_listing(
    *,
    db: Session = Depends(get_db),
    listing_in: ListingCreate
) -> Any:
    listing = ListingModel(**listing_in.model_dump())
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing

@router.get("/{id}", response_model=Listing)
def read_listing(
    *,
    db: Session = Depends(get_db),
    id: int
) -> Any:
    listing = db.query(ListingModel).filter(ListingModel.id == id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing

@router.put("/{id}", response_model=Listing)
def update_listing(
    *,
    db: Session = Depends(get_db),
    id: int,
    listing_in: ListingUpdate
) -> Any:
    listing = db.query(ListingModel).filter(ListingModel.id == id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    update_data = listing_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(listing, field, value)
    
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing

@router.delete("/{id}", response_model=Listing)
def delete_listing(
    *,
    db: Session = Depends(get_db),
    id: int
) -> Any:
    listing = db.query(ListingModel).filter(ListingModel.id == id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    db.delete(listing)
    db.commit()
    return listing
