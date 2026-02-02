from sqlalchemy.orm import Session
from app.db.base import Base
from app.db.session import engine
from app.models.listing import Listing
from app.models.user import User

def init_db(db: Session) -> None:
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Barcha dachalar ma'lumotlarini tozalaymiz
    db.query(Listing).delete()

    # Seed an admin user (if not exists)
    if not db.query(User).filter(User.email == "admin").first():
        admin = User(
            email="admin",
            full_name="Super Admin",
            hashed_password="admin", # placeholder
            role="admin",
            status="active"
        )
        db.add(admin)
        
    db.commit()

if __name__ == "__main__":
    from app.db.session import SessionLocal
    db = SessionLocal()
    init_db(db)
    print("Database cleared. Ready for new manual data entry.")
