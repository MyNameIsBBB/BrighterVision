from fastapi import FastAPI
from routes.object_detection import router as object_detection_router

app = FastAPI()

app.include_router(object_detection_router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
