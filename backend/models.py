from sqlalchemy import Column, Integer, String, DateTime, LargeBinary
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    image_path = Column(String)
    # Storing face encoding as bytes for better performance than re-detecting
    face_encoding = Column(LargeBinary) 

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    user_name = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.now)
