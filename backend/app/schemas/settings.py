from pydantic import BaseModel
from typing import Optional

class TelegramSettings(BaseModel):
    bot_token: Optional[str] = None
    channel_id: Optional[str] = None

class SettingsUpdate(TelegramSettings):
    pass
