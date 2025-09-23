"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Plot from "react-plotly.js";
import { AssistantBubble } from "@/components/ui/assistant-bubble";
import dynamic from "next/dynamic";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp, BarChart3, Activity, Info,
  ArrowUpRight, ArrowDownRight, DollarSign, AlertTriangle, Download,
} from "lucide-react";
import { runSummary, downloadExcel } from "@/lib/api";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

/** Recommended stock pairs (Auto mode) */
const stockPairs = [
  ["NVDA","AMD"],["INTC","AMD"],["AVGO","QCOM"],["MU","WDC"],
  ["GOOGL","META"],["MSFT","ORCL"],["V","MA"],["JPM","BAC"],
  ["GS","MS"],["XOM","CVX"],["SLB","HAL"],["KO","PEP"],
  ["WMT","TGT"],["HD","LOW"],["UPS","FDX"],["GM","F"],["DAL","UAL"],
].map(([a,b]) => ({ value:`${a}-${b}`, label:`${a} vs ${b}`, stocks:[a,b] }));

type ApiOut = {
  price_plot: { dates: string[]; series1: number[]; series2: number[]; ticker1: string; ticker2: string };
  zscore_plot: { dates: string[]; zscores: number[] };
  joint_3d?: { x: number[]; y: number[]; z: number[][]; corr: number };
  rolling_corr_surface?: { x_index: number[]; windows: number[]; z: number[][] };
  backtest: { Metric: string; Value: string }[];
};

function getMetric(data: ApiOut | null, name: string) {
  return data?.backtest?.find((r) => r.Metric === name)?.Value ?? "";
}

