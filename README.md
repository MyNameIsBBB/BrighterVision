# BrighterVision
> **"Empowering Independence. Illuminating the Path."**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Hardware-ESP32--S3%20|%20ESP32--CAM-green.svg)]()
[![AI Model](https://img.shields.io/badge/AI-YOLOv5-yellow.svg)]()
[![Architecture](https://img.shields.io/badge/Architecture-Cloud--Based-blueviolet.svg)]()

## Overview
**BrighterVision** is a cloud-integrated assistive technology ecosystem designed to enhance the daily lives of visually impaired individuals. By leveraging **Cloud Computing**, we offload heavy AI processing from the wearable devices to a powerful server. This architecture allows the **Smart Glasses** and **Smart Cane** to be lightweight and energy-efficient while utilizing state-of-the-art **YOLOv5** models for object detection via **HTTP** communication.

## Key Features

The system operates on a Client-Server architecture:

### The Smart Cane (IoT Client & Controller)
Acts as the physical interface and hazard detector.
* **Obstacle & Hazard Detection:** Local ultrasonic/moisture sensors detect immediate physical threats (0-2m) and alert via vibration.
* **Remote Command Interface:** Sends trigger signals to the glasses/server:
    * **Button A:** Triggers **Object Detection** request.
    * **Button B:** Triggers **OCR (Read Text)** request.
* **GPS Tracking:** Sends coordinates to the Cloud Dashboard via HTTP POST.
* **SOS Panic Button:** Sends an emergency HTTP request to the server to trigger alerts on the dashboard.

### The Smart Glasses (Vision Client)
Acts as the image capture and audio feedback unit.
* **Cloud-Powered Vision:** Captures images and uploads them via **HTTP POST** to the Cloud Server. The server runs **YOLOv5** and returns the detected object names (e.g., "Car, 12 o'clock").
* **Server-Side OCR:** Uploads images of text to the server for extraction. The server returns the text string to be spoken.
* **Text-to-Speech (TTS):** Receives text/audio response from the server and plays it via bone-conduction headphones.
* **Hands-free Telephony:** Users can Answer/End calls via touch sensors.

### Guardian Cloud Server & Dashboard (The Brain)
The centralized processing hub and monitoring platform.
* **AI Inference Engine:** Hosts **YOLOv5** for object detection and Tesseract for OCR.
* **Live Location Tracking:** Visualizes GPS data sent from the cane on a real-time map.
* **Live Stream:** Receives video frames via HTTP/WebRTC for remote monitoring.
* **REST API:** Handles all incoming requests from devices (Images, GPS, SOS).

---

## Tech Stack

### Hardware (Thin Clients)

**Smart Glasses Unit:**
* **Main Controller:** ESP32-S3 (Dual Core, AI Instructions)
* **Camera Module:** ESP32-CAM (AI Thinker Module with OV2640)
* **Audio Output:** MAX98357A (I2S Amplifier) + Bone Conductor Transducer with Wires - 8 Ohm 1 Watt
* **Audio Input:** INMP441 (I2S Omnidirectional Microphone)
* **Touch Sensor:** TTP223 (Capacitive Touch)

**Smart Cane Unit:**
* **Main Controller:** ESP32-S3
* **Positioning:** U-blox NEO-6M / NEO-8M GPS Module
* **Distance Sensor:** HC-SR04 / JSN-SR04T (Waterproof Ultrasonic)
* **Moisture Sensor:** Capacitive Soil Moisture Sensor v1.2
* **Power:** 2x 18650 Li-ion Batteries (3.7V) with BMS & 5V Boost Converter

### Cloud & Backend
* **Server Framework:** Python (Flask / FastAPI)
* **AI Computer Vision:** **YOLOv5** (Object Detection), PyTorch
* **OCR Engine:** Tesseract / EasyOCR
* **Communication:** **HTTP/HTTPS (REST API)** for all data transfer

### Frontend (Dashboard)
* **Framework:** Next.js 14 / React
* **Maps:** Google Maps API / Leaflet (OpenStreetMap)
* **Styling:** Tailwind CSS

---

## Installation & Setup

### Prerequisites
1.  **Python 3.9+** (For Cloud Server & AI Models)
2.  **Node.js & npm** (For Web Dashboard)
3.  **Arduino IDE 2.0+** (With ESP32 Board Manager installed)
4.  **Hardware:**
    * 1x ESP32-S3 DevKit
    * 1x ESP32-CAM Module
    * Sensors & Wiring components

### 1. Cloud Server Setup
*(Instructions...)*
