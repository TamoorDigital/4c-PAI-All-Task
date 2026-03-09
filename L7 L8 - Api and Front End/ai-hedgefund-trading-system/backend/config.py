# backend/config.py

# Backend API
API_HOST = "0.0.0.0"
API_PORT = 5000

# Database
DATABASE_URL = "sqlite:///trades.db"

# Symbols and Timeframes
SYMBOLS = ["BTC/USDT","ETH/USDT","SOL/USDT","TAO/USDT"]
TIMEFRAMES = ["5m","15m","1h","4h"]

# Model Parameters
TRANSFORMER_SEQUENCE = 100
FUTURE_CANDLES = 10

# Risk Management
RISK_REWARD_RATIO = 2
STOP_LOSS_PERCENT = 0.005

# Auto Learning
RETRAIN_AFTER_TRADES = 50
INDICATOR_MODEL_PATH = "models/indicator_model.pkl"
TRANSFORMER_MODEL_PATH = "models/transformer_model.pth"
RL_AGENT_PATH = "models/rl_agent.zip"

# Binance WebSocket
BINANCE_WS_URL = "wss://stream.binance.com:9443/ws"