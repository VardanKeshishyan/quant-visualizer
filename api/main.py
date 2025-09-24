
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from fastapi.responses import Response
from fastapi.responses import JSONResponse

import pandas as pd
import numpy as np
import yfinance as yf
import io
import math

app = FastAPI(title="Quant Backend")

@app.get("/")
def root():
    return {"message": "API is live"}
    
@app.post("/api/assistant")
async def assistant(request: Request):
    payload = await request.json()
    msg = payload.get("message", "")
    return {"text": f"(Echo) You said: {msg}"}


@app.get("/health")
def health():
    return {"status": "ok"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],         
    allow_credentials=True,
    allow_methods=["*"],         
    allow_headers=["*"],
)

@app.options("/{rest_of_path:path}")
async def preflight_handler(rest_of_path: str):
    return JSONResponse(content={"ok": True})


class SummaryIn(BaseModel):
    ticker1: str = Field(..., examples=["NVDA"])
    ticker2: str = Field(..., examples=["AMD"])
    start_date: str = Field(..., examples=["2023-01-01"])
    end_date: str = Field(..., examples=["2024-01-01"])
    initial_invest: float = 1000.0


def _clean_json(x):
    if isinstance(x, float):
        return None if (math.isnan(x) or math.isinf(x)) else float(x)
    if isinstance(x, (np.floating, np.integer)):
        v = x.item()
        if isinstance(v, float) and (math.isnan(v) or math.isinf(v)):
            return None
        return v
    if isinstance(x, (list, tuple)):
        return [_clean_json(v) for v in x]
    if isinstance(x, dict):
        return {k: _clean_json(v) for k, v in x.items()}
    if isinstance(x, np.ndarray):
        return _clean_json(x.tolist())
    return x


def fetch_prices(t1: str, t2: str, start: str, end: str) -> pd.DataFrame:
    
    try:
        df = yf.download([t1, t2], start=start, end=end,
                         progress=False, auto_adjust=True, threads=False)
        if not df.empty and isinstance(df.columns, pd.MultiIndex):
            lvl0 = df.columns.get_level_values(0)
            root = "Adj Close" if "Adj Close" in lvl0 else ("Close" if "Close" in lvl0 else lvl0[0])
            prices = df.loc[:, (root, slice(None))]
            prices.columns = prices.columns.droplevel(0)
            prices = prices[[c for c in prices.columns if c in [t1, t2]]].dropna()
            if not prices.empty and set([t1, t2]).issubset(prices.columns):
                if prices.shape[0] < 5:
                    raise ValueError("Not enough historical rows; widen the date range.")
                return prices.astype(float)
    except Exception:
        pass

    
    try:
        p1 = yf.download(t1, start=start, end=end, progress=False, auto_adjust=True, threads=False)
        p2 = yf.download(t2, start=start, end=end, progress=False, auto_adjust=True, threads=False)
    except Exception as e:
        raise ValueError(f"yfinance error while fetching {t1},{t2}: {e}")

    def pick_price_column(df: pd.DataFrame) -> pd.Series:
        if df.empty:
            raise ValueError("No data returned")
        if isinstance(df, pd.Series):
            return df.astype(float)
        cols = list(df.columns)
        for c in ["Adj Close", "Close"]:
            if c in cols:
                return df[c].astype(float)
        return df.iloc[:, 0].astype(float)

    s1 = pick_price_column(p1).rename(t1)
    s2 = pick_price_column(p2).rename(t2)
    prices = pd.concat([s1, s2], axis=1).dropna()
    if prices.shape[0] < 5:
        raise ValueError("Not enough historical rows; widen the date range.")
    return prices.astype(float)


