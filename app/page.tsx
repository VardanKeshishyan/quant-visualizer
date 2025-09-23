import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { PairsTradeExample } from "@/components/pairs-trade-example"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <Features />
        <PairsTradeExample />
      </main>
    </div>
  )
}
