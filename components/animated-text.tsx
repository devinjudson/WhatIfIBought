"use client"

import { useEffect, useState } from "react"

interface AnimatedTextProps {
  text: string
  speed?: number
  className?: string
}

export default function AnimatedText({ text, speed = 20, className = "" }: AnimatedTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Reset animation when text changes
    setDisplayedText("")
    setCurrentIndex(0)
    setIsComplete(false)
  }, [text])

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else if (currentIndex === text.length && !isComplete) {
      setIsComplete(true)
    }
  }, [currentIndex, text, speed, isComplete])

  return (
    <div className={className}>
      {displayedText}
      {!isComplete && <span className="animate-pulse">▋</span>}
    </div>
  )
}
