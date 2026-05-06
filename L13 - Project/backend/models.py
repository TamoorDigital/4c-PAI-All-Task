from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    plan = Column(String, default="free")
    is_admin = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    uploads_today = Column(Integer, default=0)
    # Store as YYYY-MM-DD string — compared against date.today() on every upload
    last_upload_date = Column(String, default="1970-01-01")

    uploads = relationship("Upload", back_populates="owner", cascade="all, delete-orphan")
    generations = relationship("Generation", back_populates="owner", cascade="all, delete-orphan")


class Upload(Base):
    __tablename__ = "uploads"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    # filepath is now nullable — file is deleted from disk after text extraction
    filepath = Column(String, nullable=True)
    extracted_text = Column(Text, default="")
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    # When this upload record auto-expires and gets deleted from DB
    expires_at = Column(DateTime, nullable=True)

    owner = relationship("User", back_populates="uploads")
    generations = relationship(
        "Generation",
        back_populates="upload",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class Generation(Base):
    __tablename__ = "generations"

    id = Column(Integer, primary_key=True, index=True)
    gen_type = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    count = Column(Integer, default=0)
    difficulty = Column(String, default="important")
    user_id = Column(Integer, ForeignKey("users.id"))
    upload_id = Column(Integer, ForeignKey("uploads.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="generations")
    upload = relationship("Upload", back_populates="generations")