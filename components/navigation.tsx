"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"

export function Navigation() {
  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground"> <Link href="/" className="text-foreground hover:text-primary transition-colors">
                Quant Visualizer</Link></span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/analytics" className="text-foreground hover:text-primary transition-colors">
              Analytics
            </Link>
          </div>

          <Button asChild>
            <Link href="/analytics">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
