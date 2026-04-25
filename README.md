# Vision Attendance - Face Recognition System

A premium, modern attendance system using FastAPI, React (Vite), and the `face_recognition` library.

## ✨ Features
- **Real-time Face Recognition**: Uses your webcam to identify users.
- **User Enrollment**: Register new faces with just a name and a snapshot.
- **Attendance Records**: Automated logging with duplicate prevention (auto-logs once per hour).
- **Glassmorphic UI**: High-end aesthetic with dark mode and smooth animations.

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js & npm
- C++ Compiler & CMake (required for building `dlib`)

### Quick Setup

1. **Run the setup script** (Linux/WSL):
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Manual Setup**:
   - **Backend**:
     ```bash
     cd backend
     python -m venv venv
     source venv/bin/activate
     pip install -r requirements.txt
     python main.py
     ```
   - **Frontend**:
     ```bash
     cd frontend
     npm install
     npm run dev
     ```

## 🛠 Tech Stack
- **Backend**: FastAPI, SQLAlchemy (SQLite), OpenCV, face_recognition
- **Frontend**: React, Vite, Vanilla CSS
- **Design**: Premium custom theme with Inter & Outfit typography
