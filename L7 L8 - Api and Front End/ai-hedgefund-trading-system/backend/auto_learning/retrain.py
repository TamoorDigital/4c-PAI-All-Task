import sqlite3
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier

conn=sqlite3.connect("trades.db")

df=pd.read_sql("SELECT * FROM trades",conn)

if len(df)<50:

    print("not enough trades")

    exit()

X=df[["entry"]]

y=df["result"]

model=RandomForestClassifier(n_estimators=200)

model.fit(X,y)

joblib.dump(model,"models/indicator_model.pkl")

print("model retrained")