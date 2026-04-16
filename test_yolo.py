import cv2
from ultralytics import YOLO
import sys
import os

def main():
    print("Loading video 'crowd.avi'...")
    cap = cv2.VideoCapture("crowd.avi")
    
    # Fast forward to frame 50 to get a good packed crowd shot
    ret = False
    for i in range(50):
        ret, frame = cap.read()
        
    if not ret:
        print("Error: Could not read video frame.")
        sys.exit(1)
        
    print("Video frame loaded. Initializing YOLO model...")
    # Load YOLOv8 Nano model (pretrained on COCO)
    model = YOLO("yolov8n.pt")
    
    print("Running inference...")
    # class 0 is 'person'
    results = model(frame, classes=[0], conf=0.3)
    
    # Save the annotated frame to the scratch directory
    output_dir = "C:/Users/THANUSH/.gemini/antigravity/brain/cb8c9d69-3bbb-4533-b653-150c38048598/scratch"
    os.makedirs(output_dir, exist_ok=True)
    out_file = os.path.join(output_dir, "yolo_test.jpg")
    
    results[0].save(out_file)
    print(f"Success! Detected {len(results[0].boxes)} people. Image saved to {out_file}")

if __name__ == "__main__":
    main()
