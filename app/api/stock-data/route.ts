import { type NextRequest, NextResponse } from "next/server"
import { fetchStockData } from "@/lib/fmp-finance"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const ticker = searchParams.get("ticker")
  const date = searchParams.get("date")

  if (!ticker || !date) {
    return NextResponse.json({ error: "Ticker and date are required" }, { status: 400 })
  }

  try {
    // Check if we have the FMP API key in environment variables
    const apiKey = process.env.FMP_API_KEY

    if (apiKey) {
      // Use the real FMP API
      const stockData = await fetchStockData(ticker, date, apiKey)
      return NextResponse.json(stockData)
    } else {
      // Fall back to mock data if no API key is available
      console.log("No FMP API key found. Using mock data.")
      const mockData = generateMockStockData(ticker, date)
      return NextResponse.json(mockData)
    }
  } catch (error) {
    console.error("Error fetching stock data:", error)
    return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 })
  }
}

// Keep the mock data generation for fallback
function generateMockStockData(ticker: string, purchaseDate: string) {
  // Map of company names by ticker
  const companyNames: Record<string, string> = {
    AAPL: "Apple Inc.",
    MSFT: "Microsoft Corporation",
    GOOGL: "Alphabet Inc.",
    AMZN: "Amazon.com, Inc.",
    META: "Meta Platforms, Inc.",
    TSLA: "Tesla, Inc.",
    NVDA: "NVIDIA Corporation",
    NFLX: "Netflix, Inc.",
  }

  // Default company name if ticker is not in our map
  const companyName = companyNames[ticker.toUpperCase()] || `${ticker.toUpperCase()} Inc.`

  // Generate a realistic purchase price (between $10 and $500)
  const purchasePrice = Math.random() * 490 + 10

  // Generate a realistic current price (with a tendency to increase over time)
  const yearsPassed = (new Date().getTime() - new Date(purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 365)
  const growthFactor = 1 + (Math.random() * 0.2 + 0.05) * yearsPassed // 5-25% annual growth on average
  const currentPrice = purchasePrice * growthFactor

  // Generate historical data points
  const historicalData = generateHistoricalData(purchaseDate, purchasePrice, currentPrice)

  return {
    ticker: ticker.toUpperCase(),
    companyName,
    purchaseDate,
    purchasePrice,
    currentPrice,
    historicalData,
  }
}

function generateHistoricalData(startDate: string, startPrice: number, endPrice: number) {
  const startDateTime = new Date(startDate).getTime()
  const endDateTime = new Date().getTime()
  const historicalDataPoints = []

  // Calculate the number of data points (roughly one per month)
  const months = Math.max(1, Math.floor((endDateTime - startDateTime) / (1000 * 60 * 60 * 24 * 30)))
  const dataPoints = Math.min(60, months) // Cap at 60 data points for performance

  // Calculate the time interval between data points
  const interval = (endDateTime - startDateTime) / dataPoints

  // Generate the data points with some randomness to simulate market volatility
  for (let i = 0; i <= dataPoints; i++) {
    const pointDate = new Date(startDateTime + interval * i)
    const progress = i / dataPoints

    // Add some randomness to the price progression
    const randomFactor = 1 + (Math.random() * 0.1 - 0.05) // ±5% random variation
    const expectedPrice = startPrice + (endPrice - startPrice) * progress
    const price = expectedPrice * randomFactor

    historicalDataPoints.push({
      date: pointDate.toISOString().split("T")[0], // YYYY-MM-DD format
      price: Math.max(0.01, price), // Ensure price is always positive
    })
  }

  return historicalDataPoints
}
