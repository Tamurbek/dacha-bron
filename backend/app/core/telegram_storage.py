import httpx
from app.core.config import settings
from fastapi import HTTPException
import os

async def upload_to_telegram(file_content: bytes, filename: str) -> str:
    """
    Uploads a file to a Telegram channel and returns the message link or file_id.
    Note: Telegram direct file links require a bot token and are temporary.
    For public channels, we can return the t.me link.
    """
    if not settings.TELEGRAM_BOT_TOKEN or not settings.TELEGRAM_CHANNEL_ID:
        raise HTTPException(status_code=500, detail="Telegram Bot settings not configured")

    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendDocument"
    
    async with httpx.AsyncClient() as client:
        files = {'document': (filename, file_content)}
        data = {'chat_id': settings.TELEGRAM_CHANNEL_ID}
        
        response = await client.post(url, data=data, files=files)
        res_data = response.json()
        
        if not res_data.get("ok"):
            raise HTTPException(status_code=500, detail=f"Telegram upload failed: {res_data.get('description')}")
        
        # If the channel is public, we can construct a link like t.me/channel/message_id
        # channel_id usually starts with -100 for private channels
        # For professional use, we often use file_id and a proxy, or telegra.ph
        
        message_id = res_data["result"]["message_id"]
        channel_id_str = str(settings.TELEGRAM_CHANNEL_ID).replace("-100", "")
        
        if settings.TELEGRAM_CHANNEL_ID.startswith("@"):
            channel_name = settings.TELEGRAM_CHANNEL_ID.replace("@", "")
            return f"https://t.me/{channel_name}/{message_id}"
        else:
            # For private channels, we can't easily get a public URL without a proxy
            # So we return the file_id or a placeholder
            return f"https://t.me/c/{channel_id_str}/{message_id}"

async def upload_to_telegraph(file_content: bytes) -> str:
    """
    Uploads an image/video to telegra.ph and returns a direct permanent link.
    Limit: 5MB
    """
    url = "https://telegra.ph/upload"
    
    async with httpx.AsyncClient() as client:
        files = {'file': ('file', file_content)}
        response = await client.post(url, files=files)
        res_data = response.json()
        
        if isinstance(res_data, list) and len(res_data) > 0:
            path = res_data[0].get("src")
            return f"https://telegra.ph{path}"
        else:
            raise HTTPException(status_code=500, detail="Telegra.ph upload failed")

async def upload_file_to_storage(file_content: bytes, filename: str) -> str:
    """
    Main utility to choose the best storage.
    For images and small videos, telegra.ph is best for direct URLs.
    """
    ext = os.path.splitext(filename)[1].lower()
    
    # Telegra.ph supports jpg, jpeg, png, gif, mp4
    if ext in [".jpg", ".jpeg", ".png", ".gif", ".mp4"] and len(file_content) < 5 * 1024 * 1024:
        try:
            return await upload_to_telegraph(file_content)
        except:
            # Fallback to Telegram if telegra.ph fails
            return await upload_to_telegram(file_content, filename)
    else:
        return await upload_to_telegram(file_content, filename)
