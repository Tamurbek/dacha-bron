from typing import List, Optional, Dict
from pydantic import BaseModel
from datetime import datetime

class ListingBase(BaseModel):
    title: Optional[str] = None
    region: Optional[str] = None
    location: Optional[str] = None
    price_per_night: Optional[float] = None
    guests_max: Optional[int] = None
    rooms: Optional[int] = None
    beds: Optional[int] = None
    baths: Optional[int] = None
    amenities: Optional[Dict[str, bool]] = None
    images: Optional[List[str]] = None
    video_url: Optional[str] = None
    description: Optional[str] = None

class ListingCreate(ListingBase):
    title: str
    region: str
    location: str
    price_per_night: float

class ListingUpdate(ListingBase):
    pass

class ListingInDBBase(ListingBase):
    id: int
    rating: float
    reviews_count: int
    created_at: datetime

    class Config:
        from_attributes = True

class Listing(ListingInDBBase):
    pass

class ListingPagination(BaseModel):
    items: List[Listing]
    total: int
    page: int
    size: int
    pages: int
