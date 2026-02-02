from fastapi import APIRouter
from app.api.v1.endpoints import listings, users, auth, upload, bookings, amenities, proxy, settings

api_router = APIRouter()
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(listings.router, prefix="/listings", tags=["listings"])
api_router.include_router(upload.router, prefix="/upload", tags=["upload"])
api_router.include_router(bookings.router, prefix="/bookings", tags=["bookings"])
api_router.include_router(amenities.router, prefix="/amenities", tags=["amenities"])
api_router.include_router(proxy.router, prefix="/proxy", tags=["proxy"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])
