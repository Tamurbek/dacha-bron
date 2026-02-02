from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.amenity import Amenity as AmenityModel
from app.schemas.amenity import Amenity, AmenityCreate, AmenityUpdate

router = APIRouter()

@router.get("/", response_model=List[Amenity])
def read_amenities(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
) -> Any:
    return db.query(AmenityModel).offset(skip).limit(limit).all()

@router.post("/", response_model=Amenity)
def create_amenity(
    *,
    db: Session = Depends(get_db),
    amenity_in: AmenityCreate
) -> Any:
    amenity = AmenityModel(**amenity_in.model_dump())
    db.add(amenity)
    db.commit()
    db.refresh(amenity)
    return amenity

@router.put("/{id}", response_model=Amenity)
def update_amenity(
    *,
    db: Session = Depends(get_db),
    id: int,
    amenity_in: AmenityUpdate
) -> Any:
    amenity = db.query(AmenityModel).filter(AmenityModel.id == id).first()
    if not amenity:
        raise HTTPException(status_code=404, detail="Amenity not found")
    
    update_data = amenity_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(amenity, field, value)
    
    db.add(amenity)
    db.commit()
    db.refresh(amenity)
    return amenity

@router.delete("/{id}", response_model=Amenity)
def delete_amenity(
    *,
    db: Session = Depends(get_db),
    id: int
) -> Any:
    amenity = db.query(AmenityModel).filter(AmenityModel.id == id).first()
    if not amenity:
        raise HTTPException(status_code=404, detail="Amenity not found")
    db.delete(amenity)
    db.commit()
    return amenity
