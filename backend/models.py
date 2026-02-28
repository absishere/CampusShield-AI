from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, unique=True, index=True) # for anonymous tracking
    hygiene_score = Column(Float, default=100.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ThreatLog(Base):
    __tablename__ = "threat_logs"

    id = Column(Integer, primary_key=True, index=True)
    hashed_url = Column(String, index=True)
    original_url = Column(Text, nullable=True) # Optional plain text
    risk_score = Column(Float)
    threat_category = Column(String)
    explanation = Column(Text)
    cluster_id = Column(Integer, ForeignKey("scam_clusters.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ScamCluster(Base):
    __tablename__ = "scam_clusters"

    id = Column(Integer, primary_key=True, index=True)
    cluster_name = Column(String, index=True) # e.g. "internship_scam_xyz"
    threat_level = Column(String) # High, Medium, Low
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
