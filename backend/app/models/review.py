from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Review(Base):
    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listing.id", ondelete="CASCADE"), index=True)
    user_name = Column(String, index=True)
    rating = Column(Integer, default=5)
    comment = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    listing = relationship("Listing", back_populates="reviews")
