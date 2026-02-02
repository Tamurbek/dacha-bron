from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.settings import TelegramSettings, SettingsUpdate
from app.core.db_settings import get_telegram_settings, update_telegram_settings

router = APIRouter()

@router.get("/telegram", response_model=TelegramSettings)
def read_telegram_settings(db: Session = Depends(get_db)) -> Any:
    return get_telegram_settings(db)

@router.post("/telegram", response_model=TelegramSettings)
def save_telegram_settings(
    *,
    db: Session = Depends(get_db),
    settings_in: SettingsUpdate
) -> Any:
    update_telegram_settings(
        db, 
        bot_token=settings_in.bot_token, 
        channel_id=settings_in.channel_id
    )
    return get_telegram_settings(db)
