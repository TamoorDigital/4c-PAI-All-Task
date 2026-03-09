# AI Hedge Fund Trading System

## Overview
The **AI Hedge Fund Trading System** is an advanced algorithmic trading platform designed to simulate the architecture of modern quantitative hedge funds. It integrates machine learning, reinforcement learning, and market structure analysis to generate intelligent cryptocurrency trading signals.

The system processes historical market data, extracts technical and structural features, and combines predictions from multiple AI models using an ensemble decision engine.

This project demonstrates how artificial intelligence can be used to build an automated trading pipeline including **data collection, feature engineering, model training, prediction, and automated learning from trades**.

---

# Author
**Tamoor Ejaz**

---

# Project Architecture

```
ai-hedgefund-trading-system
│
├── backend
│   ├── app.py
│   ├── config.py
│   ├── database.py
│   ├── ensemble_engine.py
│
├── auto_learning
│   ├── retrain.py
│   └── trade_logger.py
│
├── data
│   ├── dataset_loader.py
│   ├── dataset_collector.py
│   ├── preprocess.py
│   └── datasets
│
├── features
│   ├── indicators.py
│   ├── smc_engine.py
│   ├── order_blocks.py
│   ├── volatility.py
│   └── volume_features.py
│
├── models
│   ├── train_indicator_model.py
│   ├── train_transformer.py
│   ├── train_rl_agent.py
│   ├── indicator_model.pkl
│   ├── transformer_model.pth
│   └── rl_agent.zip
```

---

# Core Features

## AI Ensemble Trading Engine
The system combines multiple AI models to produce final trading decisions:

- Indicator-based ML model
- Transformer deep learning model
- Reinforcement learning trading agent

These predictions are aggregated using an **ensemble engine** to increase prediction reliability.

---

## Smart Money Concepts (SMC)

The project implements modern institutional trading concepts such as:

- Order Blocks  
- Liquidity Zones  
- Market Structure Shifts  
- Smart Money Flow  

These features help the model understand **institutional trading behavior**.

---

## Technical Indicator Engine

The system computes multiple technical indicators including:

- Moving Averages  
- Momentum Indicators  
- Volatility Measures  
- Volume-based Signals  

These indicators are used as features for machine learning models.

---

## Reinforcement Learning Agent

A reinforcement learning agent learns optimal trading strategies through interaction with historical market environments.

Capabilities include:

- Learning optimal buy/sell decisions  
- Risk management  
- Strategy optimization  

---

## Transformer-Based Market Prediction

A deep learning **Transformer model** analyzes time-series market data to detect complex price patterns and predict future trends.

---

# Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/ai-hedgefund-trading-system.git
```

Move into the project directory:

```bash
cd ai-hedgefund-trading-system
```

---

# Requirements

Make sure the following are installed:

- Python 3.9 or higher
- pip
- Git

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# How to Run This Project

Follow these steps after downloading or cloning the project.

## Step 1: Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Step 2: Prepare Dataset

Ensure datasets are inside:

```
data/datasets/
```

Supported datasets include:

- BTCUSDT
- ETHUSDT
- SOLUSDT
- TAOUSDT

Across timeframes such as:

- 5m
- 15m
- 1h
- 4h

---

## Step 3: Train Machine Learning Models

Run the following commands to train models:

```bash
python backend/models/train_indicator_model.py
```

```bash
python backend/models/train_transformer.py
```

```bash
python backend/models/train_rl_agent.py
```

These scripts will generate trained models such as:

- `indicator_model.pkl`
- `transformer_model.pth`
- `rl_agent.zip`

---

## Step 4: Start the Trading Backend

Run the backend server:

```bash
python backend/app.py
```

The system will then:

- Load trained models
- Process market data
- Generate trading predictions
- Log trades for future learning

---

# Automated Learning System

The system includes a **self-learning pipeline**:

1. Trades are logged using `trade_logger.py`
2. Performance data is collected
3. Models are retrained using `retrain.py`

Run retraining manually if needed:

```bash
python auto_learning/retrain.py
```

---

# Technologies Used

- Python
- PyTorch
- Machine Learning
- Reinforcement Learning
- Time Series Analysis
- Algorithmic Trading
- Cryptocurrency Market Data

---

# Educational Purpose

This project is designed for:

- Learning quantitative finance
- AI trading system development
- Machine learning in financial markets
- Research in algorithmic trading

⚠️ This project is for **educational and research purposes only** and should not be considered financial advice.

---

# Future Improvements

- Live exchange integration
- Risk management engine
- Portfolio optimization
- Web dashboard
- Real-time trading signals
- Docker deployment

---

# License

This project is released for **educational purposes**.

---

⭐ If you like this project, consider giving it a star on GitHub!