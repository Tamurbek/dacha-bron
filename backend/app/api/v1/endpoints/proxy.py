from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
import httpx
import os
from app.core.config import settings
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.db_settings import get_telegram_settings

router = APIRouter()

@router.get("/telegram/{file_id_with_ext}")
async def proxy_telegram_file(file_id_with_ext: str, db: Session = Depends(get_db)):
    """
    Proxies a Telegram file by streaming its content.
    Accepts extensions in URL (e.g. ID.mp4) for better frontend detection.
    """
    # Extract real file_id (remove extension if present)
    file_id = file_id_with_ext.split('.')[0]
    
    # Fetch settings from DB
    tg_settings = get_telegram_settings(db)
    token = tg_settings["bot_token"]
    
    if not token:
        raise HTTPException(status_code=500, detail="Bot token not configured")

    async with httpx.AsyncClient(timeout=60.0) as client:
        # 1. Get file path from Telegram API
        get_file_url = f"https://api.telegram.org/bot{token}/getFile?file_id={file_id}"
        print(f"Proxy: Fetching file path for {file_id}")
        try:
            resp = await client.get(get_file_url)
            data = resp.json()
        except Exception as e:
            print(f"Proxy: Error fetching file path: {str(e)}")
            raise HTTPException(status_code=502, detail=f"Failed to contact Telegram API: {str(e)}")

        if not data.get("ok"):
             print(f"Proxy: Telegram error: {data.get('description')}")
             raise HTTPException(status_code=404, detail="File not found on Telegram")
             
        file_path = data["result"].get("file_path")
        if not file_path:
            raise HTTPException(status_code=404, detail="File path not found")

        # 2. Construct download URL
        download_url = f"https://api.telegram.org/file/bot{token}/{file_path}"
        print(f"Proxy: Streaming from {download_url}")
        
        async def stream_content():
            try:
                # Use a larger timeout for streaming large files
                async with httpx.AsyncClient(timeout=120.0) as stream_client:
                    async with stream_client.stream("GET", download_url) as r:
                        r.raise_for_status()
                        async for chunk in r.aiter_bytes(chunk_size=8192):
                            yield chunk
                print(f"Proxy: Finished streaming {file_id}")
            except Exception as e:
                print(f"Proxy: Stream error for {file_id}: {str(e)}")

        # Detect content type
        content_type = "application/octet-stream"
        ext = os.path.splitext(file_path)[1].lower()
        mime_types = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".gif": "image/gif",
            ".mp4": "video/mp4",
            ".mov": "video/quicktime",
            ".webp": "image/webp"
        }
        content_type = mime_types.get(ext, "application/octet-stream")

        return StreamingResponse(
            stream_content(), 
            media_type=content_type,
            headers={"Cache-Control": "public, max-age=3600"}
        )
