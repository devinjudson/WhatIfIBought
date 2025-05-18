import { OPENAI_API, getDefaultHeaders } from "./api-config"

export interface InvestmentSummaryParams {
  ticker: string
  companyName: string
  purchaseDate: string
  amount: number
  currentValue: number
  gainLoss: number
  percentReturn: number
}

/**
 * Generate an investment summary using OpenAI API
 */
export async function generateInvestmentSummary(params: InvestmentSummaryParams, apiKey: string): Promise<string> {
  try {
    const { ticker, companyName, purchaseDate, amount, currentValue, gainLoss, percentReturn } = params

    // Create the prompt for OpenAI
    const prompt = `
      Generate a concise investment analysis for the following stock investment:
      
      - Ticker: ${ticker}
      - Company: ${companyName}
      - Purchase Date: ${purchaseDate}
      - Initial Investment: $${amount.toLocaleString()}
      - Current Value: $${currentValue.toLocaleString()}
      - Gain/Loss: $${gainLoss.toLocaleString()} (${percentReturn.toFixed(2)}%)
      
      Please include:
      1. An assessment of the investment performance
      2. Context about the company or industry that might explain the performance
      3. A brief comparison to market averages
      4. A forward-looking statement about potential future performance
      
      Keep the tone professional but conversational. Limit to 3-4 paragraphs.
    `

    // Prepare the API request
    const response = await fetch(OPENAI_API.BASE_URL + OPENAI_API.COMPLETIONS_ENDPOINT, {
      method: "POST",
      headers: getDefaultHeaders(apiKey),
      body: JSON.stringify({
        model: OPENAI_API.DEFAULT_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a professional investment analyst providing insights on stock investments.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: OPENAI_API.DEFAULT_TEMPERATURE,
        max_tokens: OPENAI_API.DEFAULT_MAX_TOKENS,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0].message.content.trim()
  } catch (error) {
    console.error("Error generating investment summary:", error)
    throw error
  }
}
