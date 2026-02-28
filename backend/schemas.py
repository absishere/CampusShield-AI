from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class ScanURLRequest(BaseModel):
    url: str
    page_title: Optional[str] = None
    meta_description: Optional[str] = None
    device_id: Optional[str] = None

class ScanResponse(BaseModel):
    risk_score: float
    threat_classification: str
    explanation: str

class ScanQRRequest(BaseModel):
    image_base64: str
    device_id: Optional[str] = None

class DashboardStats(BaseModel):
    total_threats_blocked: int
    active_clusters: int
    recent_threats: List[Dict[str, Any]]
