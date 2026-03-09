# backend/features/volatility.py
def true_range(df):
    df['prev_close'] = df['close'].shift(1)
    df['tr'] = df[['high','low','prev_close']].apply(lambda row: max(row['high']-row['low'], abs(row['high']-row['prev_close']), abs(row['low']-row['prev_close'])), axis=1)
    return df

def atr(df, period=14):
    df = true_range(df)
    df['atr'] = df['tr'].rolling(period).mean()
    return df