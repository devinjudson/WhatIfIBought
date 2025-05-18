import { Suspense } from "react"
import Link from "next/link"
import InvestmentForm from "@/components/investment-form"
import HowItWorks from "@/components/how-it-works"
import { ArrowRight, Settings, TrendingUp, Zap } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section with Subtle Texture */}
      <div className="relative bg-secondary/50 dark:bg-secondary/20 py-12 md:py-28 overflow-hidden">
        {/* Subtle Texture Background */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" aria-hidden="true">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 10 L40 10 M10 0 L10 40" stroke="currentColor" strokeWidth="0.5" fill="none" />
              </pattern>
              <pattern id="dot-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            <rect width="100%" height="100%" fill="url(#dot-pattern)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="flex justify-between items-center absolute right-4 top-0 md:right-6 md:top-0">
            <div className="flex space-x-2">
              <Link href="/api-test">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-9 h-9 border-gray-200 dark:border-gray-800 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary focus-ring"
                  aria-label="API Test"
                >
                  <Zap className="h-4 w-4" />
                  <span className="sr-only">API Test</span>
                </Button>
              </Link>
              <Link href="/api-setup">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-9 h-9 border-gray-200 dark:border-gray-800 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary focus-ring"
                  aria-label="API Setup"
                >
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">API Setup</span>
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>

          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center justify-center mb-5 px-4 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-full">
              <TrendingUp className="w-4 h-4 mr-2" />
              Investment Calculator
            </div>

            <h1 className="text-3xl md:text-6xl font-bold tracking-tight mb-4 md:mb-6 text-foreground">
              WhatIf<span className="text-primary">I</span>
              <span className="text-primary">Bought</span>
            </h1>

            <p className="text-base md:text-xl text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto">
              See how much your investment would be worth today
            </p>

            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12 text-xs md:text-sm">
              {[
                { text: "Enter a stock ticker" },
                { text: "Choose a date" },
                { text: "Set investment amount" },
                { text: "See your returns" },
              ].map((step, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && (
                    <div className="flex items-center mx-1">
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex items-center px-2 md:px-3 py-1 md:py-1.5 text-muted-foreground">
                    <span>{step.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Calculator Section */}
      <div className="container mx-auto px-4 -mt-8 md:-mt-16 mb-16 md:mb-28 relative z-10">
        <div className="max-w-md mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="bg-card rounded-xl shadow-lg border border-primary/20 dark:border-primary/10 overflow-hidden">
            <div className="p-4 md:p-8">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                }
              >
                <InvestmentForm />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 pb-16 md:pb-28 animate-fade-in" style={{ animationDelay: "0.4s" }}>
        <HowItWorks />
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6 md:py-10">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground text-xs md:text-sm">
            <p>WhatIfIBought — Discover the potential of your past investments</p>
            <p className="mt-1">© {new Date().getFullYear()} WhatIfIBought. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
