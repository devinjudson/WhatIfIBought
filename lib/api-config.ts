// API configuration and endpoints

// Yahoo Finance API
export const YAHOO_FINANCE_API = {
  BASE_URL: "https://yfapi.net/v6/finance",
  CHART_ENDPOINT: "/chart",
  SEARCH_ENDPOINT: "/autocomplete",
  // Default parameters for API requests
  DEFAULT_PARAMS: {
    interval: "1d",
    includePrePost: false,
    events: "div,split",
  },
}

// Financial Modeling Prep API
export const FMP_API = {
  BASE_URL: "https://financialmodelingprep.com/api/v3",
  HISTORICAL_PRICE_ENDPOINT: "/historical-price-full",
  COMPANY_PROFILE_ENDPOINT: "/profile",
  SEARCH_ENDPOINT: "/search",
  // Default parameters for API requests
  DEFAULT_PARAMS: {
    timeseries: 365, // Get data for the past year by default
    serietype: "line",
  },
}

// OpenAI API
export const OPENAI_API = {
  BASE_URL: "https://api.openai.com/v1",
  COMPLETIONS_ENDPOINT: "/chat/completions",
  DEFAULT_MODEL: "gpt-4o",
  DEFAULT_TEMPERATURE: 0.7,
  DEFAULT_MAX_TOKENS: 500,
}

// Default headers for API requests
export const getDefaultHeaders = (apiKey: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${apiKey}`,
})
