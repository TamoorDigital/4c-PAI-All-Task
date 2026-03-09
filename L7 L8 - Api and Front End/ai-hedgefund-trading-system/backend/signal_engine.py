import pandas as pd

from features.indicators import add_indicators
from features.volatility import atr
from features.volume_features import add_volume_features
from features.smc_engine import detect_structure

def generate_signal(df):

    df=add_indicators(df)

    df=atr(df)

    df=add_volume_features(df)

    df=detect_structure(df)

    last=df.iloc[-1]

    signal="NO TRADE"

    if last["rsi"] < 30 and last["volume_spike"]:

        signal="LONG"

    if last["rsi"] > 70 and last["volume_spike"]:

        signal="SHORT"

    entry=last["close"]

    stop_loss=entry*0.995

    take_profit=entry*1.02

    return {

        "signal":signal,

        "entry":entry,

        "stop_loss":stop_loss,

        "take_profit":take_profit,

        "confidence":0.85,

        "reason":"RSI + volume spike + structure"
    }