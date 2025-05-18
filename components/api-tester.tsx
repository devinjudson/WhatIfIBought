"use client"

import Link from "next/link"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Search } from "lucide-react"

export default function ApiTester() {
  const [activeTab, setActiveTab] = useState("fmp")
  const [ticker, setTicker] = useState("AAPL")
  const [date, setDate] = useState("2020-01-01")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    data?: any
  } | null>(null)

  const testFmpApi = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch(`/api/stock-data?ticker=${ticker}&date=${date}`)
      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: "Successfully fetched stock data from FMP API!",
          data,
        })
      } else {
        setResult({
          success: false,
          message: `Error: ${data.error || "Failed to fetch stock data"}`,
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const testOpenAiApi = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/generate-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticker: "AAPL",
          companyName: "Apple Inc.",
          purchaseDate: "2020-01-01",
          amount: 1000,
          currentValue: 1500,
          gainLoss: 500,
          percentReturn: 50,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: "Successfully generated summary using OpenAI API!",
          data,
        })
      } else {
        setResult({
          success: false,
          message: `Error: ${data.error || "Failed to generate summary"}`,
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">API Connection Tester</CardTitle>
          <CardDescription>Test your API connections to ensure they're working correctly</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="fmp" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="fmp">FMP API</TabsTrigger>
              <TabsTrigger value="openai">OpenAI API</TabsTrigger>
            </TabsList>

            <TabsContent value="fmp" className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Stock Ticker</label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="AAPL"
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Purchase Date</label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                <Button
                  onClick={testFmpApi}
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {loading ? "Testing..." : "Test FMP API Connection"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="openai" className="space-y-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This will test the OpenAI API connection by generating a sample investment summary.
                </p>

                <Button
                  onClick={testOpenAiApi}
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {loading ? "Testing..." : "Test OpenAI API Connection"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {result && (
        <Card className={`border-${result.success ? "green-500/30" : "red-500/30"}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              {result.success ? (
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
              )}
              {result.success ? "Success" : "Error"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert
              variant={result.success ? "default" : "destructive"}
              className={
                result.success ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900" : ""
              }
            >
              <AlertTitle>{result.success ? "API Connection Successful" : "API Connection Failed"}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>

            {result.data && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Response Data:</h4>
                <div className="bg-muted p-3 rounded-md overflow-auto max-h-60">
                  <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(result.data, null, 2)}</pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="text-center mt-8">
        <Link href="/">
          <Button variant="outline">Return to Home</Button>
        </Link>
      </div>
    </div>
  )
}
