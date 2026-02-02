from typing import Any, List
from fastapi import APIRouter, UploadFile, File, HTTPException, Request
import os
import uuid
import shutil
import io
from PIL import Image
import pillow_heif

from app.core.telegram_storage import upload_file_to_storage
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.db_settings import get_telegram_settings, env_settings

from fastapi import Depends

pillow_heif.register_heif_opener()

router = APIRouter()

@router.post("/file")
async def upload_file(request: Request, file: UploadFile = File(...), db: Session = Depends(get_db)) -> Any:
    print(f"Received file: {file.filename}, content_type: {file.content_type}")
    
    # Validate file type (including iPhone formats)
    allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".heic", ".heif", ".mp4", ".mov", ".webm"}
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    print(f"File extension: {file_ext}")
    
    if file_ext not in allowed_extensions:
        print(f"Extension {file_ext} not in allowed list")
        raise HTTPException(status_code=400, detail=f"File extension '{file_ext}' not allowed. Allowed: {allowed_extensions}")

    # Read file content
    content = await file.read()
    print(f"File size: {len(content)} bytes")
    
    # Handle HEIC conversion
    if file_ext in [".heic", ".heif"]:
        try:
            print("Converting HEIC to JPG...")
            image = Image.open(io.BytesIO(content))
            image = image.convert("RGB")
            
            output = io.BytesIO()
            image.save(output, format="JPEG", quality=85)
            content = output.getvalue()
            
            base_name = os.path.splitext(file.filename)[0]
            file.filename = f"{base_name}.jpg"
            file_ext = ".jpg"
            print("Conversion successful")
        except Exception as e:
            print(f"Conversion failed: {e}")
            # Proceed even if conversion failed, attempting upload of original
            pass

    # Fetch settings from DB
    tg_settings = get_telegram_settings(db)
    # Upload strategy:
    # 1. Try generic storage (Telegram/Telegra.ph)
    # 2. If it returns a non-direct link (t.me) or fails, we cannot save locally per user request.
    
    try:
        url = await upload_file_to_storage(
            content, 
            file.filename, 
            bot_token=tg_settings["bot_token"], 
            channel_id=tg_settings["channel_id"]
        )
        print(f"Storage upload result: {url}")
        
        if url.startswith("/api/v1/proxy/telegram/"):
            # Append extension for frontend detection
            if not url.endswith(file_ext):
                url = f"{url}{file_ext}"
                
            # Construct absolute URL
            base = str(request.base_url).rstrip('/')
            url = f"{base}{url}"

        return {"url": url, "filename": file.filename}
            
    except Exception as e:
        print(f"External upload failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.post("/files")
async def upload_multiple_files(request: Request, files: List[UploadFile] = File(...), db: Session = Depends(get_db)) -> Any:
    uploaded_files = []
    for file in files:
        res = await upload_file(request, file, db)
        uploaded_files.append(res)
    return uploaded_files
