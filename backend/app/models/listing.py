from sqlalchemy import Column, Integer, String, Float, JSON, Text, DateTime
from sqlalchemy.sql import func
from app.db.base_class import Base

class Listing(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    region = Column(String, index=True)
    location = Column(String)
    price_per_night = Column(Float)
    rating = Column(Float, default=0.0)
    reviews_count = Column(Integer, default=0)
    guests_max = Column(Integer)
    rooms = Column(Integer)
    beds = Column(Integer)
    baths = Column(Integer)
    amenities = Column(JSON) # e.g. {"pool": true, "wifi": true}
    images = Column(JSON) # List of image URLs
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
