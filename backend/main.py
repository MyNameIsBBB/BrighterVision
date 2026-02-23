
import socket
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from routes.object_detection import router as object_detection_router
from routes.text_detection import router as text_detection_router

PORT = 3000

def get_local_ip() -> str:
    """ดึงค่า IP Address ภายในเครือข่าย (Local Network) เพื่อใช้ทดสอบผ่านแว่นตาหรือมือถือ"""
    try:
        # ใช้ context manager (with) เพื่อให้แน่ใจว่า socket จะถูกปิดอัตโนมัติ
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(("8.8.8.8", 80))
            return s.getsockname()[0]
    except Exception:
        return "127.0.0.1"

# สร้างตัวแปรแอปพลิเคชัน พร้อมใส่ชื่อโปรเจกต์ให้สวยงามตอนเปิดดูหน้า Swagger UI (Docs)
app = FastAPI(
    title="BrighterVision API", 
    description="Backend Server for Smart Cane & AI Glasses"
)

# ตั้งค่า CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ลงทะเบียน Routes (ใส่ prefix "/api" เผื่ออนาคตมีหลายเวอร์ชัน)
app.include_router(object_detection_router, prefix="/api")
app.include_router(text_detection_router, prefix="/api")

@app.get("/health", tags=["System"])
def health_check():
    """เช็คสถานะการทำงานของ Server"""
    return {"status": "ok", "message": "API is running smoothly"}

@app.post("/health", tags=["System"])
def health_check(request: Request):
    return {"status": "ok", "message": "hello world"}

if __name__ == "__main__":
    local_ip = get_local_ip()
    
    print("=" * 50)
    print("🚀 API Server is running!")
    print(f"🔗 Local:   http://127.0.0.1:{PORT}")
    print(f"🔗 Network: http://{local_ip}:{PORT}")
    print("=" * 50)
    
    uvicorn.run(app, host="0.0.0.0", port=PORT)
