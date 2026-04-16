# StadiSync - Smart Arena Event Manager 🏟️

## 1. Chosen Vertical
**Sports, Entertainment, and Large-Scale Event Management.** 
StadiSync is designed for massive, high-density physical venues (like stadiums holding 50k - 100k+ attendees), addressing critical crowd control, safety, and logistical challenges.

## 2. Approach and Logic
The core logic behind StadiSync is to **decentralize crowd management** by turning every attendee's smartphone into a coordination node, while using **centralized AI** to gather intelligence.
- **The Problem:** Heavy crowds cause lethal stampedes, long localized queue times, and cellular network failures as thousands of phones ping towers simultaneously.
- **The Logic:** Instead of relying on manual radio communication or active GPS tracking (which fails under concrete roofs), we use passive Visual AI (YOLOv8) hooked into existing CCTV cameras to count density. The web application heavily utilizes **offline-first PWA caching (Service Workers)** so that vital venue maps and emergency routes load instantly without needing a constant internet connection.
- **Proactive Safety:** Instead of reacting to crushes, the system proactively models high-traffic zones and triggers an automated **Stampede Prevention Protocol**, broadcasting staggered, guided exit commands utilizing haptic feedback to capture physical attention.

## 3. How the Solution Works
StadiSync functions through a seamless integration between a dual-role frontend interface and a scalable machine-learning backend.

**Frontend (Fan App & Management Dashboard):**
- Built as a **Progressive Web App (PWA)**.
- Users install it via their browser. A **Service Worker** (`sw.js`) automatically caches the interactive venue map, UI elements, and core logic (Network-First approach).
- The Management Dashboard gives security personnel a live look at CCTV densities. If an anomaly is detected, they can trigger mass-alerts.
- Fans receive Web Push notifications and haptic vibrations (via `navigator.vibrate`) alerting them to avoid certain gates dynamically.
- Fans can also send secure SOS emergency locations directly to the security suite.

**Backend Logic (AI Crowd Analysis):**
- Python scripting leverages the **Ultralytics YOLOv8-nano** model (`yolov8n.pt`).
- The AI processes live camera feeds (`detector.py` against `crowd.avi`) by drawing bounding boxes around humans, providing a real-time numerical density count for structural bottlenecks (like gates and washrooms).

## 4. Assumptions Made
- **CCTV Coverage:** We assume the venue has adequate, functioning CCTV cameras pointed at critical structural choke points (exits, narrow corridors, bathrooms) that can pipe video feeds to a local edge-processing node.
- **Smartphone Adoption:** We assume a supermajority of attendees possess a smartphone capable of rendering modern HTML5 web browsers to load the PWA.
- **Network Saturation:** We base our architecture on the assumption that commercial 4G/5G networks *will* heavily degrade during peak occupancy, which is why the StadiSync app requires zero active data streaming to render its interactive 3D map once cached.
- **Hardware Capacity:** AI visual processing (YOLO inference) is assumed to be run locally on Edge Devices (like NVIDIA Jetson Nanos) connected to the local intranet to prevent latency, rather than relying on expensive, slow cloud-video-streaming computations.
