# backend/utils/candle_fetcher.py

import ccxt
import pandas as pd
from config import SYMBOLS, TIMEFRAMES

exchange = ccxt.binance()

def fetch_ohlcv(symbol, timeframe='5m', limit=500):
    data = exchange.fetch_ohlcv(symbol, timeframe, limit=limit)
    df = pd.DataFrame(data, columns=['timestamp','open','high','low','close','volume'])
    df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
    return df

def fetch_all_symbols(timeframe='5m', limit=500):
    candles = {}
    for s in SYMBOLS:
        candles[s] = fetch_ohlcv(s, timeframe, limit)
    return candles