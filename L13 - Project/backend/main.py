import os
from datetime import datetime, timedelta
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
import models
from routes.auth_routes import router as auth_router
from routes.upload_routes import router as upload_router
from routes.generate_routes import router as generate_router
from routes.plan_routes import router as plan_router
from routes.admin_routes import router as admin_router


def startup_cleanup():
    """
    On every server start:
    1. Delete all expired upload records from DB
    2. Wipe any leftover temp files from disk
    """
    db: Session = SessionLocal()
    try:
        cutoff = datetime.utcnow() - timedelta(hours=24)
        expired = db.query(models.Upload).filter(
            models.Upload.created_at < cutoff
        ).all()
        for upload in expired:
            if upload.filepath and os.path.exists(upload.filepath):
                try:
                    os.remove(upload.filepath)
                except OSError:
                    pass
            db.delete(upload)
        if expired:
            db.commit()
            print(f"[Startup] Cleaned {len(expired)} expired upload records")

        # Wipe entire tmp folder on startup
        tmp_dir = os.path.join("uploads", "tmp")
        if os.path.exists(tmp_dir):
            import shutil
            shutil.rmtree(tmp_dir, ignore_errors=True)
            print("[Startup] Cleared tmp upload folder")

    except Exception as e:
        print(f"[Startup] Cleanup error: {e}")
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run on startup
    Base.metadata.create_all(bind=engine)
    startup_cleanup()
    yield
    # (shutdown logic here if needed)


app = FastAPI(
    title="Mentra - AI Study Assistant",
    description="Generate MCQs, short, and long questions from PDF/image uploads using Gemini AI",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)
app.include_router(upload_router)
app.include_router(generate_router)
app.include_router(plan_router)
app.include_router(admin_router)


@app.get("/")
def root():
    return {"message": "AI Study Assistant API is running", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}