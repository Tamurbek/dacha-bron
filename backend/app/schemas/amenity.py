from typing import Optional
from pydantic import BaseModel

class AmenityBase(BaseModel):
    name_uz: str
    name_ru: str
    name_en: str
    icon: Optional[str] = None

class AmenityCreate(AmenityBase):
    pass

class AmenityUpdate(AmenityBase):
    name_uz: Optional[str] = None
    name_ru: Optional[str] = None
    name_en: Optional[str] = None

class Amenity(AmenityBase):
    id: int

    class Config:
        from_attributes = True
