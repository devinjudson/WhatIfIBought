"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AlertCircle, Check, Copy, ExternalLink } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function EnvSetupGuide() {
  const [activeTab, setActiveTab] = useState("openai")
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">API Setup Guide</CardTitle>
        <CardDescription>Configure your environment variables to enable real API functionality</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="openai" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="openai">OpenAI API</TabsTrigger>
            <TabsTrigger value="fmp">Financial Modeling Prep API</TabsTrigger>
          </TabsList>

          <TabsContent value="openai" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>OpenAI API Setup</AlertTitle>
              <AlertDescription>The OpenAI API is used to generate investment analysis summaries.</AlertDescription>
            </Alert>

            <div className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  Sign up for an account at{" "}
                  <a
                    href="https://platform.openai.com/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center"
                  >
                    OpenAI <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </li>
                <li>
                  Navigate to the{" "}
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center"
                  >
                    API Keys page <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </li>
                <li>Create a new API key and copy it</li>
                <li>Add the API key to your environment variables</li>
              </ol>

              <div className="bg-muted p-3 rounded-md relative">
                <pre className="text-xs overflow-x-auto">OPENAI_API_KEY=your_api_key_here</pre>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-6 w-6"
                  onClick={() => copyToClipboard("OPENAI_API_KEY=your_api_key_here", "openai")}
                >
                  {copied === "openai" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fmp" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Financial Modeling Prep API Setup</AlertTitle>
              <AlertDescription>The FMP API is used to fetch real stock data.</AlertDescription>
            </Alert>

            <div className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  Sign up for an account at{" "}
                  <a
                    href="https://site.financialmodelingprep.com/developer/docs/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center"
                  >
                    Financial Modeling Prep <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </li>
                <li>Subscribe to a plan (they offer a free tier with limited API calls)</li>
                <li>Copy your API key from your dashboard</li>
                <li>Add the API key to your environment variables</li>
              </ol>

              <div className="bg-muted p-3 rounded-md relative">
                <pre className="text-xs overflow-x-auto">FMP_API_KEY=your_api_key_here</pre>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-6 w-6"
                  onClick={() => copyToClipboard("FMP_API_KEY=your_api_key_here", "fmp")}
                >
                  {copied === "fmp" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-4 border-t border-border">
          <h4 className="font-medium mb-2">Adding Environment Variables</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Create a <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> file in the root of your project
            and add the API keys.
          </p>

          <div className="bg-muted p-3 rounded-md relative">
            <pre className="text-xs overflow-x-auto">
              # API Keys{"\n"}
              OPENAI_API_KEY=your_openai_api_key_here{"\n"}
              FMP_API_KEY=your_fmp_api_key_here
            </pre>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-6 w-6"
              onClick={() =>
                copyToClipboard(
                  "# API Keys\nOPENAI_API_KEY=your_openai_api_key_here\nFMP_API_KEY=your_fmp_api_key_here",
                  "env",
                )
              }
            >
              {copied === "env" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            After adding the environment variables, restart your development server for the changes to take effect.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
