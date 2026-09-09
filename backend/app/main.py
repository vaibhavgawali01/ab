from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routers import trains, routes, stations, replay, prediction, eta, conflicts, analytics, manmad

# Create database tables if not existing
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers with API V1 prefix
app.include_router(trains.router, prefix=settings.API_V1_STR)
app.include_router(routes.router, prefix=settings.API_V1_STR)
app.include_router(stations.router, prefix=settings.API_V1_STR)
app.include_router(replay.router, prefix=settings.API_V1_STR)
app.include_router(prediction.router, prefix=settings.API_V1_STR)
app.include_router(eta.router, prefix=settings.API_V1_STR)
app.include_router(conflicts.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(manmad.router, prefix=settings.API_V1_STR)

# Also register at root level to satisfy the exact paths specified in user prompt:
# /trains, /routes, /stations, /replay, /predict-delay, /calculate-eta, /conflicts, /analytics, /manmad
app.include_router(trains.router)
app.include_router(routes.router)
app.include_router(stations.router)
app.include_router(replay.router)
app.include_router(prediction.router)
app.include_router(eta.router)
app.include_router(conflicts.router)
app.include_router(analytics.router)
app.include_router(manmad.router)

@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "mode": "PROTOTYPE (Simulated / Historical Data Only)",
        "db": "connected"
    }

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to TrackPulse Indian Railways Operations Prototype API",
        "notice": "This is an operational research prototype powered by historical timetable data and ML simulation models. Not connected to live CRIS/GPS feeds.",
        "docs": "/docs",
        "endpoints": [
            "/trains",
            "/routes",
            "/stations",
            "/replay",
            "/predict-delay",
            "/calculate-eta",
            "/conflicts",
            "/analytics"
        ]
    }
