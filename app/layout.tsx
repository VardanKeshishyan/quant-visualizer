import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"


import { AssistantBubble } from "@/components/ui/assistant-bubble"

export const metadata: Metadata = {
  title: "Quant Visualizer - Financial Analytics Dashboard",
  description: "Advanced quantitative analysis and visualization for stock pairs trading",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          {children}
          <Analytics />

          {}
          <AssistantBubble
            ctx={{
              tickers: ["NVDA", "AMD"],
              startDate: "2023-01-01",
              endDate: "2024-01-01",
            }}
          />
        </Suspense>
      </body>
    </html>
  )
}
