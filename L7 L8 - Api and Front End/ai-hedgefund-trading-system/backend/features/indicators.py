# backend/features/indicators.py
import ta

def add_indicators(df):
    df['rsi'] = ta.momentum.rsi(df['close'], window=14)
    df['ema20'] = ta.trend.ema_indicator(df['close'], 20)
    df['ema50'] = ta.trend.ema_indicator(df['close'], 50)
    df['ema200'] = ta.trend.ema_indicator(df['close'], 200)
    macd = ta.trend.MACD(df['close'])
    df['macd'] = macd.macd_diff()
    bb = ta.volatility.BollingerBands(df['close'])
    df['bb_high'] = bb.bollinger_hband()
    df['bb_low'] = bb.bollinger_lband()
    return df