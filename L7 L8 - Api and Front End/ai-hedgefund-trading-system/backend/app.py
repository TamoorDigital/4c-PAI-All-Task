from flask import Flask,request,jsonify
from flask_cors import CORS
import pandas as pd

from signal_engine import generate_signal
from utils.candle_fetcher import fetch_ohlcv

app=Flask(__name__)

CORS(app)

@app.route("/generate-signal",methods=["POST"])

def signal():

    data=request.json

    symbol=data["symbol"]

    df=fetch_ohlcv(symbol,"5m",500)

    result=generate_signal(df)

    return jsonify(result)


if __name__=="__main__":

    app.run(port=5000)