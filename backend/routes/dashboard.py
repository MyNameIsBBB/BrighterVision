from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime
import pytz

router = APIRouter()

# -----------------
# Mock Global State
# -----------------
device_state = {
    "cane": {
        "latitude": 0.0,
        "longitude": 0.0,
        "sos_status": False,
        "last_updated": None
    },
    "hat": {
        "latest_command": None
    }
}

# ---------------
# Pydantic Models
# ---------------
class CaneData(BaseModel):
    latitude: float
    longitude: float
    sos_status: bool

class HatCommand(BaseModel):
    command: str

# -----------------
# Cane Endpoints
# -----------------
@router.post("/api/hardware/cane")
async def update_cane_data(data: CaneData):
    """
    Endpoint for ESP32 Smart Cane to POST GPS and SOS data.
    """
    device_state["cane"]["latitude"] = data.latitude
    device_state["cane"]["longitude"] = data.longitude
    device_state["cane"]["sos_status"] = data.sos_status
    # Using datetime.now() since utcnow() is being deprecated in newer Python versions
    device_state["cane"]["last_updated"] = datetime.now().isoformat()
    return {"status": "success", "message": "Cane data updated successfully"}

# -----------------
# Dashboard Endpoints
# -----------------
@router.get("/api/dashboard/status")
async def get_dashboard_status():
    """
    Endpoint for Next.js dashboard to fetch the latest location and SOS status.
    """
    return device_state["cane"]

# -----------------
# Hat Endpoints
# -----------------
@router.post("/api/hardware/hat/command")
async def send_hat_command(cmd: HatCommand):
    """
    Endpoint for Next.js app to send a command to the ESP32 Hat.
    """
    device_state["hat"]["latest_command"] = cmd.command
    return {"status": "success", "message": f"Command '{cmd.command}' queued for Hat"}

@router.get("/api/hardware/hat/command")
async def get_hat_command():
    """
    Endpoint for ESP32 Hat to poll for the latest command.
    """
    command = device_state["hat"]["latest_command"]
    # Clear the command after reading so it isn't executed multiple times
    device_state["hat"]["latest_command"] = None
    return {"command": command}
