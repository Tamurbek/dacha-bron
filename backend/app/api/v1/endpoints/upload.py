from typing import Any, List
from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import uuid
import shutil

router = APIRouter()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "..", "uploads")

@router.post("/file")
async def upload_file(file: UploadFile = File(...)) -> Any:
    # Validate file type (optional but recommended)
    allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".mp4", ".mov", ".webm"}
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="File extension not allowed")

    # Generate unique filename
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    # Save file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")

    # Return the URL of the uploaded file
    # Note: In production, use the actual domain
    return {"url": f"http://localhost:8000/uploads/{unique_filename}", "filename": unique_filename}

@router.post("/files")
async def upload_multiple_files(files: List[UploadFile] = File(...)) -> Any:
    uploaded_files = []
    for file in files:
        res = await upload_file(file)
        uploaded_files.append(res)
    return uploaded_files
