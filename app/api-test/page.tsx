import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import ApiTester from "@/components/api-tester"

export default function ApiTestPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-3 py-4 md:py-12 flex-grow">
        <div className="flex justify-between items-center mb-4 md:mb-8">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="border-border hover:bg-primary/10 hover:text-primary focus-ring"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <ThemeToggle />
        </div>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold mb-6 text-center">
            API <span className="text-primary">Test</span>
          </h1>

          <p className="text-center text-muted-foreground mb-8">
            Test your API connections to ensure everything is working correctly
          </p>

          <Suspense fallback={<div className="text-center">Loading API tester...</div>}>
            <ApiTester />
          </Suspense>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-4 md:py-10 mt-auto">
        <div className="container mx-auto px-3">
          <div className="text-center text-muted-foreground text-xs md:text-sm">
            <p>WhatIfIBought — Discover the potential of your past investments</p>
            <p className="mt-1">© {new Date().getFullYear()} WhatIfIBought. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
