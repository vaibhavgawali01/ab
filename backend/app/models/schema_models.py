from sqlalchemy import Column, Integer, String, Float, Boolean, JSON, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class StationModel(Base):
    __tablename__ = "stations"
    
    code = Column(String(10), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    zone = Column(String(10), nullable=False)
    division = Column(String(50), nullable=False)
    platforms = Column(Integer, default=2)
    category = Column(String(20), default="NSG-3")

class RouteModel(Base):
    __tablename__ = "routes"
    
    id = Column(String(20), primary_key=True, index=True)
    code = Column(String(30), unique=True, index=True)
    name = Column(String(150), nullable=False)
    total_distance_km = Column(Float, nullable=False)
    electrified = Column(Boolean, default=True)
    tracks = Column(Integer, default=2)
    max_permissible_speed_kmh = Column(Integer, default=130)
    stops_data = Column(JSON, nullable=False)
    critical_bottlenecks = Column(JSON, default=list)

class TrainModel(Base):
    __tablename__ = "trains"
    
    train_number = Column(String(20), primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    type = Column(String(50), nullable=False)
    priority = Column(Integer, default=3)
    corridor_code = Column(String(30), nullable=False)
    origin = Column(String(10), nullable=False)
    destination = Column(String(10), nullable=False)
    locomotive = Column(String(100))
    rake_type = Column(String(100))
    max_speed_kmh = Column(Integer, default=110)
    avg_speed_kmh = Column(Float, default=75.0)
    schedule = Column(JSON, nullable=False)
    current_status = Column(JSON, nullable=False)

class ConflictRecord(Base):
    __tablename__ = "conflicts"
    
    id = Column(String(40), primary_key=True, index=True)
    corridor_code = Column(String(30), nullable=False)
    conflict_type = Column(String(50), nullable=False) # Headway, Platform, Overtake/Precedence
    severity = Column(String(20), nullable=False) # Critical, Warning, Advisory
    location = Column(String(100), nullable=False)
    train_primary = Column(String(20), nullable=False)
    train_secondary = Column(String(20), nullable=False)
    description = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)
    resolved = Column(Boolean, default=False)
    resolution_applied = Column(String(100), nullable=True)
    detected_at = Column(DateTime, default=datetime.utcnow)

class HistoricalDelayRecord(Base):
    __tablename__ = "historical_delays"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    train_number = Column(String(20), index=True)
    section = Column(String(50), nullable=False)
    scheduled_hour = Column(Integer, nullable=False)
    day_of_week = Column(String(15), nullable=False)
    weather = Column(String(50), default="Clear")
    visibility_meters = Column(Integer, default=2000)
    speed_restriction_kmh = Column(Integer, default=110)
    congestion_index = Column(Float, default=0.5)
    dwell_delay_mins = Column(Integer, default=0)
    actual_delay_mins = Column(Integer, default=0)
    primary_cause = Column(String(100))
    secondary_cause = Column(String(100))
