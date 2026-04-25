import os
import io
import shutil
from datetime import datetime, timedelta

from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import numpy as np
import uvicorn

import models
import database
import recognizer

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
models.Base.metadata.create_all(bind=database.engine)

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@app.post("/enroll")
async def enroll_user(name: str = Form(...), file: UploadFile = File(...), db: Session = Depends(database.get_db)):
    # Read image contents
    contents = await file.read()
    
    # Get encoding
    encoding = recognizer.get_face_encoding(contents)
    if encoding is None:
        raise HTTPException(status_code=400, detail="No face detected in image")
    
    # Save image
    file_path = os.path.join(UPLOAD_DIR, f"{name}_{datetime.now().timestamp()}.jpg")
    with open(file_path, "wb") as buffer:
        buffer.write(contents)
    
    # Store in DB
    # Convert numpy array to bytes for storage
    encoding_bytes = encoding.tobytes()
    
    new_user = models.User(name=name, image_path=file_path, face_encoding=encoding_bytes)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": f"User {name} enrolled successfully", "id": new_user.id}

@app.post("/recognize")
async def recognize_attendance(file: UploadFile = File(...), db: Session = Depends(database.get_db)):
    contents = await file.read()
    
    # Get all known encodings
    users = db.query(models.User).all()
    if not users:
        return {"matches": []}
    
    known_encodings = [np.frombuffer(u.face_encoding, dtype=np.float64) for u in users]
    known_names = [u.name for u in users]
    known_ids = [u.id for u in users]
    
    found_indices = recognizer.identify_faces(known_encodings, known_names, contents)
    
    # Mark attendance for found users
    found_names = []
    marked_users = []
    
    # Use set to avoid double-logging the same person from a single frame,
    # but allow multiple entries across different recognition requests.
    for idx in set(found_indices):
        name = known_names[idx]
        u_id = known_ids[idx]
        found_names.append(name)
        
        # Log attendance for every successful recognition request
        attendance_entry = models.Attendance(user_id=u_id, user_name=name)
        db.add(attendance_entry)
        db.commit()
        marked_users.append(name)
            
    return {"matches": found_names, "new_attendance": marked_users}

@app.get("/attendance")
async def get_attendance(db: Session = Depends(database.get_db)):
    logs = db.query(models.Attendance).order_by(models.Attendance.timestamp.desc()).all()
    return logs

@app.get("/users")
async def get_users(db: Session = Depends(database.get_db)):
    users = db.query(models.User).all()
    return [{"id": u.id, "name": u.name} for u in users]

@app.delete("/attendance/{log_id}")
async def delete_attendance(log_id: int, db: Session = Depends(database.get_db)):
    log = db.query(models.Attendance).filter(models.Attendance.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Record not found")
    
    db.delete(log)
    db.commit()
    return {"message": "Attendance record deleted"}

@app.delete("/users/{user_id}")
async def delete_user(user_id: int, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Remove image file
    if user.image_path and os.path.exists(user.image_path):
        os.remove(user.image_path)
        
    # Delete associated attendance records
    db.query(models.Attendance).filter(models.Attendance.user_id == user_id).delete()
        
    db.delete(user)
    db.commit()
    return {"message": "User and associated data deleted"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
