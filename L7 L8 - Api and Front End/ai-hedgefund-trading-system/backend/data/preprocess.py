# backend/data/preprocess.py
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import pandas as pd

from dataset_loader import load_all

from features.indicators import add_indicators
from features.volatility import atr
from features.volume_features import add_volume_features
from features.smc_engine import detect_structure


def clean_data(df):

    df = df.copy()

    # remove duplicates
    df = df.drop_duplicates()

    # convert numeric
    cols = ["open","high","low","close","volume"]

    for c in cols:
        df[c] = pd.to_numeric(df[c], errors="coerce")

    # remove missing values
    df = df.dropna()

    return df


def add_features(df):

    df = add_indicators(df)

    df = atr(df)

    df = add_volume_features(df)

    df = detect_structure(df)

    return df


def create_target(df, future_candles=10):

    df["future_close"] = df["close"].shift(-future_candles)

    df["target"] = (df["future_close"] > df["close"]).astype(int)

    return df


def preprocess():

    print("Loading datasets...")

    df = load_all()

    print("Cleaning data...")

    df = clean_data(df)

    print("Adding features...")

    df = add_features(df)

    print("Creating target labels...")

    df = create_target(df)

    df = df.dropna()

    print("Saving processed dataset...")

    df.to_csv("processed_dataset.csv", index=False)

    print("Dataset ready for training")

    return df


if __name__ == "__main__":

    preprocess()