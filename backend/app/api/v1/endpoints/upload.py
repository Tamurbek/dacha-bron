from typing import Any, List
from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import uuid
import shutil

from app.core.telegram_storage import upload_file_to_storage

router = APIRouter()

@router.post("/file")
async def upload_file(file: UploadFile = File(...)) -> Any:
    # Validate file type
    allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".mp4", ".mov", ".webm"}
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="File extension not allowed")

    # Read file content
    content = await file.read()
    
    # Upload to Telegram/Telegra.ph
    try:
        url = await upload_file_to_storage(content, file.filename)
        return {"url": url, "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.post("/files")
async def upload_multiple_files(files: List[UploadFile] = File(...)) -> Any:
    uploaded_files = []
    for file in files:
        res = await upload_file(file)
        uploaded_files.append(res)
    return uploaded_files
