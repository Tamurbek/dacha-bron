from sqlalchemy import Column, String
from app.db.base_class import Base

class Settings(Base):
    key = Column(String, primary_key=True, index=True)
    value = Column(String)
