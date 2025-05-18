import { FMP_API } from "./api-config"

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
 * Fetches historical stock data from Financial Modeling Prep API
 */
export async function fetchStockData(ticker: string, startDate: string, apiKey: string): Promise<StockData> {
  try {
    // Prepare API URL for historical data
    const historicalUrl = new URL(`${FMP_API.BASE_URL}${FMP_API.HISTORICAL_PRICE_ENDPOINT}/${ticker}`)

    // Add query parameters
    historicalUrl.searchParams.append("from", startDate)
    historicalUrl.searchParams.append("to", new Date().toISOString().split("T")[0]) // Today
    historicalUrl.searchParams.append("apikey", apiKey)

    // Make the API request for historical data
    const historicalResponse = await fetch(historicalUrl.toString())

    if (!historicalResponse.ok) {
      throw new Error(`FMP API error: ${historicalResponse.status} ${historicalResponse.statusText}`)
    }

    const historicalData = await historicalResponse.json()

    // Prepare API URL for company profile
    const profileUrl = new URL(`${FMP_API.BASE_URL}${FMP_API.COMPANY_PROFILE_ENDPOINT}/${ticker}`)
    profileUrl.searchParams.append("apikey", apiKey)

    // Make the API request for company profile
    const profileResponse = await fetch(profileUrl.toString())

    if (!profileResponse.ok) {
      throw new Error(`FMP API error: ${profileResponse.status} ${profileResponse.statusText}`)
    }

    const profileData = await profileResponse.json()

    // Process the responses
    return processFMPResponse(historicalData, profileData, ticker, startDate)
  } catch (error) {
    console.error("Error fetching stock data:", error)
    throw error
  }
}

/**
 * Process FMP API responses into our app's format
 */
function processFMPResponse(historicalData: any, profileData: any, ticker: string, purchaseDate: string): StockData {
  // Extract the historical prices
  const historical = historicalData.historical || []

  // Sort by date (oldest first)
  historical.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Get company name from profile data
  const companyName = profileData[0]?.companyName || `${ticker.toUpperCase()} Inc.`

  // Find purchase price (closest to purchase date)
  const purchaseDateObj = new Date(purchaseDate)
  let purchasePrice = 0
  let closestDateDiff = Number.POSITIVE_INFINITY

  for (const item of historical) {
    const itemDate = new Date(item.date)
    const diff = Math.abs(itemDate.getTime() - purchaseDateObj.getTime())

    if (diff < closestDateDiff) {
      closestDateDiff = diff
      purchasePrice = item.close
    }
  }

  // Get current price (most recent)
  const currentPrice = historical.length > 0 ? historical[historical.length - 1].close : 0

  // Create historical data points
  const historicalDataPoints: StockHistoricalData[] = historical.map((item: any) => ({
    date: item.date,
    price: item.close,
  }))

  return {
    ticker: ticker.toUpperCase(),
    companyName,
    purchaseDate,
    purchasePrice,
    currentPrice,
    historicalData: historicalDataPoints,
  }
}

/**
 * Search for stocks by query
 */
export async function searchStocks(query: string, apiKey: string): Promise<any> {
  try {
    const url = new URL(`${FMP_API.BASE_URL}${FMP_API.SEARCH_ENDPOINT}`)
    url.searchParams.append("query", query)
    url.searchParams.append("limit", "10")
    url.searchParams.append("apikey", apiKey)

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`FMP API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error searching stocks:", error)
    throw error
  }
}
