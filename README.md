# BrighterVision 🕶️🦯

โปรเจกต์นี้เป็นส่วนหนึ่งของรายวิชา **Hardware Development**  
ภาควิชาวิศวกรรมคอมพิวเตอร์ คณะวิศวกรรมศาสตร์ มหาวิทยาลัยเกษตรศาสตร์

---

## 👥 ผู้พัฒนา

| ชื่อ-นามสกุล | รหัสนิสิต |
|---|---|
| ธนวรรธน์ จุฑาภิรมย์พร | 6810503609 |
| พีรทัศน์ วิจิตรจรัลรุ่ง | 6810503803 |
| ธีรวิทย์ ไวทยวรรณ | 6810503625 |
| กษิต์เดช จันทร์ชู | 6810503366 |

---

## 📁 โครงสร้างโปรเจกต์

```
BrighterVision/
├── backend-api/          # เซิร์ฟเวอร์ FastAPI สำหรับประมวลผล AI
│   ├── main.py           # จุดเริ่มต้นของแอปพลิเคชัน ตั้งค่า CORS และลงทะเบียน routes
│   ├── requirements.txt  # รายการ Python dependencies
│   ├── yolo26n.pt        # ไฟล์ weights ของโมเดล YOLOv8
│   └── routes/
│       ├── object_detection.py  # pipeline ตรวจจับวัตถุ + OCR + TTS
│       ├── text_detection.py    # โมดูลอ่านข้อความด้วย EasyOCR
│       └── dashboard.py         # endpoints สำหรับ GPS, SOS และคำสั่งไปยังหมวก
│
├── esp32/
│   ├── camera/
│   │   └── ESP32CAM.ino        # firmware ESP32-CAM สำหรับเปิด HTTP server ถ่ายภาพ
│   ├── hat/
│   │   └── ESP32S3_hat.ino     # firmware หมวกอัจฉริยะ (WiFi, GPS, เสียง TTS, SOS)
│   └── cane/
│       └── ESP32S3_cane.ino    # firmware ไม้เท้าอัจฉริยะ (ultrasonic, ความชื้น, buzzer)
│
├── web-dashboard/        # แดชบอร์ด Next.js สำหรับผู้ดูแล
│   └── src/app/
│       ├── dashboard/    # หน้าแสดงตำแหน่ง GPS และสถานะ SOS แบบ real-time
│       ├── login/        # หน้าเข้าสู่ระบบ
│       └── profile/      # หน้าโปรไฟล์ผู้ใช้
│
└── Schematic/            # ไดอะแกรมวงจรฮาร์ดแวร์
```

---

## 📦 ไลบรารีที่ใช้

### Python (Backend)
| ไลบรารี | การใช้งาน |
|---|---|
| FastAPI | Web framework สำหรับสร้าง REST API |
| Uvicorn | ASGI server สำหรับรัน FastAPI |
| Ultralytics (YOLOv8) | ตรวจจับวัตถุในภาพ |
| EasyOCR | อ่านข้อความจากภาพ (OCR) |
| OpenCV | ประมวลผลภาพ |
| PyTorch | Deep learning framework |
| Requests | ดึงภาพจาก ESP32-CAM ผ่าน HTTP |

### JavaScript (Web Dashboard)
| ไลบรารี | การใช้งาน |
|---|---|
| Next.js 16 | React framework สำหรับ web dashboard |
| React 19 | UI library |
| Tailwind CSS | จัดสไตล์ UI |
| Framer Motion | animation |
| Lucide React | ไอคอน |

### Arduino / ESP32 (Firmware)
| ไลบรารี | การใช้งาน |
|---|---|
| WiFi.h | เชื่อมต่อ WiFi |
| HTTPClient.h | ส่ง HTTP request ไปยัง backend |
| driver/i2s.h | เล่นเสียงผ่าน I2S (MAX98357A) |
| TinyGPS++ | แปลงข้อมูลจาก GPS module |
| Preferences.h | บันทึก config ลง flash memory |
| WebServer.h | เปิด config portal สำหรับตั้งค่า WiFi |
| esp_camera.h | ควบคุมกล้อง ESP32-CAM |

---

## 🔩 อุปกรณ์ฮาร์ดแวร์

### หมวกอัจฉริยะ (Smart Hat)
| อุปกรณ์ | หน้าที่ |
|---|---|
| ESP32-S3 | ไมโครคอนโทรลเลอร์หลัก |
| ESP32-CAM (AI Thinker) | ถ่ายภาพส่งไปประมวลผลที่เซิร์ฟเวอร์ |
| MAX98357A + ลำโพง | เล่นเสียงแจ้งเตือนผ่าน I2S |
| NEO-6M GPS Module | ติดตามตำแหน่งและส่งพิกัดตอน SOS |
| TTP223 Capacitive Touch | ปุ่มกด SOS |
| แบตเตอรี่ 18650 | จ่ายไฟ |

### ไม้เท้าอัจฉริยะ (Smart Cane)
| อุปกรณ์ | หน้าที่ |
|---|---|
| ESP32-S3 | ไมโครคอนโทรลเลอร์หลัก |
| HC-SR04 Ultrasonic Sensor | วัดระยะห่างสิ่งกีดขวาง |
| Capacitive Soil Moisture Sensor v1.2 | ตรวจจับพื้นเปียก |
| Buzzer Module | แจ้งเตือนเสียงเมื่อพบอันตราย |

---

## 📄 License

MIT License — ดูรายละเอียดที่ [MIT License.md](MIT%20License.md)
