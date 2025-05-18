"use client"

import { useEffect, useState } from "react"
import { format, parseISO } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import AnimatedText from "@/components/animated-text"
import { Bot } from "lucide-react"

interface AISummaryProps {
  ticker: string
  companyName: string
  purchaseDate: string
  amount: number
  currentValue: number
  gainLoss: number
  percentReturn: number
}

export default function AISummary({
  ticker,
  companyName,
  purchaseDate,
  amount,
  currentValue,
  gainLoss,
  percentReturn,
}: AISummaryProps) {
  const [summary, setSummary] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateSummary = async () => {
      try {
        setLoading(true)

        // In a real app, this would be an API call to your backend with OpenAI integration
        // For demo purposes, we'll simulate the response
        const response = await fetch("/api/generate-summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ticker,
            companyName,
            purchaseDate,
            amount,
            currentValue,
            gainLoss,
            percentReturn,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to generate summary")
        }

        const data = await response.json()
        setSummary(data.summary)
      } catch (err) {
        console.error("Error generating summary:", err)
        // Fallback summary if API fails
        const formattedDate = format(parseISO(purchaseDate), "MMMM d, yyyy")
        const isPositive = gainLoss >= 0

        setSummary(
          `Your investment of $${amount.toLocaleString()} in ${companyName} (${ticker.toUpperCase()}) on ${formattedDate} is now worth $${currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}, representing a ${isPositive ? "gain" : "loss"} of ${Math.abs(percentReturn).toFixed(2)}%. ${isPositive ? "Congratulations on your successful investment!" : "While this investment hasn't performed as hoped, remember that markets fluctuate over time."}`,
        )
      } finally {
        setLoading(false)
      }
    }

    generateSummary()
  }, [ticker, companyName, purchaseDate, amount, currentValue, gainLoss, percentReturn])

  return (
    <Card className="border-border shadow-sm card-hover">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-base md:text-lg text-foreground flex items-center">
          <Bot className="w-4 md:w-5 h-4 md:h-5 mr-2 text-primary" />
          AI Investment Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-secondary" />
            <Skeleton className="h-4 w-full bg-secondary" />
            <Skeleton className="h-4 w-3/4 bg-secondary" />
            <Skeleton className="h-4 w-5/6 bg-secondary" />
            <Skeleton className="h-4 w-full bg-secondary" />
          </div>
        ) : (
          <div className="prose dark:prose-invert max-w-none">
            <AnimatedText
              text={summary}
              speed={15}
              className="text-sm md:text-base text-muted-foreground leading-relaxed"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
