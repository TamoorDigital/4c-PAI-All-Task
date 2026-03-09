# backend/database.py
from sqlalchemy import create_engine, Column, String, Float, Integer, DateTime, Table, MetaData
from sqlalchemy.orm import sessionmaker
import datetime
from config import DATABASE_URL

engine = create_engine(DATABASE_URL)
metadata = MetaData()

trades = Table(
    'trades', metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('symbol', String),
    Column('signal', String),
    Column('entry', Float),
    Column('stop_loss', Float),
    Column('take_profit', Float),
    Column('confidence', Float),
    Column('result', String, default=None),
    Column('timestamp', DateTime, default=datetime.datetime.utcnow)
)

metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()