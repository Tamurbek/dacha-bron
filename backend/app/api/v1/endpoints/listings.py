from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.listing import Listing as ListingModel
from app.schemas.listing import Listing, ListingCreate, ListingUpdate
import json
from app.core.redis_client import redis_client

router = APIRouter()

@router.get("/", response_model=List[Listing])
def read_listings(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    region: str = None
) -> Any:
    cache_key = f"listings:{region}:{skip}:{limit}"
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)

    query = db.query(ListingModel)
    if region:
        query = query.filter(ListingModel.region == region)
    listings = query.offset(skip).limit(limit).all()
    
    # Pre-serialize for JSON storage because SQLAlchemy objects aren't directly serializable
    # For a production app, use a proper serializer or stick to Pydantic models
    # Here we convert to dict list as a placeholder
    listings_data = [Listing.model_validate(l).model_dump(mode='json') for l in listings]
    redis_client.setex(cache_key, 60, json.dumps(listings_data))
    
    return listings

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
