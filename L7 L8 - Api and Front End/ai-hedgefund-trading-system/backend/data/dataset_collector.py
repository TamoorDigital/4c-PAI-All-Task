# backend/data/dataset_collector.py
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.candle_fetcher import fetch_ohlcv
from config import SYMBOLS, TIMEFRAMES

DATA_DIR = "./"

def collect():
    for s in SYMBOLS:
        for tf in TIMEFRAMES:
            df = fetch_ohlcv(s, tf, limit=5000)
            filename = os.path.join(DATA_DIR, f"dataset_{s.replace('/','')}_{tf}.csv")
            df.to_csv(filename, index=False)
            print("Saved", filename)

if __name__=="__main__":
    collect()