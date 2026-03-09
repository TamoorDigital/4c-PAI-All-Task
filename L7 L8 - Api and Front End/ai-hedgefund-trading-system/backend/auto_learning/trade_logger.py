import sqlite3

def log_trade(symbol,signal,entry,sl,tp):

    conn=sqlite3.connect("trades.db")

    c=conn.cursor()

    c.execute(
    "INSERT INTO trades(symbol,signal,entry,stop_loss,take_profit) VALUES (?,?,?,?,?)",
    (symbol,signal,entry,sl,tp)
    )

    conn.commit()