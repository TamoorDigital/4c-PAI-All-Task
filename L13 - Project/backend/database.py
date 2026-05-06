from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import DATABASE_URL
import os
import logging

logger = logging.getLogger(__name__)

# If using sqlite, validate the file path and ensure the directory exists.
if DATABASE_URL.startswith("sqlite"):
    # Expect format sqlite:///absolute/path or sqlite:///relative/path
    _path = DATABASE_URL.replace("sqlite:///", "", 1)
    _path = _path.strip()
    # On Windows paths, convert forward/back slashes consistently
    _path = os.path.abspath(_path)
    _dir = os.path.dirname(_path) or os.getcwd()
    try:
        os.makedirs(_dir, exist_ok=True)
    except Exception as e:
        logger.warning("Could not create sqlite DB directory %s: %s", _dir, e)

    # Reconstruct DATABASE_URL to be absolute and normalized
    _path_url = _path.replace("\\", "/")
    DATABASE_URL = f"sqlite:///{_path_url}"

try:
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
    )
except Exception as e:
    # Provide a clearer error message which includes the attempted DB URL
    logger.exception("Failed to create engine for DATABASE_URL=%s", DATABASE_URL)
    raise
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
