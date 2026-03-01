from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from schemas import ScanURLRequest, ScanResponse, DashboardStats, ScanQRRequest
from models import User, ThreatLog, ScamCluster
import hashlib
import onnxruntime as ort
import numpy as np
import Levenshtein
from urllib.parse import urlparse
import logging
import base64
from io import BytesIO
try:
    from PIL import Image
    from pyzbar.pyzbar import decode as qr_decode
except ImportError:
    pass

logging.basicConfig(level=logging.INFO)

# Attempt to load the chosen ONNX model on startup for AMD Ryzen AI optimization
try:
    ort_session = ort.InferenceSession("models/phishing_model.onnx")
    logging.info("ONNX AI model loaded successfully.")
except Exception as e:
    ort_session = None
    logging.warning(f"Could not load ONNX model. Ensure train_model.py was executed. Error: {e}")

OFFICIAL_DOMAINS = ["university.edu", "campus.edu", "student-portal.edu"]

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CampusShield AI API")

# Configure CORS for dashboard and extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "CampusShield AI backend is running."}

import time

@app.post("/api/scan-url", response_model=ScanResponse)
def scan_url(request: ScanURLRequest, db: Session = Depends(get_db)):
    url = request.url.lower()
    
    # 1. Rule-based checks (Domain extraction and Levenshtein)
    domain = urlparse(url).netloc.replace("www.", "")
    domain_similarity = 0.0
    for official in OFFICIAL_DOMAINS:
        dist = Levenshtein.distance(domain, official)
        max_len = max(len(domain), len(official))
        sim = 1.0 - (dist / max_len) if max_len > 0 else 0
        if sim > domain_similarity:
            domain_similarity = sim
            
    # If it strongly resembles an official domain without being it, that's incredibly risky
    is_exact_match = domain in OFFICIAL_DOMAINS
    domain_risk = 0.0
    if not is_exact_match and domain_similarity > 0.8:
        domain_risk = 100.0 * domain_similarity
            
    # Urgency Keywords
    urgency_keywords = ["urgent", "verify", "suspend", "payment", "login", "account"]
    keyword_risk = float(sum(20 for kw in urgency_keywords if kw in url))
    keyword_risk = min(keyword_risk, 100.0)

    # --- UPGRADE 4: Suspicious TLD Detection ---
    suspicious_tlds = [".xyz", ".top", ".buzz", ".online", ".info"]
    tld_risk = 20.0 if any(domain.endswith(tld) for tld in suspicious_tlds) else 0.0

    # 2. AI Model Inference (ONNX)
    # --- UPGRADE 6: AMD Integration Benchmarking ---
    phishing_prob = 0.0
    if ort_session:
        try:
            # Model expects 2D string array [[url]]
            input_data = np.array([[url]], dtype=object)
            input_name = ort_session.get_inputs()[0].name
            
            start_time = time.perf_counter()
            pred = ort_session.run(None, {input_name: input_data})
            inference_time = (time.perf_counter() - start_time) * 1000
            
            logging.info(f"⚡ ONNX Inference Latency: {inference_time:.2f} ms")
            
            # Extract probability for class 1 (phishing)
            prob_dict = pred[1][0]
            phishing_prob = prob_dict.get(1, 0.0) * 100.0
        except Exception as e:
            logging.error(f"ONNX inference failed: {e}")

    # 3. Final Risk Scoring Engine
    # --- UPGRADE 2 & Explainability: Dynamic Teach-Back ---
    if is_exact_match:
        final_score = 0.0
        explain = "This is an official university domain. It is completely safe."
        category = "Safe"
    else:
        # Combining signals as per implementation guide
        final_score = (phishing_prob * 0.4) + (domain_risk * 0.3) + (keyword_risk * 0.15) + (tld_risk * 0.15)
        
        if final_score > 75.0:
            category = "Critical Phishing"
            impersonated = [official for official in OFFICIAL_DOMAINS if Levenshtein.distance(domain, official) < 5]
            if impersonated:
                 explain = f"🚨 High Alert: '{domain}' is impersonating '{impersonated[0]}'. Check the spelling! "
            elif tld_risk > 0:
                 explain = f"🚨 High Alert: Uses a highly suspicious top-level domain alongside phishing keywords."
            else:
                 explain = f"🚨 High Alert: AI detected strong phishing signals ({phishing_prob:.0f}% chance)."
        elif final_score > 40.0:
            category = "Suspicious"
            explain = "This domain contains urgent keywords or mildly resembles an official site. Proceed with caution."
        else:
            category = "Low Risk"
            explain = "No major threats detected, but always verify unfamiliar links."
            
    final_score = min(final_score, 100.0)

    # --- UPGRADE 7: Privacy-Preserving Logging ---
    hashed = hashlib.sha256(request.url.encode()).hexdigest()
    log = ThreatLog(
        hashed_url=hashed,
        original_url=request.url if final_score > 40 else None,
        risk_score=final_score,
        threat_category=category,
        explanation=explain
    )
    db.add(log)
    db.commit()

    return ScanResponse(
        risk_score=final_score,
        threat_classification=category,
        explanation=explain
    )

@app.post("/api/scan-qr", response_model=ScanResponse)
def scan_qr(request: ScanQRRequest, db: Session = Depends(get_db)):
    try:
        # Strip potential data URI prefix e.g., 'data:image/png;base64,'
        b64_str = request.image_base64
        if ',' in b64_str:
            b64_str = b64_str.split(',')[1]
            
        image_data = base64.b64decode(b64_str)
        image = Image.open(BytesIO(image_data))
        decoded_objects = qr_decode(image)
        
        if not decoded_objects:
            return ScanResponse(
                risk_score=0.0, 
                threat_classification="Unknown", 
                explanation="No QR code found in the uploaded image."
            )
            
        url = decoded_objects[0].data.decode('utf-8')
        
        # Route the extracted URL through the exact same Threat Engine
        scan_req = ScanURLRequest(url=url, device_id=request.device_id)
        return scan_url(scan_req, db)
        
    except Exception as e:
        logging.error(f"QR decode error: {e}")
        raise HTTPException(status_code=400, detail="Invalid image or unable to parse QR code.")

@app.get("/api/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    count = db.query(ThreatLog).count()
    clusters = db.query(ScamCluster).count()
    
    recent = db.query(ThreatLog).order_by(ThreatLog.created_at.desc()).limit(5).all()
    recent_list = [
        {
            "id": r.id,
            "hashed_url": r.hashed_url,
            "risk_score": r.risk_score,
            "category": r.threat_category,
            "time": r.created_at
        } for r in recent
    ]
    
    return DashboardStats(
        total_threats_blocked=count,
        active_clusters=clusters,
        recent_threats=recent_list
    )

@app.get("/api/dashboard/clusters")
def get_dashboard_clusters(db: Session = Depends(get_db)):
    # Simulating Phase 2 of our Scam Trend AI grouping mechanism
    return {"clusters": [
        {"category": "Fake CSE Internship Portal", "count": 142},
        {"category": "Library Late Fee Phishing", "count": 89},
        {"category": "Hostel WiFi Payment QR Scam", "count": 56},
        {"category": "Forged Scholarship Form", "count": 31}
    ]}
