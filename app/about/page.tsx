import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, AlertTriangle, Lightbulb, Code } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">About Quant Visualizer</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              This tool presents complex mathematical ideas in quantitative finance using educational models and
              historical stock data. It helps visualize key statistical concepts in a simple, interactive
              way.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <Lightbulb className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Inspiration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Based on statistical finance principles and educational resources from leading quantitative finance
                  literature and academic research.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
                <CardTitle>Important Limitations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The results are theoretical and exclude transaction costs, liquidity issues, or market frictions. This
                  is for educational purposes only - not financial advice.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-12">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Key Features & Methodologies</CardTitle>
              <CardDescription>Comprehensive analytical tools for quantitative finance education</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <Badge variant="secondary" className="w-fit">
                    Price Analysis
                  </Badge>
                  <p className="text-muted-foreground">
                    Tracks price movements to identify baseline trends and patterns.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <Badge variant="secondary" className="w-fit">
                    Z-Score
                  </Badge>
                  <p className="text-muted-foreground">
                    Detects deviations in return differences to spot potential trading signals (e.g., |z| &gt; 2).
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <Badge variant="secondary" className="w-fit">
                    3D Distribution
                  </Badge>
                  <p className="text-muted-foreground">
                    Shows joint probability of returns with Gaussian ellipsoids, reflecting correlation strength.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <Badge variant="secondary" className="w-fit">
                    Rolling Correlation
                  </Badge>
                  <p className="text-muted-foreground">
                    Computes dynamic correlations over time windows (30, 60, 90 days).
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <Badge variant="secondary" className="w-fit">
                    Backtesting
                  </Badge>
                  <p className="text-muted-foreground">
                    Simulates trading outcomes to estimate theoretical profitability.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Code className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Technical Implementation</CardTitle>
              <CardDescription>Built with modern web technologies and financial libraries</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                <strong>Technology Stack:</strong> Python, Next.js, React, TypeScript, Tailwind CSS, Recharts for
                visualizations, and various financial data APIs. Built a Next.js + FastAPI application to analyze stock pair trading strategies.
              </p>
              <p className="text-muted-foreground">
                <strong>Data Sources:</strong> Historical stock data from reliable financial APIs, processed using
                statistical methods including NumPy-equivalent calculations and SciPy-style statistical functions.

              </p>
            </CardContent>
          </Card>

          <div className="text-center mt-12">
            <p className="text-lg text-muted-foreground">
              Ready to explore quantitative analysis? Visit the{" "}
              <a href="/analytics" className="text-primary hover:underline font-semibold">
                Analytics Dashboard
              </a>{" "}
              to get started.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
