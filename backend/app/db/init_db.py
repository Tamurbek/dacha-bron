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

    # Seed Amenities if empty
    if db.query(Amenity).count() == 0:
        print("Seeding amenities...")
        amenities_data = [
            {"name_uz": "Hovuz", "name_ru": "Бассейн", "name_en": "Pool", "icon": "Waves"},
            {"name_uz": "Sauna", "name_ru": "Сауна", "name_en": "Sauna", "icon": "Flame"},
            {"name_uz": "Oshxona", "name_ru": "Кухня", "name_en": "Kitchen", "icon": "Utensils"},
            {"name_uz": "Wi-Fi", "name_ru": "Wi-Fi", "name_en": "Wi-Fi", "icon": "Wifi"},
            {"name_uz": "Kontsitsioner", "name_ru": "Кондиционер", "name_en": "AC", "icon": "Wind"},
            {"name_uz": "Kofe mashinasi", "name_ru": "Кофемашина", "name_en": "Coffee", "icon": "Coffee"},
        ]
        for a in amenities_data:
            db.add(Amenity(**a))
        print("Amenities seeded.")

    # Seed Listings if empty
    if db.query(Listing).count() == 0:
        print("Seeding realistic listings...")
        listings_data = [
            {
                "title": "Zomin Tog' Shabadasi - Lux Villa",
                "region": "zomin",
                "location": "Zomin Milliy Bog'i, O'riklisoy mahallasi",
                "price": 2500000.0,
                "guests": 15,
                "rooms": 5,
                "beds": 8,
                "baths": 3,
                "description": "Zomin tog'larining eng yuqori nuqtasida joylashgan ushbu villa sizga unutilmas dam olish qulayliklarini beradi. Qishki va yozgi basseyn, rus hamomi (sauna), karaoke va PlayStation 5 mavjud. Tabiat qo'ynida oilangiz bilan vaqtni xush o'tkazing.",
                "amenities": {"pool": True, "sauna": True, "bbq": True, "wifi": True, "ac": True, "kitchen": True}
            },
            {
                "title": "Jizzax Riverside - Soy Bo'yi Dacha",
                "region": "jizzax",
                "location": "Jizzax tumani, Sangzor daryosi sohili",
                "price": 1200000.0,
                "guests": 10,
                "rooms": 4,
                "beds": 6,
                "baths": 2,
                "description": "Daryo bo'yida joylashgan shinam dacha. Shovqin-surondan uzoqda, sofdan bahramand bo'ling. Katta tapchan, mangal va yozgi oshxona sizning xizmatingizda.",
                "amenities": {"pool": True, "sauna": False, "bbq": True, "wifi": True, "ac": True, "kitchen": True}
            },
            {
                "title": "Baxmal Bog'i - Oilaviy Dam Olish Maskani",
                "region": "jizzax",
                "location": "Baxmal tumani, Olmazor ko'chasi",
                "price": 800000.0,
                "guests": 8,
                "rooms": 3,
                "beds": 5,
                "baths": 1,
                "description": "Baxmalning mashhur olmazorlari ichida joylashgan dacha. Tabiiy mahsulotlar va toza havo. Bolalar uchun o'yingoh bor.",
                "amenities": {"pool": False, "sauna": False, "bbq": True, "wifi": False, "ac": True, "kitchen": True}
            },
            {
                "title": "Everest Zomin - Premium Retreat",
                "region": "zomin",
                "location": "Zomin, Tog'li hudud",
                "price": 3500000.0,
                "guests": 20,
                "rooms": 7,
                "beds": 12,
                "baths": 5,
                "description": "Eng yuqori sifatli xizmat ko'rsatishga ega villa. Konferensiya o'tkazish uchun mo'ljallangan zal, maxsus oshpaz xizmati va bilyard mavjud.",
                "amenities": {"pool": True, "sauna": True, "bbq": True, "wifi": True, "ac": True, "kitchen": True}
            },
            {
                "title": "Aydarkul View - Ko'l Bo'yi Villa",
                "region": "jizzax",
                "location": "Forish tumani, Aydarkul sohili",
                "price": 1800000.0,
                "guests": 12,
                "rooms": 4,
                "beds": 8,
                "baths": 2,
                "description": "Aydarkul ko'li manzarasiga ega bo'lgan noyob villa. Baliq ovi va qayiqda sayr qilish imkoniyati mavjud. Kechki payt ko'l bo'yida mangal qilib o'tirishning gashti boshqacha.",
                "amenities": {"pool": True, "sauna": True, "bbq": True, "wifi": True, "ac": True, "kitchen": True}
            },
            {
                "title": "Zomin Pine Forest Cabin",
                "region": "zomin",
                "location": "Zomin kurorti, Archa zavodi yaqinida",
                "price": 1500000.0,
                "guests": 6,
                "rooms": 2,
                "beds": 4,
                "baths": 1,
                "description": "Archa o'rmoni ichida joylashgan yog'ochli dacha. Yog'och hidi va tog' havosi sog'ligingiz uchun juda foydali. Romantik kechalar uchun eng yaxshi manzil.",
                "amenities": {"pool": False, "sauna": True, "bbq": True, "wifi": True, "ac": False, "kitchen": True}
            },
            {
                "title": "Grand Jizzakh Mansion",
                "region": "jizzax",
                "location": "Jizzax shahar markazi yaqinida",
                "price": 2200000.0,
                "guests": 25,
                "rooms": 6,
                "beds": 10,
                "baths": 4,
                "description": "Katta tantanalar va oilaviy yig'ilishlar uchun mo'ljallangan hashamatli hovli. Katta yashil maydon, futbol maydonchasi va tennis korti bor.",
                "amenities": {"pool": True, "sauna": True, "bbq": True, "wifi": True, "ac": True, "kitchen": True}
            },
            {
                "title": "Sunrise Baxmal Dacha",
                "region": "jizzax",
                "location": "Baxmal, Baland tog'li qishloq",
                "price": 1000000.0,
                "guests": 10,
                "rooms": 3,
                "beds": 6,
                "baths": 1,
                "description": "Quyosh chiqishini tog'lar orasidan kuzatishni xohlaysizmi? Unda ushbu dacha aynan siz uchun. Sokinlik va tabiat bilan hamohanglik.",
                "amenities": {"pool": True, "sauna": False, "bbq": True, "wifi": False, "ac": True, "kitchen": True}
            }
        ]

        for i, data in enumerate(listings_data):
            id_val = i + 1
            listing = Listing(
                title=data["title"],
                region=data["region"],
                location=data["location"],
                price_per_night=data["price"],
                rating=4.5 + (i % 5) / 10.0,
                reviews_count=20 + (i * 5),
                guests_max=data["guests"],
                rooms=data["rooms"],
                beds=data["beds"],
                baths=data["baths"],
                amenities=data["amenities"],
                images=[
                    f"https://picsum.photos/seed/uzb-dacha-{id_val}-1/1200/800",
                    f"https://picsum.photos/seed/uzb-dacha-{id_val}-2/1200/800",
                    f"https://picsum.photos/seed/uzb-dacha-{id_val}-3/1200/800",
                    f"https://picsum.photos/seed/uzb-dacha-{id_val}-4/1200/800",
                ],
                description=data["description"],
                status="active"
            )
            db.add(listing)
        print("Listings seeded.")
    
    # Seed an admin user (if not exists)
    admin_user = db.query(User).filter(User.email == "admin@dacha.uz").first()
    if not admin_user:
        print("Creating admin user...")
        admin = User(
            email="admin@dacha.uz",
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
    print("Database initialization complete.")
