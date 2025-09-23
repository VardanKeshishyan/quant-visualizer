import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, BarChart3 } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Advanced <span className="text-primary">Quantitative Analysis</span> for Stock Pairs
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
            Discover complex mathematical relationships in financial markets through interactive visualizations,
            statistical analysis, and backtesting tools designed for modern traders and analysts.


          </p>



          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/analytics">
                Start Analysis <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6 bg-transparent">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
<p><b>PAIRS TRADING: Finding stocks that move together and taking a long position in one stock and a short position in
    another stock with a high positive correlation, profiting from their difference.
    <br/> <br/> </b></p>
          {/* Video placeholder*/}
          <div className="relative max-w-4xl mx-auto">
  <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
    <div className="aspect-video rounded-lg overflow-hidden">
      <iframe
        className="w-full h-full"
        src="https://www.youtube.com/embed/jh_gp3hG2Do"
        title="Quantitative Analysis Demo"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  </Card>
</div>

        </div>
      </div>
    </section>
  )
}