def compute_summary(t1: str, t2: str, start: str, end: str, capital: float):
    prices = fetch_prices(t1, t2, start, end)
    dates = prices.index.strftime("%Y-%m-%d").tolist()

    s1 = [float(v) for v in prices[t1].tolist()]
    s2 = [float(v) for v in prices[t2].tolist()]

    rets = prices.pct_change().dropna()
    spread = rets[t1] - rets[t2]
    if spread.std(ddof=0) == 0 or np.isnan(spread.std(ddof=0)):
        zscores = [0.0] * len(spread)
    else:
        zscores = ((spread - spread.mean()) / spread.std()).fillna(0).astype(float).tolist()
    z_dates = rets.index.strftime("%Y-%m-%d").tolist()

    
    joint = {"x": [], "y": [], "z": [], "corr": 0.0}
    try:
        x_grid = np.linspace(rets[t1].min(), rets[t1].max(), 50)
        y_grid = np.linspace(rets[t2].min(), rets[t2].max(), 50)
        X, Y = np.meshgrid(x_grid, y_grid)
        mu = np.array([rets[t1].mean(), rets[t2].mean()], dtype=float)
        cov = np.array(rets[[t1, t2]].cov().values, dtype=float)
        if not np.isfinite(cov).all():
            raise ValueError("bad cov")
        cov = cov + 1e-12 * np.eye(2)
        inv = np.linalg.inv(cov)
        det = float(np.linalg.det(cov))
        diff = np.dstack((X, Y)) - mu
        expo = -0.5 * np.einsum("...i,ij,...j", diff, inv, diff)
        norm = 1.0 / (2.0 * np.pi * np.sqrt(max(det, 1e-24)))
        Z = norm * np.exp(expo)
        corr = float(np.corrcoef(rets[t1].fillna(0), rets[t2].fillna(0))[0, 1])
        joint = {
            "x": x_grid.astype(float).tolist(),
            "y": y_grid.astype(float).tolist(),
            "z": Z.astype(float).tolist(),
            "corr": corr,
        }
    except Exception:
        pass

    
    windows = [30, 60, 90]
    z_corr = []
    for w in windows:
        r = rets[t1].rolling(w).corr(rets[t2]).to_numpy(dtype=float)
        z_corr.append(r)
    z = np.vstack(z_corr) if z_corr else np.empty((0, 0))
    z_list = z.tolist()
    z_list = [[(None if (v is None or not np.isfinite(v)) else float(v)) for v in row] for row in z_list]
    rolling_surface = {"x_index": list(range(len(rets))), "windows": windows, "z": z_list}

    
    cum = (1 + rets).cumprod() - 1
    last1 = float(cum[t1].iloc[-1])
    last2 = float(cum[t2].iloc[-1])
    if last1 >= last2:
        outperformer, underperformer = t1, t2
        long_profit = capital * last1
        short_profit = -capital * last2
    else:
        outperformer, underperformer = t2, t1
        long_profit = capital * last2
        short_profit = -capital * last1
    net = float(long_profit + short_profit)
    risk = float(rets[[t1, t2]].std().mean() * np.sqrt(252))

    result = {
        "price_plot": {"dates": dates, "series1": s1, "series2": s2, "ticker1": t1, "ticker2": t2},
        "zscore_plot": {"dates": z_dates, "zscores": zscores},
        "joint_3d": joint,
        "rolling_corr_surface": rolling_surface,
        "backtest": [
            {"Metric": "Outperformer", "Value": outperformer},
            {"Metric": "Underperformer", "Value": underperformer},
            {"Metric": "Net Profit", "Value": f"{net:.2f}"},
            {"Metric": "Annualized Volatility", "Value": f"{risk*100:.2f}%"},
        ],
    }
    return _clean_json(result)


def _excel_rows_from_data(data: dict, t1: str, t2: str, start: str, end: str, capital: float):
    """
    Build the exact 'Metric / Value' rows you had in Streamlit:
      - Stock Pair
      - Outperforming Asset (xx.xx%)
      - Underperforming Asset (xx.xx%)
      - Net Profit   (Long $X A, Short $X B: $Z)
      - Annualized Volatility (Risk Measure)
      - Time Period (years/months)
    """
    import pandas as pd
    import numpy as np
    from dateutil.relativedelta import relativedelta

    
    s1 = pd.Series(data["price_plot"]["series1"], dtype=float)
    s2 = pd.Series(data["price_plot"]["series2"], dtype=float)
    r1 = (float(s1.iloc[-1]) / float(s1.iloc[0]) - 1.0) if len(s1) >= 2 else 0.0
    r2 = (float(s2.iloc[-1]) / float(s2.iloc[0]) - 1.0) if len(s2) >= 2 else 0.0

    if r1 >= r2:
        out_name, out_pct = t1, r1 * 100
        under_name, under_pct = t2, r2 * 100
    else:
        out_name, out_pct = t2, r2 * 100
        under_name, under_pct = t1, r1 * 100

    
    try:
        risk_str = next(x["Value"] for x in data["backtest"] if x["Metric"] == "Annualized Volatility")
    except StopIteration:
        rets = pd.DataFrame({"A": s1.pct_change(), "B": s2.pct_change()})
        risk = float(rets.std().mean() * np.sqrt(252)) * 100.0
        risk_str = f"{risk:.2f}%"

    
    try:
        net_profit_val = float(next(x["Value"] for x in data["backtest"] if x["Metric"] == "Net Profit"))
    except Exception:
        
        net_profit_val = capital * (r1 - r2)

    
    d1 = pd.to_datetime(start)
    d2 = pd.to_datetime(end)
    rd = relativedelta(d2, d1)
    if rd.years > 0 and rd.months > 0:
        period = f"{rd.years} year{'s' if rd.years>1 else ''}, {rd.months} month{'s' if rd.months>1 else ''}"
    elif rd.years > 0:
        period = f"{rd.years} year{'s' if rd.years>1 else ''}"
    else:
        period = f"{rd.months} month{'s' if rd.months>1 else ''}"

    header = ["Metric", "Value"]
    body = [
        ["Stock Pair", f"{t1} vs {t2}"],
        ["Outperforming Asset", f"{out_name} ({out_pct:.2f}%)"],
        ["Underperforming Asset", f"{under_name} ({under_pct:.2f}%)"],
        ["Net Profit", f"Long ${capital:.0f} {out_name}, Short ${capital:.0f} {under_name}: ${net_profit_val:.2f}"],
        ["Annualized Volatility", f"{risk_str} (Risk Measure)"],
        ["Time Period", period],
    ]
    return [header] + body


