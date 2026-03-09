# backend/models/train_indicator_model.py
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
from data.dataset_loader import load_all
from features.indicators import add_indicators

df = load_all()
df = add_indicators(df)
df['target'] = (df['close'].shift(-10) > df['close']).astype(int)
features = ['open','high','low','close','volume','rsi','ema20','ema50','ema200','macd','bb_high','bb_low']
df.dropna(inplace=True)
X = df[features]
y = df['target']

X_train,X_test,y_train,y_test = train_test_split(X,y,test_size=0.2)
model = RandomForestClassifier(n_estimators=500)
model.fit(X_train,y_train)
joblib.dump(model,"../models/indicator_model.pkl")
print("Indicator model trained")