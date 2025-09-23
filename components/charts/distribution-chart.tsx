"use client"

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface DistributionChartProps {
  stocks: string[]
  startDate: string
  endDate: string
}


function generateMockDistributionData(stocks: string[]) {
  const data = []

  for (let i = 0; i < 200; i++) {
    
    const return1 = (Math.random() - 0.5) * 0.1
    const return2 = return1 * 0.6 + (Math.random() - 0.5) * 0.08

    data.push({
      [stocks[0]]: return1 * 100,
      [stocks[1]]: return2 * 100,
      density: Math.random() * 0.5 + 0.1,
    })
  }

  return data
}

export function DistributionChart({ stocks }: DistributionChartProps) {
  const data = generateMockDistributionData(stocks)

  
  const correlation = 0.65 

  return (
    <div className="space-y-4">
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey={stocks[0]}
              tick={{ fontSize: 12 }}
              label={{ value: `${stocks[0]} Return (%)`, position: "insideBottom", offset: -10 }}
            />
            <YAxis
              dataKey={stocks[1]}
              tick={{ fontSize: 12 }}
              label={{ value: `${stocks[1]} Return (%)`, angle: -90, position: "insideLeft" }}
            />
            <Tooltip formatter={(value: number, name: string) => [`${value.toFixed(3)}%`, name]} />
            <Scatter dataKey={stocks[1]} fill="hsl(var(--chart-1))" fillOpacity={0.6} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
        <h4 className="font-semibold text-primary mb-2">Joint Distribution Analysis</h4>
        <p className="text-sm text-muted-foreground mb-2">
          <strong>Pearson Correlation: {correlation.toFixed(2)}</strong>
        </p>
        <p className="text-sm text-muted-foreground">
          {correlation > 0.7
            ? "High correlation: Strong linear relationship ideal for mean-reversion strategies."
            : correlation < 0.5
              ? "Low correlation: Independence suggests divergence-based trading opportunities."
              : "Moderate correlation: Balanced behavior. Use with z-score analysis for trading signals."}
        </p>
      </div>
    </div>
  )
}
