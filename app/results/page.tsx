import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import InvestmentResults from "@/components/investment-results"
import ResultsSkeleton from "@/components/results-skeleton"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ResultsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const ticker = typeof searchParams.ticker === "string" ? searchParams.ticker : ""
  const date = typeof searchParams.date === "string" ? searchParams.date : ""
  const amount = typeof searchParams.amount === "string" ? searchParams.amount : ""

  // Validate required parameters
  if (!ticker || !date || !amount) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="bg-card rounded-xl p-8 max-w-md mx-auto shadow-md border border-border">
            <div className="inline-flex items-center justify-center mb-6 p-3 rounded-full text-destructive bg-destructive/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-4 text-foreground">Missing Parameters</h1>
            <p className="mb-6 text-muted-foreground">Please provide a ticker, date, and investment amount.</p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

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
              New Calculation
            </Button>
          </Link>
          <ThemeToggle />
        </div>

        <Suspense fallback={<ResultsSkeleton />}>
          <InvestmentResults ticker={ticker} date={date} amount={Number.parseFloat(amount)} />
        </Suspense>
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
