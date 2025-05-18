import { YAHOO_FINANCE_API } from "./api-config"

export interface StockHistoricalData {
  date: string
  price: number
}

export interface StockData {
  ticker: string
  companyName: string
  purchaseDate: string
  purchasePrice: number
  currentPrice: number
  historicalData: StockHistoricalData[]
}

/**
 * Fetches historical stock data from Yahoo Finance API
 */
export async function fetchStockData(ticker: string, startDate: string, apiKey?: string): Promise<StockData> {
  try {
    // Convert dates to Unix timestamps
    const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000)
    const endTimestamp = Math.floor(new Date().getTime() / 1000)

    // Prepare API URL
    const url = new URL(`${YAHOO_FINANCE_API.BASE_URL}${YAHOO_FINANCE_API.CHART_ENDPOINT}/${ticker}`)

    // Add query parameters
    const params = {
      period1: startTimestamp.toString(),
      period2: endTimestamp.toString(),
      interval: YAHOO_FINANCE_API.DEFAULT_PARAMS.interval,
      includePrePost: YAHOO_FINANCE_API.DEFAULT_PARAMS.includePrePost.toString(),
      events: YAHOO_FINANCE_API.DEFAULT_PARAMS.events,
    }

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })

    // Prepare headers
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    // Add API key if provided
    if (apiKey) {
      headers["X-API-KEY"] = apiKey
    }

    // Make the API request
    const response = await fetch(url.toString(), { headers })

    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Process the response
    return processYahooFinanceResponse(data, ticker, startDate)
  } catch (error) {
    console.error("Error fetching stock data:", error)
    throw error
  }
}

/**
 * Process Yahoo Finance API response into our app's format
 */
function processYahooFinanceResponse(data: any, ticker: string, purchaseDate: string): StockData {
  // Extract the chart result
  const result = data.chart.result[0]

  // Get timestamps and closing prices
  const timestamps = result.timestamp
  const closePrices = result.indicators.quote[0].close

  // Get company name from meta data
  const companyName = result.meta.shortName || `${ticker.toUpperCase()} Inc.`

  // Find purchase price (closest to purchase date)
  const purchaseTimestamp = new Date(purchaseDate).getTime() / 1000
  let purchasePriceIndex = 0

  for (let i = 0; i < timestamps.length; i++) {
    if (timestamps[i] >= purchaseTimestamp) {
      purchasePriceIndex = i
      break
    }
  }

  const purchasePrice = closePrices[purchasePriceIndex]
  const currentPrice = closePrices[closePrices.length - 1]

  // Create historical data points
  const historicalData: StockHistoricalData[] = timestamps.map((timestamp: number, index: number) => ({
    date: new Date(timestamp * 1000).toISOString().split("T")[0],
    price: closePrices[index],
  }))

  return {
    ticker: ticker.toUpperCase(),
    companyName,
    purchaseDate,
    purchasePrice,
    currentPrice,
    historicalData,
  }
}

/**
 * Search for stocks by query
 */
export async function searchStocks(query: string, apiKey?: string): Promise<any> {
  try {
    const url = new URL(`${YAHOO_FINANCE_API.BASE_URL}${YAHOO_FINANCE_API.SEARCH_ENDPOINT}`)
    url.searchParams.append("q", query)

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (apiKey) {
      headers["X-API-KEY"] = apiKey
    }

    const response = await fetch(url.toString(), { headers })

    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error searching stocks:", error)
    throw error
  }
}
