"use client"

import { useEffect, useState } from "react"
import { format, parseISO } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, TrendingUp, TrendingDown, DollarSign, LineChart, Bot } from "lucide-react"
import InvestmentChart from "@/components/investment-chart"
import AnimatedText from "@/components/animated-text"
import { useAISummary } from "@/components/use-ai-summary"

interface StockData {
  ticker: string
  purchaseDate: string
  purchasePrice: number
  currentPrice: number
  historicalData: { date: string; price: number }[]
  companyName: string
}

export default function InvestmentResults({
  ticker,
  date,
  amount,
}: {
  ticker: string
  date: string
  amount: number
}) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [sharesPurchased, setSharesPurchased] = useState<number>(0)
  const [currentValue, setCurrentValue] = useState<number>(0)
  const [gainLoss, setGainLoss] = useState<number>(0)
  const [percentReturn, setPercentReturn] = useState<number>(0)
  const [isPositive, setIsPositive] = useState<boolean>(true)
  const [formattedPurchaseDate, setFormattedPurchaseDate] = useState<string>("")

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true)
        setError(null)

        // In a real app, this would be an API call to your backend
        // For demo purposes, we'll simulate the data
        const response = await fetch(`/api/stock-data?ticker=${ticker}&date=${date}`)

        if (!response.ok) {
          throw new Error("Failed to fetch stock data")
        }

        const data = await response.json()
        setStockData(data)
      } catch (err) {
        console.error("Error fetching stock data:", err)
        setError("Failed to fetch stock data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchStockData()
  }, [ticker, date])

  useEffect(() => {
    if (stockData) {
      // Calculate investment metrics
      const shares = amount / stockData.purchasePrice
      const currentValueCalc = shares * stockData.currentPrice
      const gainLossCalc = currentValueCalc - amount
      const percentReturnCalc = (gainLossCalc / amount) * 100
      const isPositiveCalc = gainLossCalc >= 0

      setSharesPurchased(shares)
      setCurrentValue(currentValueCalc)
      setGainLoss(gainLossCalc)
      setPercentReturn(percentReturnCalc)
      setIsPositive(isPositiveCalc)

      // Safely format the date
      try {
        setFormattedPurchaseDate(format(parseISO(stockData.purchaseDate), "MMMM d, yyyy"))
      } catch (error) {
        console.error("Error formatting purchase date:", error)
        setFormattedPurchaseDate("Invalid date")
      }
    }
  }, [stockData, amount])

  // Get AI summary
  const { summary, loading: summaryLoading } = useAISummary({
    ticker,
    companyName: stockData?.companyName || "",
    purchaseDate: stockData?.purchaseDate || "",
    amount,
    currentValue: currentValue || 0,
    gainLoss: gainLoss || 0,
    percentReturn: percentReturn || 0,
  })

  if (loading) {
    return <Skeleton className="h-[600px] w-full bg-secondary" />
  }

  if (error) {
    return (
      <Alert variant="destructive" className="border-destructive/20 bg-destructive/10 text-destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!stockData) {
    return (
      <Alert className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No data available for this stock and date.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4 md:space-y-8 animate-fade-in">
      <Card className="border border-border overflow-hidden">
        <div className="bg-secondary/50 dark:bg-secondary/20 flex items-center min-h-[80px] md:min-h-[120px] p-3 md:p-8 relative">
          {/* Subtle Texture Background */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" aria-hidden="true">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <defs>
                <pattern id="grid-pattern-results" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 10 L40 10 M10 0 L10 40" stroke="currentColor" strokeWidth="0.5" fill="none" />
                </pattern>
                <pattern id="dot-pattern-results" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern-results)" />
              <rect width="100%" height="100%" fill="url(#dot-pattern-results)" />
            </svg>
          </div>

          <div className="relative">
            <h1 className="text-lg md:text-3xl font-bold text-foreground">
              {stockData.companyName} ({ticker.toUpperCase()})
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground">
              ${amount.toLocaleString()} invested on {formattedPurchaseDate}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-2 md:gap-6">
        <Card className="border-border shadow-sm card-hover">
          <CardHeader className="pb-0 p-2 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground flex items-center">
              <DollarSign className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-muted-foreground" />
              Shares
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 p-2 md:p-6">
            <div className="text-sm md:text-2xl font-bold text-foreground">{sharesPurchased.toFixed(2)}</div>
            <p className="text-xs md:text-sm text-muted-foreground">@ ${stockData.purchasePrice.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm card-hover">
          <CardHeader className="pb-0 p-2 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground flex items-center">
              <DollarSign className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-muted-foreground" />
              Value
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 p-2 md:p-6">
            <div className="text-sm md:text-2xl font-bold text-foreground">
              ${currentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">@ ${stockData.currentPrice.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card
          className={`border-${isPositive ? "primary/20" : "border"} shadow-sm card-hover ${isPositive ? "bg-primary/5" : ""}`}
        >
          <CardHeader className="pb-0 p-2 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground flex items-center">
              {isPositive ? (
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-primary" />
              ) : (
                <TrendingDown className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-destructive" />
              )}
              Return
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 p-2 md:p-6">
            <div className={`text-sm md:text-2xl font-bold ${isPositive ? "text-primary" : "text-destructive"}`}>
              {isPositive ? "+" : ""}
              {percentReturn.toFixed(1)}%
            </div>
            <p className={`text-xs md:text-sm ${isPositive ? "text-primary" : "text-destructive"}`}>
              {gainLoss.toLocaleString(undefined, { maximumFractionDigits: 0, style: "currency", currency: "USD" })}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border shadow-sm card-hover">
        <CardHeader className="p-3 md:p-6 pb-0 md:pb-0">
          <CardTitle className="text-sm md:text-lg text-foreground flex items-center">
            <LineChart className="w-3 h-3 md:w-5 md:h-5 mr-1 md:mr-2 text-muted-foreground" />
            Performance Over Time
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 md:p-4">
          <InvestmentChart
            data={stockData.historicalData}
            initialInvestment={amount}
            sharesPurchased={sharesPurchased}
          />
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm card-hover">
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-sm md:text-lg text-foreground flex items-center">
            <Bot className="w-4 md:w-5 h-4 md:h-5 mr-1 md:mr-2 text-primary" />
            AI Investment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          {summaryLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-3 md:h-4 w-full bg-secondary" />
              <Skeleton className="h-3 md:h-4 w-full bg-secondary" />
              <Skeleton className="h-3 md:h-4 w-3/4 bg-secondary" />
              <Skeleton className="h-3 md:h-4 w-5/6 bg-secondary" />
              <Skeleton className="h-3 md:h-4 w-full bg-secondary" />
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              <AnimatedText
                text={summary}
                speed={15}
                className="text-xs md:text-base text-muted-foreground leading-relaxed"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
