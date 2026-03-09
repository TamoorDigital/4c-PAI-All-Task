# backend/features/order_blocks.py
def bullish_order_block(df):
    df['bull_ob'] = (df['close'] > df['open']) & (df['volume']>df['volume'].rolling(20).mean()*1.5)
    return df

def bearish_order_block(df):
    df['bear_ob'] = (df['close'] < df['open']) & (df['volume']>df['volume'].rolling(20).mean()*1.5)
    return df