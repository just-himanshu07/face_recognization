FROM python:3.10-slim

# Install system dependencies for face_recognition and OpenCV
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    g++ \
    libopencv-dev \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Ensure static directories exist
RUN mkdir -p static/faces

# Copy backend requirements
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Expose port 8000
EXPOSE 8000

# Run uvicorn using the PORT environment variable (default 8000 if not set)
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
