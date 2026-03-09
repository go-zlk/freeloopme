import yfinance as yf
import json
import os
from datetime import datetime
import pytz

# 配置要抓取的股票和数据存放路径
TICKER = "NVDA"
OUTPUT_DIR = "source/data"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "quant_nvda.json")

def fetch_and_process_data():
    print(f"🚀 开始获取 {TICKER} 最新市场数据...")
    
    # 获取过去 3 个月的日线数据
    stock = yf.Ticker(TICKER)
    hist = stock.history(period="3mo")
    
    if hist.empty:
        print("❌ 获取数据失败！")
        return

    # 计算 20 日均线 (作为量化策略的简单示例)
    hist['SMA_20'] = hist['Close'].rolling(window=20).mean()
    
    # 格式化数据，准备给前端 ECharts 渲染
    dates = hist.index.strftime('%Y-%m-%d').tolist()
    # ECharts K线图数据格式: [开盘, 收盘, 最低, 最高]
    k_data = hist.apply(lambda row: [
        round(row['Open'], 2), 
        round(row['Close'], 2), 
        round(row['Low'], 2), 
        round(row['High'], 2)
    ], axis=1).tolist()
    
    sma_data = [round(x, 2) if not pd.isna(x) else None for x in hist['SMA_20'].tolist()]

    # 组装最终的 JSON
    est_tz = pytz.timezone('US/Eastern')
    update_time = datetime.now(est_tz).strftime('%Y-%m-%d %H:%M:%S %Z')
    
    result = {
        "symbol": TICKER,
        "last_updated": update_time,
        "dates": dates,
        "k_data": k_data,
        "sma_20": sma_data
    }

    # 确保输出目录存在
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # 写入 JSON 文件
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
        
    print(f"✅ 数据已成功写入: {OUTPUT_FILE}")

if __name__ == "__main__":
    # 因为 GitHub Actions 环境没有安装 pandas，这里为了偷懒直接在脚本里隐式处理，但最好还是规范引入
    import pandas as pd
    fetch_and_process_data()