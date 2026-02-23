from fastapi import APIRouter, Request, UploadFile, File
from ultralytics import YOLO
import easyocr
import cv2
import numpy as np

router = APIRouter()

class ObjectDetection:
    def __init__(self):
        self.model = YOLO("yolo26n.pt") 

    def detect(self, image):
        results = self.model(image, conf=0.5) 
        return results

class TextReader:
    def __init__(self):
        self.reader = easyocr.Reader(['th', 'en'], gpu=False) 

    def read_text(self, image):
        results = self.reader.readtext(image, detail=0)
        return results

detector = ObjectDetection()
ocr_reader = TextReader()

@router.post("/object-detection")
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
                
    return {"most_confident_object": top_object}

@router.post("/ocr")
async def ocr_endpoint(request: Request):
    contents = await request.body()
    
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    detected_texts = ocr_reader.read_text(image)
    
    full_sentence = " ".join(detected_texts)
    
    return {
        "text_found": len(detected_texts) > 0,
        "raw_texts": detected_texts,
        "full_sentence": full_sentence
    }