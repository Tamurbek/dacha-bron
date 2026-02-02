from typing import Any, List
from fastapi import APIRouter, UploadFile, File, HTTPException, Request
import os
import uuid
import shutil
import io
from PIL import Image
import pillow_heif

from app.core.telegram_storage import upload_file_to_storage

pillow_heif.register_heif_opener()

router = APIRouter()

# Determine uploads directory
# We want .../backend/uploads which is 4 levels up from this file's directory
UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../uploads"))
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/file")
async def upload_file(request: Request, file: UploadFile = File(...)) -> Any:
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

    # Upload strategy:
    # 1. Try generic storage (Telegram/Telegra.ph)
    # 2. If it returns a non-direct link (t.me) or fails, fallback to local storage
    
    final_url = ""
    use_local = False
    
    try:
        url = await upload_file_to_storage(content, file.filename)
        print(f"Storage upload result: {url}")
        
        if "t.me/" in url:
            print("Returned URL is a Telegram message link (not direct image). Falling back to local storage.")
            use_local = True
        else:
            final_url = url
            
    except Exception as e:
        print(f"External upload failed: {str(e)}. Falling back to local storage.")
        use_local = True

    if use_local:
        try:
            unique_name = f"{uuid.uuid4()}{file_ext}"
            file_path = os.path.join(UPLOAD_DIR, unique_name)
            
            with open(file_path, "wb") as f:
                f.write(content)
            
            # Construct URL using the base URL from the request
            # request.base_url ends with a slash e.g. http://localhost:8000/
            final_url = f"{request.base_url}uploads/{unique_name}"
            print(f"Saved locally: {final_url}")
            
        except Exception as local_e:
             print(f"Local save failed: {str(local_e)}")
             raise HTTPException(status_code=500, detail=f"Failed to save file locally: {str(local_e)}")

    return {"url": final_url, "filename": file.filename}

@router.post("/files")
async def upload_multiple_files(request: Request, files: List[UploadFile] = File(...)) -> Any:
    uploaded_files = []
    for file in files:
        res = await upload_file(request, file)
        uploaded_files.append(res)
    return uploaded_files
