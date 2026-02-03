from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class Booking(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    listing_id = Column(Integer, ForeignKey("listing.id"))
    check_in = Column(DateTime)
    check_out = Column(DateTime)
    guests = Column(Integer)
    total_price = Column(Float)
    status = Column(String, default="pending") # pending, confirmed, cancelled
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    customer_name = Column(String)
    customer_phone = Column(String)
    
    user = relationship("User", backref="bookings")
    listing = relationship("Listing", backref="bookings")
