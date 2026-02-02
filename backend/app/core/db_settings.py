from sqlalchemy.orm import Session
from app.models.settings import Settings
from app.core.config import settings as env_settings

def get_telegram_settings(db: Session):
    bot_token = db.query(Settings).filter(Settings.key == "TELEGRAM_BOT_TOKEN").first()
    channel_id = db.query(Settings).filter(Settings.key == "TELEGRAM_CHANNEL_ID").first()
    
    return {
        "bot_token": bot_token.value if bot_token else env_settings.TELEGRAM_BOT_TOKEN,
        "channel_id": channel_id.value if channel_id else env_settings.TELEGRAM_CHANNEL_ID
    }

def update_telegram_settings(db: Session, bot_token: str = None, channel_id: str = None):
    if bot_token is not None:
        token_setting = db.query(Settings).filter(Settings.key == "TELEGRAM_BOT_TOKEN").first()
        if not token_setting:
            token_setting = Settings(key="TELEGRAM_BOT_TOKEN", value=bot_token)
            db.add(token_setting)
        else:
            token_setting.value = bot_token
            
    if channel_id is not None:
        channel_setting = db.query(Settings).filter(Settings.key == "TELEGRAM_CHANNEL_ID").first()
        if not channel_setting:
            channel_setting = Settings(key="TELEGRAM_CHANNEL_ID", value=channel_id)
            db.add(channel_setting)
        else:
            channel_setting.value = channel_id
            
    db.commit()
