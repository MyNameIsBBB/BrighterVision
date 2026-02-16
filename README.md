# BrighterVision
> **"Empowering Independence. Illuminating the Path."**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Hardware-ESP32--S3%20|%20ESP32--CAM-green.svg)]()
[![AI Model](https://img.shields.io/badge/AI-YOLOv5-yellow.svg)]()
[![Architecture](https://img.shields.io/badge/Architecture-Cloud--Based-blueviolet.svg)]()

## Overview
**BrighterVision** is a cloud-integrated assistive technology ecosystem designed to enhance the daily lives of visually impaired individuals. By leveraging **Cloud Computing**, we offload heavy AI processing from the wearable devices to a powerful server. This architecture allows the **Smart Hat** and **Smart Cane** to be lightweight and energy-efficient while utilizing state-of-the-art **YOLOv5** models for object detection via **HTTP** communication.

## Key Features

The system operates on a Client-Server architecture:

### The Smart Cane (IoT Client & Controller)
Acts as the physical interface and hazard detector.
* **Obstacle & Hazard Detection:** Local ultrasonic/moisture sensors detect immediate physical threats (0-2m) and alert via vibration.
* **Remote Command Interface:** Sends trigger signals to the Hat/server:
    * **Button A:** Triggers **Object Detection** request.
    * **Button B:** Triggers **OCR (Read Text)** request.
* **GPS Tracking:** Sends coordinates to the Cloud Dashboard via HTTP POST.
* **SOS Panic Button:** Sends an emergency HTTP request to the server to trigger alerts on the dashboard.

### The Smart Hat (Vision Client)
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

**Smart Hat Unit:**
* **Main Controller:** ESP32-S3 (Dual Core, AI Instructions)
* **Camera Module:** [ESP32-CAM](https://shopee.co.th/product/1588057727/42211997008?gads_t_sig=VTJGc2RHVmtYMTlxTFVSVVRrdENkVEdTU3BlMW9zMXB6bGYrZ0J1VEdQdWJjY0NBU3RZYWp1cWFhLzUyV0JGb2lOYUtYNnorMWw4cjRSclpkb1YvQlQ2M0ZRRkNjVHlpZlhXR1hIcW4yU29HYndicDNJWHNLUnFtRk1nWTlwbHptUGc4V1QyVENCY2VvUFMzWVRFVkN3PT0&gad_source=1&gad_campaignid=23294779400&gbraid=0AAAAADPpYO1RCXtk8zXIT47kyHhIfhwmK&gclid=CjwKCAiA-sXMBhAOEiwAGGw6LBkI-6Kn4Fy0YOf__eU-SPWyFlsl3MbemEGUQ7prBNd5dRKPNHJDuxoCfXEQAvD_BwE) (AI Thinker Module with OV2640)
* **Audio Output:** [MAX98357A](https://shopee.co.th/buyer/login?fu_tracking_id=42276db2564-3f69-4dc5-ba52-76a503f2a60d&next=https%3A%2F%2Fshopee.co.th%2F1-10pcs-MAX98357A-%25E0%25B9%2580%25E0%25B8%2584%25E0%25B8%25A3%25E0%25B8%25B7%25E0%25B9%2588%25E0%25B8%25AD%25E0%25B8%2587%25E0%25B8%2582%25E0%25B8%25A2%25E0%25B8%25B2%25E0%25B8%25A2%25E0%25B9%2580%25E0%25B8%25AA%25E0%25B8%25B5%25E0%25B8%25A2%25E0%25B8%2587%25E0%25B9%2582%25E0%25B8%25A1%25E0%25B8%2594%25E0%25B8%25B9%25E0%25B8%25A5-3006-I2S-3W-Class-D-%25E0%25B9%2580%25E0%25B8%2584%25E0%25B8%25A3%25E0%25B8%25B7%25E0%25B9%2588%25E0%25B8%25AD%25E0%25B8%2587%25E0%25B8%2582%25E0%25B8%25A2%25E0%25B8%25B2%25E0%25B8%25A2%25E0%25B9%2580%25E0%25B8%25AA%25E0%25B8%25B5%25E0%25B8%25A2%25E0%25B8%2587%25E0%25B9%2582%25E0%25B8%2594%25E0%25B8%25A2%25E0%25B9%2584%25E0%25B8%25A1%25E0%25B9%2588%25E0%25B8%2595%25E0%25B9%2589%25E0%25B8%25AD%25E0%25B8%2587%25E0%25B8%2581%25E0%25B8%25A3%25E0%25B8%25AD%25E0%25B8%2587-DIY-%25E0%25B9%2580%25E0%25B8%2584%25E0%25B8%25A3%25E0%25B8%25B7%25E0%25B9%2588%25E0%25B8%25AD%25E0%25B8%2587%25E0%25B8%2582%25E0%25B8%25A2%25E0%25B8%25B2%25E0%25B8%25A2%25E0%25B9%2580%25E0%25B8%25AA%25E0%25B8%25B5%25E0%25B8%25A2%25E0%25B8%2587-MAX98357-BGA-i.445652898.27136796343) (I2S Amplifier) + [Bone Conductor Transducer with Wires - 8 Ohm 1 Watt](https://shopee.ph/Bone-Conductor-Transducer-with-Wires-8-Ohm-1-Watt-i.20469516.827122044)
* **Audio Input:** [INMP441](https://shopee.co.th/โมดูลไมโครโฟน-INMP441-omnidirectional-microphone-module-I2S-สำหรับ-ESP32-บัดกรีขาแล้ว--i.39044974.24256236037) (I2S Omnidirectional Microphone)
* **Touch Sensor:** [TTP223](https://shopee.co.th/（5pcs）โมดูลสวิตช์สัมผัส-TTP223-TTP223B-5-ชิ้น-i.139632720.7413497424) (Capacitive Touch)

**Smart Cane Unit:**
* **Main Controller:** ESP32-S3
* **Positioning:** [U-blox NEO-6M / NEO-8M GPS Module](https://shopee.co.th/(1ชิ้น)-NA389-โมดูลจีพีเอส-GPS-Module-GY-NEO-M8N-Ublox-(GYGPSV1-NEO-8M-GPS-module-สำหรับแทน-NEO-6M-GY-NEO8MV2-(with-...-i.944231623.19179107471)
* **Distance Sensor:** [HC-SR04 / JSN-SR04T](https://shopee.co.th/buyer/login?fu_tracking_id=280bf66e2f1-a055-46c4-973d-f3ff8a88dd9b&next=https%3A%2F%2Fshopee.co.th%2F%25E0%25B9%2582%25E0%25B8%25A1%25E0%25B8%2594%25E0%25B8%25B9%25E0%25B8%25A5%25E0%25B9%2580%25E0%25B8%258B%25E0%25B8%2599%25E0%25B9%2580%25E0%25B8%258B%25E0%25B8%25AD%25E0%25B8%25A3%25E0%25B9%258C%25E0%25B8%25AD%25E0%25B8%25B1%25E0%25B8%25A5%25E0%25B8%2595%25E0%25B8%25A3%25E0%25B8%25B2%25E0%25B9%2582%25E0%25B8%258B%25E0%25B8%2599%25E0%25B8%25B4%25E0%25B8%2581-HC-SR04-HCSR04-HY-SRF05-US-016-JSN-SR04T-i.240783242.23583266381) (Waterproof Ultrasonic)
* **Moisture Sensor:** [Capacitive Soil Moisture Sensor v1.2](https://shopee.co.th/buyer/login?fu_tracking_id=39002d6ce7d-1a73-4ce6-a7a2-8d9deda71ff3&next=https%3A%2F%2Fshopee.co.th%2FCapacitive-soil-moisture-sensor-V1.2-%25E0%25B9%2580%25E0%25B8%258B%25E0%25B9%2587%25E0%25B8%2599%25E0%25B9%2580%25E0%25B8%258B%25E0%25B8%25AD%25E0%25B8%25A3%25E0%25B9%258C%25E0%25B8%25A7%25E0%25B8%25B1%25E0%25B8%2594%25E0%25B8%2584%25E0%25B8%25A7%25E0%25B8%25B2%25E0%25B8%25A1%25E0%25B8%258A%25E0%25B8%25B7%25E0%25B9%2589%25E0%25B8%2599%25E0%25B9%2583%25E0%25B8%2599%25E0%25B8%2594%25E0%25B8%25B4%25E0%25B8%2599%25E0%25B9%2581%25E0%25B8%259A%25E0%25B8%259A-Capacitive-i.132454846.4316676713)
* **Power:** 2x [18650 Li-ion Batteries (3.7V) with BMS & 5V Boost Converter](https://shopee.co.th/search?category=11044956&keyword=แบตเตอรี่%203.7v&subcategory=11045172)

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

