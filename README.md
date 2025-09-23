# Quant Visualizer

Quant Visualizer is a web application that demonstrates one of the classic quantitative finance ideas — **pairs trading**.  
The app lets you pick two stocks, analyze how closely they move together, and backtest a simple long/short strategy.

---

## Features

- **Auto & Custom modes**  
  Choose from recommended stock pairs or enter your own tickers.

- **Interactive charts**  
  - Price trajectories  
  - Z-Score analysis with trading signal hints  
  - 3D joint distribution  
  - Rolling correlation surface  

- **Backtesting**  
  See net profit, annualized volatility, and performance breakdown for your chosen pair.

- **Downloadable reports**  
  Export the backtest results to Excel for further analysis.

- **AI Assistant**  
  A small floating chatbot that answers questions about the tool, the charts, and pairs trading in plain language.

---

## Tech Stack

- **Frontend:** Next.js (React, TypeScript, TailwindCSS, Plotly.js)  
- **Backend:** FastAPI (Python) with yfinance for stock data  
- **Other:** Vercel (frontend hosting), Render (backend hosting)

---

## How It Works

1. Select a pair of stocks and time range.  
2. The app fetches price data and computes correlation and z-scores.  
3. Charts show how the two assets behave relative to each other.  
4. Backtest simulates a simple strategy:  
   - Long the better-performing stock  
   - Short the weaker stock  
   - Profit comes from their relative performance, not market direction.

---

## Disclaimer

This project is for **educational purposes only**.  
It is not financial advice and should not be used for real trading decisions.

---

## Getting Started (Local)

```bash
# Frontend
npm install
npm run dev

# Backend
cd api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
