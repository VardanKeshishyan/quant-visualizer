export const BACKEND = "https://quant-visualizer-6.onrender.com";

export type SummaryPayload = {
  ticker1: string;
  ticker2: string;
  start_date: string;   
  end_date: string;     
  initial_invest: number;
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
  const r = await fetch(`${BACKEND}/api/summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(p),
  });
  if (!r.ok) throw new Error(await readError(r));
  return r.json();
}

export async function downloadExcel(p: SummaryPayload) {
  const r = await fetch(`${BACKEND}/api/excel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(p),
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
  if (!r.ok) {
    const txt = await r.text();
    try {
      const j = JSON.parse(txt);
      if (j?.error) throw new Error(j.error);
    } catch {}
    throw new Error(txt || "Assistant request failed");
  }
  return (await r.json()) as { text: string };
}


