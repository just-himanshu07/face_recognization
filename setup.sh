#!/bin/bash

# Install system dependencies for face_recognition and dlib
sudo apt-get update
sudo apt-get install -y build-essential cmake libopenblas-dev liblapack-dev libx11-dev libgtk-3-dev

# Setup python environment
cd backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

echo "Backend setup complete."

# Frontend setup was already done via create-vite and npm install in previous step
# (Though in some environments, npm install might need to be run again)
cd ../frontend
npm install

echo "Frontend setup complete."
echo "To run the system:"
echo "1. Start backend: cd backend && source venv/bin/activate && python3 main.py"
echo "2. Start frontend: cd frontend && npm run dev"
