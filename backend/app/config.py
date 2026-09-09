import os

class Settings:
    PROJECT_NAME: str = "TrackPulse"
    VERSION: str = "1.0.0-prototype"
    DESCRIPTION: str = "Prototype Railway Operations Decision Support System for Indian Railways (Simulated & Historical Data)"
    API_V1_STR: str = "/api/v1"
    
    # Database configuration: defaults to local SQLite, or uses POSTGRES_URL if provided
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./trackpulse.db"
    )
    
    # Simulation settings
    DEFAULT_SIMULATION_SPEED: int = 1
    MAX_SIMULATION_SPEED: int = 60
    
    # Control room defaults
    DEFAULT_CORRIDOR: str = "NDLS-HWH"
    
    # Punctuality threshold in minutes (Indian Railways standards: <= 15 mins for Express)
    PUNCTUALITY_TOLERANCE_MINS: int = 15

settings = Settings()