export function AnalyticsDashboard() {
  
  const [pairMode, setPairMode] = useState<"auto" | "custom">("auto");

  
  const [selectedPair, setSelectedPair] = useState(stockPairs[0].value);

  
  const [customT1, setCustomT1] = useState("NVDA");
  const [customT2, setCustomT2] = useState("AMD");

  
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState("2024-01-01");
  const [initialCapital, setInitialCapital] = useState(1000);

  
  const [data, setData] = useState<ApiOut | null>(null);
  const [busy, setBusy] = useState(false);

  const currentPair = useMemo(
    () => stockPairs.find((p) => p.value === selectedPair) || stockPairs[0],
    [selectedPair]
  );

  
  const bootRan = useRef(false);
  useEffect(() => {
    if (!bootRan.current) {
      bootRan.current = true;
      onRun(true); 
    }
    
  }, []);

  function getChosenTickers(): [string, string] {
    if (pairMode === "auto") return [currentPair.stocks[0], currentPair.stocks[1]];
    const t1 = customT1.trim().toUpperCase();
    const t2 = customT2.trim().toUpperCase();
    return [t1, t2];
  }

  function validateCustom(): string | null {
    if (pairMode !== "custom") return null;
    const rgx = /^[A-Z.\-]{1,10}$/;
    if (!rgx.test(customT1.trim()) || !rgx.test(customT2.trim())) return "Incorrect input";
    if (customT1.trim().toUpperCase() === customT2.trim().toUpperCase()) return "Tickers must be different";
    return null;
  }

  async function onRun(isBoot = false) {
    try {
      
      if (!isBoot) {
        const err = validateCustom();
        if (err) return alert(err);
      }

      setBusy(true);
      setData(null);

      const [t1, t2] = getChosenTickers();
      const out = await runSummary({
        ticker1: t1,
        ticker2: t2,
        start_date: startDate,
        end_date: endDate,
        initial_invest: initialCapital,
      });
      setData(out);
    } catch (e: any) {
      
      const msg = (e?.message || "").toLowerCase();
      if (msg.includes("yfinance") || msg.includes("no data") || msg.includes("not enough") || e?.status === 400) {
        alert("Incorrect input");
      } else {
        alert(e?.message || "Analysis failed");
      }
    } finally {
      setBusy(false);
    }
  }

  async function onDownload() {
    try {
      const [t1, t2] = getChosenTickers();
      await downloadExcel({
        ticker1: t1,
        ticker2: t2,
        start_date: startDate,
        end_date: endDate,
        initial_invest: initialCapital,
      });
    } catch (e: any) {
      alert(e?.message || "Download failed");
    }
  }

  
  const p1 = data?.price_plot.series1 ?? [];
  const p2 = data?.price_plot.series2 ?? [];
  const ret1 = p1.length >= 2 ? ((p1[p1.length - 1] / p1[0]) - 1) * 100 : NaN;
  const ret2 = p2.length >= 2 ? ((p2[p2.length - 1] / p2[0]) - 1) * 100 : NaN;
  const t1 = data?.price_plot.ticker1 ?? currentPair.stocks[0];
  const t2 = data?.price_plot.ticker2 ?? currentPair.stocks[1];
  const outperformer = (ret1 >= ret2) ? t1 : t2;
  const underperformer = (ret1 >= ret2) ? t2 : t1;
  const outPct = (ret1 >= ret2) ? ret1 : ret2;
  const underPct = (ret1 >= ret2) ? ret2 : ret1;

  const netProfitStr = getMetric(data, "Net Profit");
  const netProfit = parseFloat(netProfitStr || "0");
  const netPct = initialCapital ? (netProfit / initialCapital) * 100 : 0;

  
  let rollingMean: number | null = null;
  if (data?.rolling_corr_surface?.z?.length) {
    const flat = data.rolling_corr_surface.z.flat().filter((v) => Number.isFinite(v));
    if (flat.length) rollingMean = flat.reduce((a, b) => a + b, 0) / flat.length;
  }

  
  const zScoreText = (
    <>
      When the z-score exceeds <strong>+2</strong>, the spread is unusually high; consider <strong>shorting {t1}</strong> and <strong>longing {t2}</strong>.
      When below <strong>-2</strong>, consider <strong>longing {t1}</strong> and <strong>shorting {t2}</strong>.
      This strategy assumes mean reversion in the spread.
    </>
  );

  const jdCorr = data?.joint_3d?.corr ?? null;
  let jdQual = "Moderate correlation: The ellipsoid shows balanced behavior. Use with z-score (|z| > 2) for trading signals.";
  if (jdCorr !== null) {
    if (jdCorr > 0.7) jdQual = "High correlation (>0.7): The ellipsoid is compact, indicating a strong linear relationship. Ideal for mean-reversion strategies.";
    else if (jdCorr < 0.5) jdQual = "Low correlation (<0.5): The ellipsoid is elongated, suggesting independence. Explore divergence-based trading opportunities.";
  }

  let rcQual = "Moderate mean correlation: Periodic fluctuations. Time entries when correlation falls below the mean.";
  if (rollingMean !== null) {
    if (rollingMean > 0.7) rcQual = "High mean correlation (>0.7): Stable linear dependence supports mean-reversion strategies.";
    else if (rollingMean < 0.5) rcQual = "Low mean correlation (<0.5): Significant variation suggests trading opportunities when correlation dips.";
  }

  return (
      <>

    <main className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Centered header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Quantitative Analytics Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-2">
            Analyze stock pair relationships using advanced visualizations and backtesting tools. Adjust parameters to
            explore different scenarios and trading strategies.
          </p>
        </div>

        {/* Steps */}
        <Card className="mb-8 bg-emerald-50 border-emerald-200">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Badge variant="outline" className="border-emerald-400 text-emerald-700">Step 1: Choose stock pair</Badge>
              <span className="text-muted-foreground">→</span>
              <Badge variant="outline" className="border-emerald-400 text-emerald-700">Step 2: Set date range</Badge>
              <span className="text-muted-foreground">→</span>
              <Badge variant="outline" className="border-emerald-400 text-emerald-700">Step 3: Explore 2D & 3D charts</Badge>
              <span className="text-muted-foreground">→</span>
              <Badge variant="outline" className="border-emerald-400 text-emerald-700">Step 4: Review results</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-600" />
                  Parameters
                </CardTitle>
                <CardDescription>Configure your analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Mode</Label>
                  <Select value={pairMode} onValueChange={(v: "auto" | "custom") => setPairMode(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto (recommended list)</SelectItem>
                      <SelectItem value="custom">Custom (type tickers)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {pairMode === "auto" ? (
                  <div className="space-y-2">
                    <Label>Stock Pair</Label>
                    <Select value={selectedPair} onValueChange={setSelectedPair}>
                      <SelectTrigger><SelectValue placeholder="Select a stock pair" /></SelectTrigger>
                      <SelectContent>
                        {stockPairs.map((pair) => (
                          <SelectItem key={pair.value} value={pair.value}>{pair.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>Ticker 1</Label>
                      <Input value={customT1} onChange={(e) => setCustomT1(e.target.value)} placeholder="e.g., NVDA" />
                    </div>
                    <div className="space-y-2">
                      <Label>Ticker 2</Label>
                      <Input value={customT2} onChange={(e) => setCustomT2(e.target.value)} placeholder="e.g., AMD" />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Initial Capital ($)</Label>
                  <Input
                    type="number"
                    min={100}
                    max={10000}
                    step={100}
                    value={initialCapital}
                    onChange={(e) => setInitialCapital(Number(e.target.value))}
                  />
                </div>

                <Separator />

                <button
                  onClick={() => onRun(false)}
                  disabled={busy}
                  className={`w-full px-4 py-2 rounded text-white ${busy ? "bg-gray-400" : "bg-emerald-600 hover:bg-emerald-700"}`}
                >
                  {busy ? "Running…" : "Run Analysis"}
                </button>

                <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-emerald-700 mb-1">Trading tip</p>
                      <p className="text-muted-foreground">
                        Choose pairs from the same industry for meaningful correlation. Adjust dates to capture different regimes.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-8">
            {/* 2D */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-emerald-600" />
                  2D Graphical Analysis
                </CardTitle>
                <CardDescription>
                  Visualize price movements and statistical relationships between {t1} and {t2}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="prices" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="prices">Price Trajectories</TabsTrigger>
                    <TabsTrigger value="zscore">Z-Score Analysis</TabsTrigger>
                  </TabsList>

                  <TabsContent value="prices" className="mt-6">
                    {data ? (
                      <Plot
                        data={[
                          { x: data.price_plot.dates, y: data.price_plot.series1, type: "scatter", mode: "lines", name: data.price_plot.ticker1 },
                          { x: data.price_plot.dates, y: data.price_plot.series2, type: "scatter", mode: "lines", name: data.price_plot.ticker2 },
                        ] as any}
                        layout={{ margin: { l: 40, r: 10, b: 40, t: 10 }, showlegend: true } as any}
                        style={{ width: "100%", height: 360 }}
                        config={{ displayModeBar: false }}
                      />
                    ) : (
                      <div className="text-sm text-muted-foreground">Run analysis to see the chart.</div>
                    )}
                  </TabsContent>

                  <TabsContent value="zscore" className="mt-6">
                    {data ? (
                      <>
                        <Plot
                          data={[
                            { x: data.zscore_plot.dates, y: data.zscore_plot.zscores, type: "scatter", mode: "lines", name: "Z-Score" },
                          ] as any}
                          layout={{ margin: { l: 40, r: 10, b: 40, t: 10 } } as any}
                          style={{ width: "100%", height: 360 }}
                          config={{ displayModeBar: false }}
                        />
                        <div className="mt-4 p-4 rounded-lg border border-emerald-200 bg-emerald-50">
                          <h4 className="font-semibold text-emerald-700 mb-2">Z-Score Trading Signals</h4>
                          <p className="text-sm text-muted-foreground">{zScoreText}</p>
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground">Run analysis to see the chart.</div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* 3D */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  3D Analytical Visualizations
                </CardTitle>
                <CardDescription>Joint distribution & rolling correlation</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="distribution" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="distribution">Joint Distribution</TabsTrigger>
                    <TabsTrigger value="correlation">Rolling Correlation</TabsTrigger>
                  </TabsList>

                  <TabsContent value="distribution" className="mt-6">
                    {data && data.joint_3d && data.joint_3d.z?.length > 0 ? (
                      <>
                        <Plot
                          data={[
                            { type: "surface", x: data.joint_3d.x, y: data.joint_3d.y, z: data.joint_3d.z, opacity: 0.92, showscale: true },
                          ] as any}
                          layout={{
                            margin: { l: 20, r: 20, b: 20, t: 30 },
                            scene: {
                              camera: { eye: { x: 1.4, y: 1.4, z: 0.8 } },
                              xaxis: { title: `${t1} Return` },
                              yaxis: { title: `${t2} Return` },
                              zaxis: { title: "PDF" },
                            },
                          } as any}
                          style={{ width: "100%", height: 500 }}
                          config={{ displayModeBar: false }}
                        />
                        <div className="mt-4 p-4 rounded-lg border border-emerald-200 bg-emerald-50">
                          <h4 className="font-semibold text-emerald-700 mb-2">Joint Distribution Analysis</h4>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Pearson Correlation:</span>{" "}
                            {Number.isFinite(jdCorr) ? Number(jdCorr).toFixed(2) : "—"}. {jdQual}
                            <br /><span className="font-medium">Action:</span> Rotate the plot to identify high-density regions (typical returns) vs low-density outliers (rare events).
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground">Run analysis to see the 3D surface.</div>
                    )}
                  </TabsContent>

                  <TabsContent value="correlation" className="mt-6">
                    {data && data.rolling_corr_surface ? (
                      <>
                        <Plot
                          data={[
                            { type: "surface", x: data.rolling_corr_surface.x_index, y: data.rolling_corr_surface.windows, z: data.rolling_corr_surface.z, opacity: 0.92, showscale: true },
                          ] as any}
                          layout={{
                            margin: { l: 20, r: 20, b: 20, t: 30 },
                            scene: {
                              camera: { eye: { x: 1.4, y: 1.4, z: 0.8 } },
                              xaxis: { title: "Time Index" },
                              yaxis: { title: "Window (days)" },
                              zaxis: { title: "Correlation" },
                            },
                          } as any}
                          style={{ width: "100%", height: 500 }}
                          config={{ displayModeBar: false }}
                        />
                        <div className="mt-4 p-4 rounded-lg border border-emerald-200 bg-emerald-50">
                          <h4 className="font-semibold text-emerald-700 mb-2">Rolling Correlation Analysis</h4>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Mean Correlation:</span>{" "}
                            {rollingMean !== null ? rollingMean.toFixed(2) : "—"}. {rcQual}
                            <br /><span className="font-medium">Action:</span> Use dips in correlation (z-axis valleys) with backtesting to optimize trade timing.
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground">Run analysis to see the 3D correlation surface.</div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Backtesting */}
            {data && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-emerald-600" />
                    <CardTitle className="text-2xl">Backtesting Results</CardTitle>
                  </div>
                  <CardDescription>
                    Performance analysis for {t1} vs {t2} over the selected period.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {/* KPI cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="rounded-xl border p-4">
                      <div className="flex items-center gap-2 text-emerald-600 font-medium">
                        <ArrowUpRight className="h-4 w-4" /> Outperforming Asset (Long)
                      </div>
                      <div className="mt-2 text-lg font-semibold">{outperformer}</div>
                      <div className="mt-1">
                        <span className="rounded bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs font-semibold">
                          {Number.isFinite(outPct) ? `${outPct.toFixed(2)}%` : "—"}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl border p-4">
                      <div className="flex items-center gap-2 text-red-600 font-medium">
                        <ArrowDownRight className="h-4 w-4" /> Underperforming Asset (Short)
                      </div>
                      <div className="mt-2 text-lg font-semibold">{underperformer}</div>
                      <div className="mt-1">
                        <span className="rounded bg-red-100 text-red-700 px-2 py-0.5 text-xs font-semibold">
                          {Number.isFinite(underPct) ? `${underPct.toFixed(2)}%` : "—"}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl border p-4">
                      <div className="flex items-center gap-2 text-emerald-700 font-medium">
                        <DollarSign className="h-4 w-4" /> Net Profit
                      </div>
                      <div className="mt-2 text-lg font-semibold">
                        {Number.isFinite(netProfit) ? `$${netProfit.toFixed(2)}` : getMetric(data, "Net Profit")}
                      </div>
                      <div className="mt-1">
                        <span className="rounded bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs font-semibold">
                          {Number.isFinite(netPct) ? `${netPct.toFixed(2)}%` : ""}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl border p-4">
                      <div className="flex items-center gap-2 text-slate-700 font-medium">
                        <AlertTriangle className="h-4 w-4" /> Annualized Volatility
                      </div>
                      <div className="mt-2 text-lg font-semibold">{getMetric(data, "Annualized Volatility")}</div>
                      <div className="mt-1">
                        <span className="rounded border px-2 py-0.5 text-xs text-slate-600">Risk Measure</span>
                      </div>
                    </div>
                  </div>

                  {/* One row: Performance Breakdown + Strategy Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div>
                      <div className="text-lg font-semibold mb-2">Performance Breakdown</div>
                      <Plot
                        data={[
                          {
                            type: "bar",
                            x: ["Outperformer", "Underperformer", "Net Result"],
                            y: [
                              Number.isFinite(outPct) ? outPct : 0,
                              Number.isFinite(underPct) ? underPct : 0,
                              Number.isFinite(netPct) ? netPct : 0,
                            ],
                            marker: { color: "black" },
                          },
                        ] as any}
                        layout={{ margin: { l: 40, r: 10, b: 40, t: 10 }, showlegend: false } as any}
                        style={{ width: "100%", height: 260 }}
                        config={{ displayModeBar: false }}
                      />
                    </div>

                    <div className="rounded-xl border p-4">
                      <div className="font-semibold mb-1">Strategy Summary</div>
                      <div className="text-sm text-muted-foreground">
                        Long ${initialCapital.toLocaleString()} {outperformer}<br />
                        Short ${initialCapital.toLocaleString()} {underperformer}<br />
                        <span className="font-medium text-foreground">Net Result:</span>{" "}
                        {Number.isFinite(netProfit) ? `$${netProfit.toFixed(2)}` : getMetric(data, "Net Profit")}
                      </div>

                      <button
                        onClick={onDownload}
                        className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white px-4 py-3 hover:bg-emerald-700"
                      >
                        <Download className="h-4 w-4" />
                        Download Report
                      </button>
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-slate-700">
                    <span className="font-semibold">Disclaimer:</span> This analysis is for educational purposes only
                    and does not constitute financial advice. Results are theoretical and exclude transaction costs,
                    liquidity issues, and market frictions.
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

    </main>
  <AssistantBubble
        ctx={{
          tickers:
            pairMode === "auto"
              ? (stockPairs.find(p => p.value === selectedPair)?.stocks ?? ["NVDA","AMD"])
              : [customT1, customT2],
          startDate,
          endDate,
        }}
      />
    </>
  );
}