def build_excel(data: dict, t1: str, t2: str, start: str, end: str, capital: float) -> bytes:
    """
    Creates a styled XLSX identical in spirit to your Streamlit 'create_excel_report':
    - Merged green title row with white bold text
    - White bold headers on green fill
    - Thin borders around all cells
    - Wrapped text for values
    - Auto column widths (ignore merged cells)
    Falls back to CSV if openpyxl is unavailable.
    """
    import io
    import pandas as pd

    
    try:
        from openpyxl import Workbook
        from openpyxl.styles import Alignment, Font, Border, Side, PatternFill
        from openpyxl.cell import MergedCell
        HAS_XL = True
    except Exception:
        HAS_XL = False

    rows = _excel_rows_from_data(data, t1, t2, start, end, capital)

    if not HAS_XL:
        df = pd.DataFrame(rows[1:], columns=rows[0])
        return df.to_csv(index=False).encode("utf-8")

    header, body = rows[0], rows[1:]

    wb = Workbook()
    ws = wb.active
    ws.title = "Backtest Report"

    
    title_text = f"Pairs Trading Report ({t1} vs {t2})"
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=len(header))
    title_cell = ws.cell(row=1, column=1, value=title_text)
    title_cell.font = Font(bold=True, size=14, color="FFFFFF", name="Calibri")
    title_cell.alignment = Alignment(horizontal="center", vertical="center")
    title_cell.fill = PatternFill(start_color="00C9A7", end_color="00C9A7", fill_type="solid")

    
    header_font = Font(bold=True, color="FFFFFF", size=12, name="Calibri")
    header_fill = PatternFill(start_color="00C9A7", end_color="00C9A7", fill_type="solid")
    thin = Side(style="thin")
    border = Border(left=thin, right=thin, top=thin, bottom=thin)

    for col_idx, col_name in enumerate(header, 1):
        cell = ws.cell(row=2, column=col_idx, value=col_name)
        cell.font = header_font
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.fill = header_fill
        cell.border = border

    
    r = 3
    for row in body:
        for c_idx, value in enumerate(row, 1):
            cell = ws.cell(row=r, column=c_idx, value=value)
            cell.alignment = Alignment(wrap_text=True, vertical="center")
            cell.font = Font(size=11, name="Calibri")
            cell.border = border
        r += 1

    
    for col in ws.columns:
        cells = [cell for cell in col if not isinstance(cell, MergedCell)]
        if not cells:
            continue
        max_len = max(len(str(cell.value)) if cell.value else 0 for cell in cells)
        ws.column_dimensions[cells[0].column_letter].width = max_len + 4

    stream = io.BytesIO()
    wb.save(stream)
    stream.seek(0)
    return stream.read()



@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/api/summary")
def api_summary(body: SummaryIn):
    try:
        return compute_summary(
            body.ticker1.upper(), body.ticker2.upper(),
            body.start_date, body.end_date, body.initial_invest
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"{e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"summary_error: {e}")


@app.get("/api/summary")
def api_summary_get(
    ticker1: str = Query(...),
    ticker2: str = Query(...),
    start_date: str = Query(...),
    end_date: str = Query(...),
    initial_invest: float = Query(1000.0),
):
    try:
        return compute_summary(ticker1.upper(), ticker2.upper(), start_date, end_date, initial_invest)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"{e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"summary_error: {e}")

@app.post("/api/excel")
def api_excel(body: SummaryIn):
    try:
        
        data = compute_summary(
            body.ticker1.upper(), body.ticker2.upper(),
            body.start_date, body.end_date, body.initial_invest
        )

        content = build_excel(
            data,
            body.ticker1.upper(), body.ticker2.upper(),
            body.start_date, body.end_date, body.initial_invest
        )

        
        mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        if content[:6] == b"Metric" or content[:5] == b"Metric":  
            mime = "text/csv"

        ext = "xlsx" if mime != "text/csv" else "csv"
        filename = f"backtest_{body.ticker1.upper()}_{body.ticker2.upper()}.{ext}"

        return Response(content=content, media_type=mime,
                        headers={"Content-Disposition": f'attachment; filename="{filename}"'})
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"{e}")
    except Exception as e:

        raise HTTPException(status_code=500, detail=f"excel_error: {e}")







