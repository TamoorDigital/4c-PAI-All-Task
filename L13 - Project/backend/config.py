import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "changeme-super-secret-key-123")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./study_assistant.db")

PLAN_LIMITS = {
    "free": {
        "uploads_per_day": 5,
        "files_at_once": 1,
        "mcq_limit": 20,
        "short_limit": 10,
        "long_limit": 5,
        "price": 0,
    },
    "basic": {
        "uploads_per_day": 20,
        "files_at_once": 3,
        "mcq_limit": 50,
        "short_limit": 25,
        "long_limit": 10,
        "price": 5,
    },
    "advanced": {
        "uploads_per_day": 50,
        "files_at_once": 10,
        "mcq_limit": 300,
        "short_limit": 75,
        "long_limit": 25,
        "price": 15,
    },
}

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)