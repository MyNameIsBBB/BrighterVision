# BrighterVision 🕶️🦯
> **"Empowering Independence. Illuminating the Path."**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Raspberry_Pi_|_ESP32-green.svg)]()
[![Status](https://img.shields.io/badge/status-Prototype-orange.svg)]()

## 📖 Overview (ภาพรวมโครงการ)
**BrighterVision** is an integrated assistive technology system designed to enhance the daily lives of visually impaired individuals. By combining a **Smart Cane** with **AI-powered Smart Glasses**, the system provides real-time environmental feedback, object recognition, and navigation assistance, allowing users to move with greater confidence and safety.

[Image of blind assistive technology system architecture]

## ✨ Key Features (ฟีเจอร์หลัก)

The system consists of two synchronized devices working together:

### 🦯 The Smart Cane (ไม้เท้าอัจฉริยะ)
* **Obstacle Detection:** Ultrasonic/LiDAR sensors detect obstacles from waist down to ground level (0-2 meters).
* **Haptic Feedback:** Vibrates the handle with varying intensity based on the distance of the obstacle.
* **Water/Puddle Detection:** Alerts the user to wet surfaces to prevent slipping.
* **SOS Panic Button:** Sends GPS location to emergency contacts when pressed.
* **Night Mode:** Auto-activates LED lights in low-light conditions for visibility to others.

### 🕶️ The Smart Glasses (แว่นตา AI)
* **Object Recognition (YOLO):** Identifies objects (e.g., "Car," "Person," "Chair") and speaks them out via bone-conduction audio.
* **Text-to-Speech (OCR):** Reads signs, menus, or books instantly when the user looks at them.
* **Scene Description:** Describes the environment (e.g., "You are at a crosswalk").
* **Navigation Assistant:** Provides turn-by-turn voice directions.

---

## 🛠️ Tech Stack (เทคโนโลยีที่ใช้)

### Hardware ⚙️
* **Microcontrollers:** Raspberry Pi 5 (Glasses), ESP32 (Cane)
* **Sensors:** HC-SR04 Ultrasonic, MPU6050 Gyroscope, Moisture Sensor
* **Camera:** Raspberry Pi Camera Module V2 / ESP32-CAM
* **Output:** Vibration Motors, Bone Conduction Headphones / Buzzer
* **Power:** 18650 Li-ion Batteries

### Software & AI 💻
* **Languages:** Python (AI/Logic), C++ (Microcontroller Firmware)
* **AI Models:** YOLOv8 (Object Detection), Tesseract (OCR)
* **Communication:** MQTT / WebSocket (Device Sync), Bluetooth Low Energy (BLE)
* **Text-to-Speech:** Google TTS / eSpeak

---

## 🚀 Installation & Setup (การติดตั้ง)

### Prerequisites
1.  Python 3.9+
2.  Arduino IDE / PlatformIO
3.  Raspberry Pi OS (Bullseye or later)

### 1. Smart Glasses Setup (Raspberry Pi)
```bash
# Clone the repository
git clone [https://github.com/yourusername/BrighterVision.git](https://github.com/yourusername/BrighterVision.git)

# Navigate to the vision directory
cd BrighterVision/vision_system

# Install dependencies
pip install -r requirements.txt

# Run the AI Engine
python main_vision.py
