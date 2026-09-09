from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings
import logging

logger = logging.getLogger("trackpulse.database")

# Handle SQLite connect args if sqlite
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

try:
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args=connect_args,
        echo=False
    )
except Exception as e:
    logger.warning(f"Failed to connect to primary DB ({settings.DATABASE_URL}). Falling back to SQLite: {e}")
    engine = create_engine(
        "sqlite:///./trackpulse.db",
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
