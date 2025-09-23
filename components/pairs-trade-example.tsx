import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"

export function PairsTradeExample() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl text-primary mb-4">Understanding Pairs Trading</CardTitle>
            <CardDescription className="text-lg">
              A practical example of how quantitative analysis drives trading decisions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Long Position</h3>
                <p className="text-muted-foreground">
                  Buy Company A when it's expected to outperform relative to Company B
                </p>
              </div>
              <div className="text-center">
                <TrendingDown className="h-12 w-12 text-destructive mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Short Position</h3>
                <p className="text-muted-foreground">
                  Short Company B when it's expected to underperform relative to Company A
                </p>
              </div>
              <div className="text-center">
                <DollarSign className="h-12 w-12 text-accent mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Profit Strategy</h3>
                <p className="text-muted-foreground">
                  Profit from relative performance regardless of overall market direction
                </p>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h4 className="font-semibold text-lg mb-3 text-primary">Example Scenario:</h4>
              <p className="text-muted-foreground leading-relaxed">
                Suppose Company A and Company B are in the same industry and their stock prices usually move together.
                You notice Company A tends to perform slightly better than Company B over time. You could buy (go long)
                Company A and short Company B. If the industry moves up, A gains more than B, so your long position
                earns more than your short loses. If the industry moves down, A loses less than B, so your short profit
                offsets your long loss. This strategy profits from <strong>relative performance</strong>, not overall
                market direction.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
