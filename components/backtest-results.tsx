"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Download, AlertTriangle } from "lucide-react"

interface BacktestResultsProps {
  stocks: string[]
  startDate: string
  endDate: string
  initialCapital: number
}

// Mock backtest calculation
function calculateBacktestResults(stocks: string[], initialCapital: number) {
  // Mock returns
  const stock1Return = (Math.random() - 0.4) * 0.5 // Slightly positive bias
  const stock2Return = (Math.random() - 0.6) * 0.4 // Slightly negative bias

  const outperformer = stock1Return > stock2Return ? stocks[0] : stocks[1]
  const underperformer = stock1Return > stock2Return ? stocks[1] : stocks[0]
  const outperformerReturn = Math.max(stock1Return, stock2Return)
  const underperformerReturn = Math.min(stock1Return, stock2Return)

  const longProfit = initialCapital * outperformerReturn
  const shortProfit = -initialCapital * underperformerReturn
  const netProfit = longProfit + shortProfit
  const annualizedVolatility = 0.25 // Mock volatility

  return {
    outperformer,
    underperformer,
    outperformerReturn,
    underperformerReturn,
    longProfit,
    shortProfit,
    netProfit,
    annualizedVolatility,
  }
}

export function BacktestResults({ stocks, startDate, endDate, initialCapital }: BacktestResultsProps) {
  const results = calculateBacktestResults(stocks, initialCapital)

  const chartData = [
    {
      name: results.outperformer,
      return: results.outperformerReturn * 100,
      profit: results.longProfit,
    },
    {
      name: results.underperformer,
      return: results.underperformerReturn * 100,
      profit: results.shortProfit,
    },
    {
      name: "Net Result",
      return: (results.netProfit / initialCapital) * 100,
      profit: results.netProfit,
    },
  ]

  const timePeriod = `${Math.floor((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months`

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl md:text-3xl text-primary flex items-center justify-center gap-2">
          <TrendingUp className="h-8 w-8" />
          Backtesting Results
        </CardTitle>
        <CardDescription className="text-lg">
          Performance analysis for {stocks[0]} vs {stocks[1]} pairs trading strategy over {timePeriod}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Outperforming Asset</p>
              <p className="font-semibold text-lg">{results.outperformer}</p>
              <Badge variant="secondary" className="mt-1">
                {(results.outperformerReturn * 100).toFixed(2)}%
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <TrendingDown className="h-8 w-8 text-destructive mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Underperforming Asset</p>
              <p className="font-semibold text-lg">{results.underperformer}</p>
              <Badge variant="destructive" className="mt-1">
                {(results.underperformerReturn * 100).toFixed(2)}%
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 text-accent mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Net Profit</p>
              <p className="font-semibold text-lg text-accent">${results.netProfit.toFixed(2)}</p>
              <Badge variant={results.netProfit > 0 ? "default" : "destructive"} className="mt-1">
                {((results.netProfit / initialCapital) * 100).toFixed(2)}%
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Annualized Volatility</p>
              <p className="font-semibold text-lg">{(results.annualizedVolatility * 100).toFixed(2)}%</p>
              <Badge variant="outline" className="mt-1">
                Risk Measure
              </Badge>
            </CardContent>
          </Card>
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Performance Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name === "return" ? `${value.toFixed(2)}%` : `$${value.toFixed(2)}`,
                      name === "return" ? "Return" : "Profit",
                    ]}
                  />
                  <Bar dataKey="return" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-card rounded-lg border">
              <h4 className="font-semibold text-primary mb-2">Strategy Summary</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Long ${initialCapital} {results.outperformer}
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Short ${initialCapital} {results.underperformer}
              </p>
              <p className="text-sm font-medium">
                Net Result:{" "}
                <span className={results.netProfit > 0 ? "text-primary" : "text-destructive"}>
                  ${results.netProfit.toFixed(2)}
                </span>
              </p>
            </div>

            <Button className="w-full bg-transparent" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>

        {}
        <div className="p-4 bg-muted/50 rounded-lg border border-muted">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Disclaimer:</strong> This analysis is for educational purposes only and does not constitute
            financial advice. Results are theoretical and exclude transaction costs, liquidity issues, and market
            frictions.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
