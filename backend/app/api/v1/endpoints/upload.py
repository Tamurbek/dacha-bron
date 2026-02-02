from typing import Any, List
from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import uuid
import shutil

from app.core.telegram_storage import upload_file_to_storage

router = APIRouter()

@router.post("/file")
async def upload_file(file: UploadFile = File(...)) -> Any:
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
    
    # Upload to Telegram/Telegra.ph
    try:
        url = await upload_file_to_storage(content, file.filename)
        print(f"Upload successful: {url}")
        return {"url": url, "filename": file.filename}
    except Exception as e:
        print(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.post("/files")
async def upload_multiple_files(files: List[UploadFile] = File(...)) -> Any:
    uploaded_files = []
    for file in files:
        res = await upload_file(file)
        uploaded_files.append(res)
    return uploaded_files
