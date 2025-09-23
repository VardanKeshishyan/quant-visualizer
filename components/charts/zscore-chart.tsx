"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

interface ZScoreChartProps {
  stocks: string[]
  startDate: string
  endDate: string
}


function generateMockZScoreData(stocks: string[], startDate: string, endDate: string) {
  const data = []
  const start = new Date(startDate)
  const end = new Date(endDate)
  const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

  for (let i = 0; i <= days; i += 7) {
    const date = new Date(start.getTime() + i * 24 * 60 * 60 * 1000)

    
    const zscore = Math.sin(i / 20) * 1.5 + (Math.random() - 0.5) * 2

    data.push({
      date: date.toISOString().split("T")[0],
      zscore: zscore,
    })
  }

  return data
}

export function ZScoreChart({ stocks, startDate, endDate }: ZScoreChartProps) {
  const data = generateMockZScoreData(stocks, startDate, endDate)

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
            formatter={(value: number) => [value.toFixed(3), "Z-Score"]}
          />
          <ReferenceLine y={2} stroke="hsl(var(--chart-1))" strokeDasharray="5 5" />
          <ReferenceLine y={-2} stroke="hsl(var(--destructive))" strokeDasharray="5 5" />
          <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
          <Line type="monotone" dataKey="zscore" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
