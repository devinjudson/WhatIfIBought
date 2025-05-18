import { Calendar, DollarSign, LineChart, Search, CheckCircle, ArrowRight } from "lucide-react"

export default function HowItWorks() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10 md:mb-16">
        <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 md:mb-4">
          How It <span className="text-primary">Works</span>
        </h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          WhatIfIBought helps you visualize the growth of your investments over time
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
        <div className="bg-card rounded-xl p-5 md:p-8 shadow-sm border border-border card-hover">
          <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-foreground">What This App Does</h3>
          <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 leading-relaxed">
            WhatIfIBought helps you discover how much money you could have made (or lost) if you had invested in a
            specific stock at a certain point in time.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Whether you're curious about missed opportunities, want to analyze your actual investments, or just
            exploring "what if" scenarios, this tool gives you a clear picture of potential investment outcomes.
          </p>
        </div>

        <div className="bg-card rounded-xl p-5 md:p-8 shadow-sm border border-border card-hover">
          <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-foreground">What You'll See</h3>
          <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-muted-foreground">
            {[
              "Number of shares you would have purchased",
              "Current value of your investment",
              "Total gain or loss (in $ and %)",
              "Performance chart over time",
              "AI-generated analysis of your investment",
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="w-4 md:w-5 h-4 md:h-5 text-primary mr-2 md:mr-3 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-8 md:mb-16">
        <h3 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-10 text-foreground">
          Simple 4-Step Process
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            {
              icon: <Search className="h-5 md:h-6 w-5 md:w-6 text-foreground" />,
              title: "Enter Stock Ticker",
              description: "Type in the stock symbol you want to analyze (e.g., AAPL for Apple).",
            },
            {
              icon: <Calendar className="h-5 md:h-6 w-5 md:w-6 text-foreground" />,
              title: "Select Date",
              description: "Choose when you would have made the investment.",
            },
            {
              icon: <DollarSign className="h-5 md:h-6 w-5 md:w-6 text-foreground" />,
              title: "Set Amount",
              description: "Enter how much money you would have invested.",
            },
            {
              icon: <LineChart className="h-5 md:h-6 w-5 md:w-6 text-foreground" />,
              title: "View Results",
              description: "See detailed analysis of how your investment would have performed.",
            },
          ].map((step, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-4 md:p-6 flex flex-col items-center text-center relative border border-primary/10 card-hover"
            >
              <div className="mb-3 md:mb-4 p-2 md:p-3 bg-primary/10 rounded-full text-primary">{step.icon}</div>
              <h4 className="text-base md:text-lg font-bold mb-2 md:mb-3 text-foreground">{step.title}</h4>
              <p className="text-xs md:text-sm text-muted-foreground">{step.description}</p>

              {index < 3 && index % 2 === 0 && (
                <div className="hidden sm:block md:hidden absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              )}

              {index < 3 && (
                <div className="hidden md:flex absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
