# backend/utils/websocket_client.py

import websocket
import json
from threading import Thread
from config import SYMBOLS, BINANCE_WS_URL

def on_message(ws, message):
    data = json.loads(message)
    # Here you would update in-memory candle storage or DB
    print("New candle:", data)

def on_open(ws):
    print("WebSocket connected")
    for symbol in SYMBOLS:
        msg = {
            "method": "SUBSCRIBE",
            "params": [f"{symbol.lower()}@kline_5m"],
            "id": 1
        }
        ws.send(json.dumps(msg))

def start_ws():
    ws = websocket.WebSocketApp(BINANCE_WS_URL, on_open=on_open, on_message=on_message)
    Thread(target=ws.run_forever).start()