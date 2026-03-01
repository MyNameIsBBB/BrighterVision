import os
from fastapi import APIRouter, Request, UploadFile, File
from fastapi.responses import FileResponse
import subprocess
from ultralytics import YOLO
import cv2
import numpy as np
import torch

# ปิดข้อความแจ้งเตือนต่างๆ เพื่อให้ Console สะอาดขึ้น
os.environ["YOLO_VERBOSE"] = "False"

router = APIRouter()

device = "mps" if torch.backends.mps.is_available() else "cpu"
print(f"🖥️ Object Detection using device: {device.upper()}")

class ObjectDetection:
    def __init__(self):
        self.model = YOLO("yolo26n.pt") 

    def detect(self, image):
        results = self.model(image, conf=0.5, device=device, verbose=False) 
        return results

detector = ObjectDetection()

@router.post("/button")
async def object_detection_endpoint(request: Request):
    contents = await request.body()
    
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    results = detector.detect(image)
    
    highest_conf = 0.0
    top_object = None
    all_detected = []

    for result in results:
        for box in result.boxes:
            conf = float(box.conf[0]) 
            cls_id = int(box.cls[0])  
            name = result.names[cls_id] 
            
            all_detected.append({
                "object": name,
                "confidence": round(conf, 2)
            })

            if conf > highest_conf:
                highest_conf = conf
                top_object = name
                
    if top_object:
        text_to_speak = f"ตรวจพบ {top_object}"
    else:
        text_to_speak = "ไม่พบวัตถุ"
        
    audio_path = "tmp/audio/audio_object.wav"
    subprocess.run([
        "say", 
        "--file-format=WAVE", 
        "--data-format=LEI16@16000", 
        "-o", audio_path, 
        text_to_speak
    ])
    
    return FileResponse(audio_path, media_type="audio/wav")
