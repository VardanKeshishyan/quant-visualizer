export const BACKEND = "https://quant-visualizer-6.onrender.com";

export type SummaryPayload = {
  ticker1: string;
  ticker2: string;
  start_date: string;      // "YYYY-MM-DD"
  end_date: string;        // "YYYY-MM-DD"
  initial_invest: number;  // number, not string
};

async function readError(r: Response) {
  const txt = await r.text();
  try {
    const j = JSON.parse(txt);
    if (j?.detail) return `${r.status} ${r.statusText} — ${j.detail}`;
  } catch {}
  return `${r.status} ${r.statusText} — ${txt || "Unknown error"}`;
}

export async function runSummary(p: SummaryPayload) {
  // sanity: clean payload (avoids "Incorrect input")
  const clean: SummaryPayload = {
    ticker1: (p.ticker1 || "").trim().toUpperCase(),
    ticker2: (p.ticker2 || "").trim().toUpperCase(),
    start_date: p.start_date || "2022-01-01",
    end_date: p.end_date || new Date().toISOString().slice(0, 10),
    initial_invest: Number(p.initial_invest) || 1000,
  };

  const r = await fetch(`${BACKEND}/api/summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(clean),
  });
  if (!r.ok) throw new Error(await readError(r));
  return r.json();
}

export async function downloadExcel(p: SummaryPayload) {
  const clean: SummaryPayload = {
    ticker1: (p.ticker1 || "").trim().toUpperCase(),
    ticker2: (p.ticker2 || "").trim().toUpperCase(),
    start_date: p.start_date || "2022-01-01",
    end_date: p.end_date || new Date().toISOString().slice(0, 10),
    initial_invest: Number(p.initial_invest) || 1000,
  };

  const r = await fetch(`${BACKEND}/api/excel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(clean),
  });
  if (!r.ok) throw new Error(await readError(r));

  const blob = await r.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  const isXlsx = (r.headers.get("content-type") || "").includes("excel");
  a.download = `backtest.${isXlsx ? "xlsx" : "csv"}`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export async function askAssistant(payload: { message: string; context?: any }) {
  const r = await fetch(`${BACKEND}/api/assistant`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(await readError(r));
  return (await r.json()) as { text: string };
}
