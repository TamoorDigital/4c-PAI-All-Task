# backend/data/dataset_loader.py

import pandas as pd
import os
from config import SYMBOLS, TIMEFRAMES



BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_dataset(symbol, tf):
    safe_symbol = symbol.replace("/", "")
    filename = os.path.join(BASE_DIR, f"dataset_{safe_symbol}_{tf}.csv")

    if not os.path.exists(filename):
        raise Exception(f"Dataset not found: {filename}")

    return pd.read_csv(filename)

# DATA_DIR = "./"

# def load_dataset(symbol, timeframe):
#     filename = os.path.join(DATA_DIR, f"dataset_{symbol.replace('/','')}_{timeframe}.csv")
#     if not os.path.exists(filename):
#         raise Exception(f"Dataset not found: {filename}")
#     df = pd.read_csv(filename)
#     return df

def load_all():
    frames = []
    for s in SYMBOLS:
        for tf in TIMEFRAMES:
            df = load_dataset(s, tf)
            df["symbol"] = s
            df["timeframe"] = tf
            frames.append(df)
    return pd.concat(frames)