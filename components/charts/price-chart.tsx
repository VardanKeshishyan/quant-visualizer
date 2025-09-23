"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface PriceChartProps {
  stocks: string[]
  startDate: string
  endDate: string
}


function generateMockPriceData(stocks: string[], startDate: string, endDate: string) {
  const data = []
  const start = new Date(startDate)
  const end = new Date(endDate)
  const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

  let price1 = 100 + Math.random() * 200
  let price2 = 100 + Math.random() * 200

  for (let i = 0; i <= days; i += 7) {
    
    const date = new Date(start.getTime() + i * 24 * 60 * 60 * 1000)

    
    const change1 = (Math.random() - 0.5) * 10
    const change2 = change1 * 0.7 + (Math.random() - 0.5) * 5 

    price1 += change1
    price2 += change2

    data.push({
      date: date.toISOString().split("T")[0],
      [stocks[0]]: Math.max(10, price1),
      [stocks[1]]: Math.max(10, price2),
    })
  }

  return data
}

export function PriceChart({ stocks, startDate, endDate }: PriceChartProps) {
  const data = generateMockPriceData(stocks, startDate, endDate)

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
            formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
          />
          <Legend />
          <Line type="monotone" dataKey={stocks[0]} stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey={stocks[1]} stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
