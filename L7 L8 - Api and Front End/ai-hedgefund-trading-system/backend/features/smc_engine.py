# backend/features/smc_engine.py
def detect_structure(df):
    df['HH'] = df['high'] > df['high'].shift(1)
    df['LL'] = df['low'] < df['low'].shift(1)
    df['BOS'] = df['close'] > df['high'].shift(2)
    df['CHOCH'] = df['close'] < df['low'].shift(2)
    return df