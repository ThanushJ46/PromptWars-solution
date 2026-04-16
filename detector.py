"""
StadiSync - YOLO Edge Inference Script (Concept Prototype)
Requirements: pip install ultralytics opencv-python

This script demonstrates how StadiSync uses a pre-trained YOLOv8/YOLO11
model to count people in a CCTV feed in real-time. It runs entirely on the edge,
providing high accuracy without needing custom training, leveraging the COCO dataset.
"""

from ultralytics import YOLO
import cv2
import json
import time
import sys

def main():
    print("[INIT] Loading PRE-TRAINED YOLO model (yolov8n.pt)...")
    try:
        # We use standard YOLOv8 nano for real-time Edge performance
        model = YOLO('yolov8n.pt') 
    except Exception as e:
        print(f"Error loading model: {e}")
        return

    # In a real environment, this would be an RTSP stream (e.g., 'rtsp://admin:pass@192.168.1.50/stream')
    # For demo purposes, we will attempt to open the default webcam, or you can provide a video path
    video_source = 0 
    
    if len(sys.argv) > 1:
        video_source = sys.argv[1]

    print(f"[INIT] Opening video stream: {video_source}")
    cap = cv2.VideoCapture(video_source)

    if not cap.isOpened():
        print("[ERROR] Cannot open camera or stream.")
        return

    print("[SUCCESS] Processing stream. Press 'q' to exit.")

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Run YOLO inference
        # classes=[0] ensures we ONLY detect the 'person' class in the COCO dataset
        results = model(frame, classes=[0], conf=0.5, verbose=False)

        # Count the number of detections (people)
        current_people_count = len(results[0].boxes)

        # Draw bounding boxes on the frame for visualization
        annotated_frame = results[0].plot()

        # Display the count on the frame
        cv2.putText(annotated_frame, f"CROWD COUNT: {current_people_count}", 
                    (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 3)

        # Simulate pushing this data to the StadiSync backend
        payload = {
            "camera_id": "gate-a",
            "currentPeople": current_people_count,
            "timestamp": time.time()
        }
        print(f"[DATA PUBLISH] {json.dumps(payload)}")

        # Display the frame locally for the security officer dashboard
        cv2.imshow("StadiSync - YOLO CCTV Feed", annotated_frame)

        # Exit condition
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    print("[EXIT] Stream closed.")

if __name__ == "__main__":
    main()
