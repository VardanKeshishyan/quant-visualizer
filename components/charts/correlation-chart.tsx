"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface CorrelationChartProps {
  stocks: string[]
  startDate: string
  endDate: string
}

// Mock rolling correlation data
function generateMockCorrelationData(startDate: string, endDate: string) {
  const data = []
  const start = new Date(startDate)
  const end = new Date(endDate)
  const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

  for (let i = 30; i <= days; i += 7) {
    // Start after 30 days for rolling window
    const date = new Date(start.getTime() + i * 24 * 60 * 60 * 1000)

    // Generate rolling correlations for different windows
    const baseCorr = 0.6 + Math.sin(i / 50) * 0.3

    data.push({
      date: date.toISOString().split("T")[0],
      "30-day": Math.max(0, Math.min(1, baseCorr + (Math.random() - 0.5) * 0.2)),
      "60-day": Math.max(0, Math.min(1, baseCorr + (Math.random() - 0.5) * 0.15)),
      "90-day": Math.max(0, Math.min(1, baseCorr + (Math.random() - 0.5) * 0.1)),
    })
  }

  return data
}

export function CorrelationChart({ stocks, startDate, endDate }: CorrelationChartProps) {
  const data = generateMockCorrelationData(startDate, endDate)
  const avgCorr = 0.65 // Mock average correlation

  return (
    <div className="space-y-4">
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis tick={{ fontSize: 12 }} domain={[0, 1]} />
            <Tooltip
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
              formatter={(value: number, name: string) => [value.toFixed(3), name]}
            />
            <Legend />
            <Line type="monotone" dataKey="30-day" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="60-day" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="90-day" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
        <h4 className="font-semibold text-primary mb-2">Rolling Correlation Analysis</h4>
        <p className="text-sm text-muted-foreground mb-2">
          <strong>Mean Correlation: {avgCorr.toFixed(2)}</strong>
        </p>
        <p className="text-sm text-muted-foreground">
          {avgCorr > 0.7
            ? "High mean correlation: Stable linear dependence supports mean-reversion strategies."
            : avgCorr < 0.5
              ? "Low mean correlation: Significant variation suggests trading opportunities when correlation dips."
              : `Moderate mean correlation: Periodic fluctuations. Time entries when correlation falls below ${avgCorr.toFixed(2)}.`}
        </p>
      </div>
    </div>
  )
}
