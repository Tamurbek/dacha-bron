from sqlalchemy.orm import Session
from app.db.base import Base
from app.db.session import engine
from app.models.listing import Listing
from app.models.user import User

def init_db(db: Session) -> None:
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Check if we already have listings
    if db.query(Listing).first():
        return

    # Seed data
    regions = ['tashkent', 'zomin', 'chimgan', 'jizzax', 'charvak', 'amirsoy']
    titles = [
        "Shinam Dacha", "Lux Villa", "Mountain Vista", "Pool Side Paradise",
        "Family Retreat", "Eco Stay", "Modern Mansion", "Grand Villa",
        "Hilltop Haven", "Lakefront Lodge", "Valley View", "Forest Cabin",
        "Summer House", "Winter Escape", "Sunset Villa", "Breeze Villa",
        "Zen Oasis", "Royal Dacha", "Hidden Gem", "Cloud Nine Villa"
    ]
    amenities_list = ['pool', 'sauna', 'bbq', 'wifi', 'ac', 'kitchen']

    for i in range(24):
        id_val = i + 1
        region = regions[i % len(regions)]
        guests_max = 4 + (i % 8)
        rooms = 2 + (i % 4)
        
        listing = Listing(
            title=f"{titles[i % len(titles)]} #{id_val}",
            region=region,
            location=f"{region.capitalize()}, Uzbekistan",
            price_per_night=float(500000 + (i * 100000)),
            rating=4.0 + (i % 10) / 10.0,
            reviews_count=10 + i,
            guests_max=guests_max,
            rooms=rooms,
            beds=rooms + 1,
            baths=max(1, rooms - 1),
            amenities={a: (i % 2 == 0) for a in amenities_list},
            images=[
                f"https://picsum.photos/seed/dacha-{id_val}-1/1200/800",
                f"https://picsum.photos/seed/dacha-{id_val}-2/1200/800",
                f"https://picsum.photos/seed/dacha-{id_val}-3/1200/800",
                f"https://picsum.photos/seed/dacha-{id_val}-4/1200/800",
            ],
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        )
        db.add(listing)

    # Seed an admin user
    if not db.query(User).filter(User.email == "admin@example.com").first():
        admin = User(
            email="admin@example.com",
            hashed_password="admin", # placeholder
            full_name="Admin User",
            role="admin",
            status="active"
        )
        db.add(admin)
        
    db.commit()

if __name__ == "__main__":
    from app.db.session import SessionLocal
    db = SessionLocal()
    init_db(db)
    print("Database initialized and seeded.")
