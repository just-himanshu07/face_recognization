import face_recognition
import cv2
import numpy as np
from PIL import Image
import io

def get_face_encoding(image_bytes):
    # Load the image from bytes using PIL first
    pil_image = Image.open(io.BytesIO(image_bytes))
    # Convert to numpy array
    image_array = np.array(pil_image)
    
    # Convert RGB to RGB if needed (handle different formats)
    if len(image_array.shape) == 3:
        if image_array.shape[2] == 4:  # RGBA
            image_array = image_array[:, :, :3]
    
    # Get face encodings
    encodings = face_recognition.face_encodings(image_array)
    
    if len(encodings) > 0:
        return encodings[0]
    return None

def compare_faces(known_encoding, face_to_check_bytes):
    # Load the image to check using PIL
    pil_image = Image.open(io.BytesIO(face_to_check_bytes))
    image_array = np.array(pil_image)
    
    # Convert RGBA to RGB if needed
    if len(image_array.shape) == 3:
        if image_array.shape[2] == 4:  # RGBA
            image_array = image_array[:, :, :3]
    
    # Get encodings for all faces in the image
    unknown_encodings = face_recognition.face_encodings(image_array)
    
    for unknown_encoding in unknown_encodings:
        results = face_recognition.compare_faces([known_encoding], unknown_encoding)
        if results[0]:
            return True
    return False

def identify_faces(known_encodings, known_names, frame_bytes):
    # Convert bytes to numpy array for OpenCV
    nparr = np.frombuffer(frame_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if image is None:
        return []
        
    # Convert BGR to RGB (face_recognition uses RGB)
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    face_locations = face_recognition.face_locations(rgb_image)
    face_encodings = face_recognition.face_encodings(rgb_image, face_locations)
    
    found_indices = []
    for face_encoding in face_encodings:
        # Check against all known faces
        matches = face_recognition.compare_faces(known_encodings, face_encoding)
        
        face_distances = face_recognition.face_distance(known_encodings, face_encoding)
        if len(face_distances) > 0:
            best_match_index = np.argmin(face_distances)
            if matches[best_match_index]:
                found_indices.append(best_match_index)
                
    return found_indices
