import httpx
from app.core.config import settings
from fastapi import HTTPException
import os

async def upload_to_telegram(file_content: bytes, filename: str, bot_token: str = None, channel_id: str = None) -> str:
    """
    Uploads a file to a Telegram channel and returns the message link or file_id.
    """
    token = bot_token or settings.TELEGRAM_BOT_TOKEN
    chat_id = channel_id or settings.TELEGRAM_CHANNEL_ID

    if not token or not chat_id:
        raise HTTPException(status_code=500, detail="Telegram Bot settings not configured")

    url = f"https://api.telegram.org/bot{token}/sendDocument"
    
    async with httpx.AsyncClient() as client:
        files = {'document': (filename, file_content)}
        data = {'chat_id': chat_id}
        
        response = await client.post(url, data=data, files=files)
        res_data = response.json()
        
        if not res_data.get("ok"):
            raise HTTPException(status_code=500, detail=f"Telegram upload failed: {res_data.get('description')}")
        
        # Extract file_id to use with a proxy
        # The document object is inside res_data["result"]["document"]
        doc = res_data["result"].get("document")
        video = res_data["result"].get("video")
        photo = res_data["result"].get("photo")
        
        file_id = ""
        if doc:
            file_id = doc.get("file_id")
        elif video:
            file_id = video.get("file_id")
        elif photo:
            # Photo is a list of sizes, get the last one (largest)
            file_id = photo[-1].get("file_id")
            
        if not file_id:
            # Fallback for other types if structure differs
            # Attempt to find any file_id recursively or just fail gracefully
             message_id = res_data["result"]["message_id"]
             return f"https://t.me/{str(chat_id).replace('@', '')}/{message_id}"

        # Return a proxy URL that our backend will handle
        # We assume the backend is running on localhost:8000 (or request.base_url in real app)
        # But here we return a relative path or a known base. 
        # Better to return a special prefix we can detect.
        return f"/api/v1/proxy/telegram/{file_id}"

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

async def upload_file_to_storage(file_content: bytes, filename: str, bot_token: str = None, channel_id: str = None) -> str:
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
            return await upload_to_telegram(file_content, filename, bot_token, channel_id)
    else:
        return await upload_to_telegram(file_content, filename, bot_token, channel_id)
