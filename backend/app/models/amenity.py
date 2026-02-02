from sqlalchemy import Column, Integer, String
from app.db.base_class import Base

class Amenity(Base):
    id = Column(Integer, primary_key=True, index=True)
    name_uz = Column(String, index=True)
    name_ru = Column(String, index=True)
    name_en = Column(String, index=True)
    icon = Column(String, nullable=True) # Lucide icon name or URL
