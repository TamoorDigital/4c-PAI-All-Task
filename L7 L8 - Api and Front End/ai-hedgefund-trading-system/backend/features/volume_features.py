import pandas as pd

def add_volume_features(df: pd.DataFrame):

    df["volume_ma_20"] = df["volume"].rolling(20).mean()
    df["volume_ma_50"] = df["volume"].rolling(50).mean()

    df["volume_spike"] = df["volume"] / df["volume_ma_20"]

    df["vwap"] = (df["close"] * df["volume"]).cumsum() / df["volume"].cumsum()

    return df