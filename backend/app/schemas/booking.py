from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class BookingBase(BaseModel):
    user_id: Optional[int] = None
    listing_id: Optional[int] = None
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None
    guests: Optional[int] = None
    total_price: Optional[float] = None
    status: Optional[str] = "pending"
    user_name: Optional[str] = None
    listing_title: Optional[str] = None
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None

class BookingCreate(BookingBase):
    user_id: Optional[int] = None
    listing_id: int
    check_in: datetime
    check_out: datetime
    guests: int
    total_price: float
    customer_name: str
    customer_phone: str

class BookingUpdate(BookingBase):
    pass

class BookingInDBBase(BookingBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Booking(BookingInDBBase):
    pass

class BookingPagination(BaseModel):
    items: List[Booking]
    total: int
    page: int
    size: int
    pages: int
