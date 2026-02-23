from fastapi import APIRouter, Request
import easyocr
import cv2
import numpy as np

router = APIRouter()

class TextReader:
    def __init__(self):
        self.reader = easyocr.Reader(['th', 'en'], gpu=False) 

    def read_text(self, image):
        results = self.reader.readtext(image, detail=0)
        return results

ocr_reader = TextReader()

@router.post("/text-detection")
async def ocr_endpoint(request: Request):
    contents = await request.body()
    
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    detected_texts = ocr_reader.read_text(image)
    
    full_sentence = " ".join(detected_texts)
    
    return {
        "text_found": len(detected_texts) > 0,
        "full_sentence": full_sentence
    }