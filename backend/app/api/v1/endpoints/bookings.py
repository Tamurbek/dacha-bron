from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.booking import Booking as BookingModel
from app.schemas.booking import Booking, BookingCreate, BookingUpdate, BookingPagination
import math

router = APIRouter()

from sqlalchemy.orm import joinedload

@router.get("/", response_model=BookingPagination)
def read_bookings(
    db: Session = Depends(get_db),
    page: int = 1,
    size: int = 10,
    status: str = None
) -> Any:
    skip = (page - 1) * size
    
    query = db.query(BookingModel).options(
        joinedload(BookingModel.user),
        joinedload(BookingModel.listing)
    ).order_by(BookingModel.id.desc())
    
    if status and status != 'all':
        query = query.filter(BookingModel.status == status)
    
    total = query.count()
    bookings = query.offset(skip).limit(size).all()
    
    # Populate extra fields for UI
    for b in bookings:
        b.user_name = b.customer_name or (b.user.full_name if b.user else f"User #{b.user_id}")
        b.listing_title = b.listing.title if b.listing else f"Listing #{b.listing_id}"
    
    return {
        "items": bookings,
        "total": total,
        "page": page,
        "size": size,
        "pages": math.ceil(total / size) if total > 0 else 0
    }
    
@router.post("/", response_model=Booking)
def create_booking(
    *,
    db: Session = Depends(get_db),
    booking_in: BookingCreate
) -> Any:
    booking = BookingModel(
        **booking_in.model_dump()
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking

@router.get("/{id}", response_model=Booking)
def read_booking(
    *,
    db: Session = Depends(get_db),
    id: int
) -> Any:
    booking = db.query(BookingModel).filter(BookingModel.id == id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

@router.put("/{id}", response_model=Booking)
def update_booking(
    *,
    db: Session = Depends(get_db),
    id: int,
    booking_in: BookingUpdate
) -> Any:
    booking = db.query(BookingModel).filter(BookingModel.id == id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    update_data = booking_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(booking, field, value)
    
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking

@router.delete("/{id}", response_model=Booking)
def delete_booking(
    *,
    db: Session = Depends(get_db),
    id: int
) -> Any:
    booking = db.query(BookingModel).filter(BookingModel.id == id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    db.delete(booking)
    db.commit()
    return booking
