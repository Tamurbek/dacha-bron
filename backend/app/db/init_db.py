from sqlalchemy.orm import Session
from app.db.base import Base
from app.db.session import engine
from app.models.listing import Listing
from app.models.user import User
from app.models.amenity import Amenity

def init_db(db: Session) -> None:
    # Create tables
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created.")

    # Barcha dachalar ma'lumotlarini tozalaymiz
    # db.query(Listing).delete() # Temporarily commented out to avoid data loss if it runs unexpectedly
    
    # Seed an admin user (if not exists)
    admin_user = db.query(User).filter(User.email == "admin").first()
    if not admin_user:
        print("Creating admin user...")
        admin = User(
            email="admin",
            full_name="Super Admin",
            hashed_password="admin", # placeholder
            role="admin",
            status="active"
        )
        db.add(admin)
        print("Admin user created.")
    else:
        print("Admin user already exists.")
        
    db.commit()

if __name__ == "__main__":
    from app.db.session import SessionLocal
    db = SessionLocal()
    init_db(db)
    print("Database cleared. Ready for new manual data entry.")
