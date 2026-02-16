# BrighterVision 🕶️🦯
> **"Empowering Independence. Illuminating the Path."**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Hardware-ESP32%20|%20RPi-green.svg)]()
[![AI Model](https://img.shields.io/badge/AI-YOLOv5-yellow.svg)]()
[![Architecture](https://img.shields.io/badge/Architecture-Cloud--Based-blueviolet.svg)]()

## 📖 Overview
**BrighterVision** is a cloud-integrated assistive technology ecosystem designed to enhance the daily lives of visually impaired individuals. By leveraging **Cloud Computing**, we offload heavy AI processing from the wearable devices to a powerful server. This architecture allows the **Smart Glasses** and **Smart Cane** to be lightweight and energy-efficient while utilizing state-of-the-art **YOLOv5** models for object detection via **HTTP** communication.



## ✨ Key Features

The system operates on a Client-Server architecture:

### 🦯 The Smart Cane (IoT Client & Controller)
Acts as the physical interface and hazard detector.
* **Obstacle & Hazard Detection:** Local ultrasonic/moisture sensors detect immediate physical threats (0-2m) and alert via vibration.
* **Remote Command Interface:** Sends trigger signals to the glasses/server:
    * *Button A:* Triggers **Object Detection** request.
    * *Button B:* Triggers **OCR (Read Text)** request.
* **GPS Tracking:** Sends coordinates to the Cloud Dashboard via HTTP POST.
* **SOS Panic Button:** Sends an emergency HTTP request to the server to trigger alerts on the dashboard.

### 🕶️ The Smart Glasses (Vision Client)
Acts as the image capture and audio feedback unit.
* **Cloud-Powered Vision:** Captures images and uploads them via **HTTP POST** to the Cloud Server. The server runs **YOLOv5** and returns the detected object names (e.g., "Car, 12 o'clock").
* **Server-Side OCR:** Uploads images of text to the server for extraction. The server returns the text string to be spoken.
* **Text-to-Speech (TTS):** Receives text/audio response from the server and plays it via bone-conduction headphones.
* **Hands-free Telephony:** Users can Answer/End calls via touch sensors.

### 🌐 Guardian Cloud Server & Dashboard (The Brain)
The centralized processing hub and monitoring platform.
* **AI Inference Engine:** Hosts **YOLOv5** for object detection and Tesseract for OCR.
* **Live Location Tracking:** Visualizes GPS data sent from the cane on a real-time map.
* **Live Stream:** Receives video frames via HTTP/WebRTC for remote monitoring.
* **REST API:** Handles all incoming requests from devices (Images, GPS, SOS).

---

## 🛠️ Tech Stack

### Hardware (Thin Clients) ⚙️
* **Smart Glasses:** ESP32 (Image Capture & Audio) + ESP32 Camera Module
* **Smart Cane:** ESP32 (Sensor Controller & GPS)
* **Audio:** Bone Conduction Driver + I2S Microphone
* **Power:** 18650 Li-ion Batteries

### Cloud & Backend (The Heavy Lifters) ☁️
* **Server Framework:** Python (Flask / FastAPI)
* **AI Computer Vision:** **YOLOv5** (Object Detection), Pytorch
* **OCR Engine:** Tesseract / EasyOCR
* **Communication:** **HTTP/HTTPS (REST API)** for all data transfer.

### Frontend (Dashboard) 💻
* **Framework:** Next.js / React
* **Maps:** Google Maps API / Leaflet

---

## 🚀 Installation & Setup

### Prerequisites
1.  Python 3.9+ (For Server)
2.  Node.js & npm (For Dashboard)
3.  ESP32 (For Cane)
4.  ESP32 + ESP32 Camera module (For Glasses)
