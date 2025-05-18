"use client"

import { useEffect, useState } from "react"
import { format, parseISO } from "date-fns"

interface UseAISummaryProps {
  ticker: string
  companyName: string
  purchaseDate: string
  amount: number
  currentValue: number
  gainLoss: number
  percentReturn: number
}

export function useAISummary({
  ticker,
  companyName,
  purchaseDate,
  amount,
  currentValue,
  gainLoss,
  percentReturn,
}: UseAISummaryProps) {
  const [summary, setSummary] = useState<string>("")
  const [loading, setLoading] = useState(true)

  const generateSummary = async () => {
    try {
      setLoading(true)

      // Check if we have all required data before making the API call
      if (!ticker || !companyName || !purchaseDate) {
        throw new Error("Missing required data for summary generation")
      }

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
      // Safely format the date or use a placeholder
      let formattedDate = "the purchase date"
      try {
        if (purchaseDate) {
          formattedDate = format(parseISO(purchaseDate), "MMMM d, yyyy")
        }
      } catch (dateError) {
        console.error("Error formatting date:", dateError)
      }

      const isPositive = gainLoss >= 0

      setSummary(
        `Your investment of $${amount.toLocaleString()} in ${companyName || ticker.toUpperCase()} on ${formattedDate} is now worth $${currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}, representing a ${isPositive ? "gain" : "loss"} of ${Math.abs(percentReturn).toFixed(2)}%. ${isPositive ? "Congratulations on your successful investment!" : "While this investment hasn't performed as hoped, remember that markets fluctuate over time."}`,
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Only fetch summary when we have all the necessary data
    if (ticker && companyName && purchaseDate && amount > 0) {
      generateSummary()
    }
  }, [ticker, companyName, purchaseDate, amount, currentValue, gainLoss, percentReturn])

  return { summary, loading }
}
