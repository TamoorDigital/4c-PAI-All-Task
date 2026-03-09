# backend/utils/helpers.py

def calculate_rr(entry, stop_loss, take_profit):
    risk = abs(entry - stop_loss)
    reward = abs(take_profit - entry)
    return reward / risk