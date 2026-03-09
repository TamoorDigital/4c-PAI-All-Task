import joblib
import torch
import numpy as np

from config import INDICATOR_MODEL_PATH

indicator_model = joblib.load(INDICATOR_MODEL_PATH)

def ensemble_decision(features, transformer_prob, rl_signal):

    ml_pred = indicator_model.predict([features])[0]

    score = 0

    if ml_pred == 1:
        score += 1

    if transformer_prob > 0.7:
        score += 1

    if rl_signal == "LONG":
        score += 1

    if score >= 2:
        return "LONG"

    if score == 0:
        return "SHORT"

    return "NO TRADE"