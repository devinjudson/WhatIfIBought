import { type NextRequest, NextResponse } from "next/server"
import { format, parseISO } from "date-fns"
import { generateInvestmentSummary, type InvestmentSummaryParams } from "@/lib/openai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ticker, companyName, purchaseDate, amount, currentValue, gainLoss, percentReturn } = body

    // Validate required fields
    if (!ticker || !companyName || !purchaseDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if we have the OpenAI API key in environment variables
    const apiKey = process.env.OPENAI_API_KEY

    if (apiKey) {
      // Use the real OpenAI API
      const params: InvestmentSummaryParams = {
        ticker,
        companyName,
        purchaseDate,
        amount,
        currentValue,
        gainLoss,
        percentReturn,
      }

      const summary = await generateInvestmentSummary(params, apiKey)
      return NextResponse.json({ summary })
    } else {
      // Fall back to mock data if no API key is available
      console.log("No OpenAI API key found. Using mock summary.")
      const summary = generateMockSummary(
        ticker,
        companyName,
        purchaseDate,
        amount,
        currentValue,
        gainLoss,
        percentReturn,
      )
      return NextResponse.json({ summary })
    }
  } catch (error) {
    console.error("Error generating summary:", error)
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
  }
}

// Keep the mock summary generation for fallback
function generateMockSummary(
  ticker: string,
  companyName: string,
  purchaseDate: string,
  amount: number,
  currentValue: number,
  gainLoss: number,
  percentReturn: number,
) {
  let formattedDate
  try {
    formattedDate = format(parseISO(purchaseDate), "MMMM d, yyyy")
  } catch (error) {
    formattedDate = "the purchase date"
  }

  const isPositive = gainLoss >= 0
  const yearsPassed = Math.max(
    0,
    (new Date().getTime() - new Date(purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 365),
  )
  const yearsText = yearsPassed < 1 ? `${Math.round(yearsPassed * 12)} months` : `${yearsPassed.toFixed(1)} years`

  // Generate different summaries based on performance
  if (isPositive && percentReturn > 100) {
    return `Your investment of $${amount.toLocaleString()} in ${companyName} (${ticker.toUpperCase()}) on ${formattedDate} has performed exceptionally well over the past ${yearsText}. It's now worth $${currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}, representing a remarkable gain of ${percentReturn.toFixed(2)}%. 

This outstanding return significantly outperforms the average market return of about 10% annually. If you had invested the same amount in an S&P 500 index fund, your investment would likely be worth considerably less. ${companyName} has demonstrated strong growth potential, likely due to successful product launches, market expansion, or industry leadership.`
  } else if (isPositive && percentReturn > 20) {
    return `Your investment of $${amount.toLocaleString()} in ${companyName} (${ticker.toUpperCase()}) on ${formattedDate} has performed well over the past ${yearsText}. It's now worth $${currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}, representing a solid gain of ${percentReturn.toFixed(2)}%. 

This return is in line with healthy market performance. ${companyName} has shown steady growth, maintaining its competitive position in the market. The company has likely executed its business strategy effectively, resulting in consistent value creation for shareholders.`
  } else if (isPositive) {
    return `Your investment of $${amount.toLocaleString()} in ${companyName} (${ticker.toUpperCase()}) on ${formattedDate} has shown modest growth over the past ${yearsText}. It's now worth $${currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}, representing a gain of ${percentReturn.toFixed(2)}%. 

While this return is positive, it's worth noting that it may be lower than what you might have achieved with some alternative investments. ${companyName} has maintained relatively stable performance, which could indicate a mature company in a competitive market or one that's navigating industry challenges.`
  } else if (percentReturn > -20) {
    return `Your investment of $${amount.toLocaleString()} in ${companyName} (${ticker.toUpperCase()}) on ${formattedDate} has experienced a slight decline over the past ${yearsText}. It's now worth $${currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}, representing a loss of ${Math.abs(percentReturn).toFixed(2)}%. 

This performance is below market averages, but moderate losses are not uncommon in equity investments, especially in shorter time frames. ${companyName} may be facing temporary challenges or operating in a sector experiencing headwinds. Remember that stock investments typically perform better over longer time horizons.`
  } else {
    return `Your investment of $${amount.toLocaleString()} in ${companyName} (${ticker.toUpperCase()}) on ${formattedDate} has unfortunately declined significantly over the past ${yearsText}. It's now worth $${currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}, representing a substantial loss of ${Math.abs(percentReturn).toFixed(2)}%. 

This performance indicates that ${companyName} has faced serious challenges, which could include industry disruption, competitive pressures, or internal management issues. While disappointing, it's important to remember that individual stock investments carry higher risk than diversified portfolios. This outcome highlights the importance of diversification across multiple assets and sectors.`
  }
}
