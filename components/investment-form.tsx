"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, DollarSign, Search, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function InvestmentForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ticker, setTicker] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [amount, setAmount] = useState("")
  const [errors, setErrors] = useState({
    ticker: "",
    date: "",
    amount: "",
  })

  const validateForm = () => {
    let isValid = true
    const newErrors = {
      ticker: "",
      date: "",
      amount: "",
    }

    // Validate ticker
    if (!ticker) {
      newErrors.ticker = "Ticker is required"
      isValid = false
    } else if (ticker.length > 10) {
      newErrors.ticker = "Ticker must be 10 characters or less"
      isValid = false
    } else if (!/^[A-Za-z.-]+$/.test(ticker)) {
      newErrors.ticker = "Ticker can only contain letters, dots, and hyphens"
      isValid = false
    }

    // Validate date
    if (!date) {
      newErrors.date = "Please select a date"
      isValid = false
    } else if (date >= new Date()) {
      newErrors.date = "Date must be in the past"
      isValid = false
    }

    // Validate amount
    if (!amount) {
      newErrors.amount = "Amount is required"
      isValid = false
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Amount must be a positive number"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)

      if (!date) {
        throw new Error("Date is required")
      }

      const params = new URLSearchParams({
        ticker: ticker.toUpperCase(),
        date: format(date, "yyyy-MM-dd"),
        amount: amount,
      })

      router.push(`/results?${params.toString()}`)
    } catch (error) {
      console.error("Error submitting form:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="flex items-center text-foreground font-medium text-sm md:text-base">
          <Search className="w-4 h-4 mr-2 text-muted-foreground" />
          Stock Ticker
        </label>
        <Input
          placeholder="AAPL"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          className="text-base border-border focus:border-primary focus:ring-1 focus:ring-primary/30 input-focus h-12"
          autoComplete="off"
        />
        {errors.ticker && <p className="text-xs text-destructive mt-1">{errors.ticker}</p>}
      </div>

      <div className="space-y-2">
        <label className="flex items-center text-foreground font-medium text-sm md:text-base">
          <CalendarIcon className="w-4 h-4 mr-2 text-muted-foreground" />
          Purchase Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full pl-3 text-left font-normal border-border input-focus h-12",
                !date && "text-muted-foreground",
              )}
            >
              {date ? format(date, "MMMM d, yyyy") : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-50" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date > new Date()}
              initialFocus
              className="rounded-md border border-border"
            />
          </PopoverContent>
        </Popover>
        {errors.date && <p className="text-xs text-destructive mt-1">{errors.date}</p>}
      </div>

      <div className="space-y-2">
        <label className="flex items-center text-foreground font-medium text-sm md:text-base">
          <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
          Investment Amount
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-muted-foreground">$</span>
          </div>
          <Input
            type="text"
            inputMode="decimal"
            placeholder="1000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-7 text-base border-border input-focus h-12"
            autoComplete="off"
          />
        </div>
        {errors.amount && <p className="text-xs text-destructive mt-1">{errors.amount}</p>}
      </div>

      <Button
        type="submit"
        className="w-full text-base py-5 md:py-6 mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-foreground"></div>
            <span>Calculating...</span>
          </>
        ) : (
          <>
            <span>Calculate Returns</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </Button>
    </form>
  )
}
