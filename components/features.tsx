import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, PieChart, Activity, Target, Zap } from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "2D Price Analysis",
    description: "Track price trajectories and identify baseline trends with advanced charting capabilities.",
  },
  {
    icon: Activity,
    title: "Z-Score Detection",
    description: "Detect deviations in return differences to spot potential trading signals when |z| > 2.",
  },
  {
    icon: PieChart,
    title: "3D Distribution",
    description: "Visualize joint probability of returns with Gaussian ellipsoids reflecting correlation strength.",
  },
  {
    icon: TrendingUp,
    title: "Rolling Correlation",
    description: "Compute dynamic correlations over multiple time windows (30, 60, 90 days) for trend analysis.",
  },
  {
    icon: Target,
    title: "Backtesting Engine",
    description: "Simulate trading outcomes to estimate theoretical profitability with historical data.",
  },
  {
    icon: Zap,
    title: "Real-time Analytics",
    description: "Get instant insights with interactive visualizations and statistical computations.",
  },
]

export function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Powerful Analytics Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools for quantitative finance analysis, from basic price tracking to advanced statistical
            modeling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
