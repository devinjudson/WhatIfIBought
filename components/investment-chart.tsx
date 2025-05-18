"use client"

import { useEffect, useRef, useState } from "react"
import { format, parseISO } from "date-fns"

interface ChartProps {
  data: { date: string; price: number }[]
  initialInvestment: number
  sharesPurchased: number
}

export default function InvestmentChart({ data, initialInvestment, sharesPurchased }: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string
    value: number
    x: number
    y: number
  } | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const animationRef = useRef<number | null>(null)
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Process data
  const chartData = data.map((item) => ({
    date: item.date,
    value: item.price * sharesPurchased,
  }))

  const isPositive = chartData.length > 0 && chartData[chartData.length - 1]?.value >= initialInvestment
  const lineColor = isPositive ? "#22c55e" : "#ef4444"

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      // Clear any previous timeout to avoid multiple redraws
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }

      // Set a timeout to avoid excessive redraws during resize
      resizeTimeoutRef.current = setTimeout(() => {
        if (containerRef.current) {
          setContainerWidth(containerRef.current.clientWidth)
        }
      }, 100)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!canvasRef.current || chartData.length === 0 || containerWidth === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1
    const chartHeight = containerWidth < 640 ? 200 : 300

    canvas.width = containerWidth * dpr
    canvas.height = chartHeight * dpr

    ctx.scale(dpr, dpr)
    canvas.style.width = `${containerWidth}px`
    canvas.style.height = `${chartHeight}px`

    // Clear canvas
    ctx.clearRect(0, 0, containerWidth, chartHeight)

    // Chart dimensions
    const padding = {
      top: 40,
      right: containerWidth < 400 ? 20 : 40,
      bottom: 40,
      left: containerWidth < 400 ? 40 : 60,
    }
    const chartWidth = containerWidth - padding.left - padding.right
    const chartAreaHeight = chartHeight - padding.top - padding.bottom

    // Find min and max values
    const values = chartData.map((d) => d.value)
    const minValue = Math.min(...values) * 0.9
    const maxValue = Math.max(...values) * 1.1

    // Draw axes
    ctx.strokeStyle = "#4b5563"
    ctx.lineWidth = 1

    // Y-axis
    ctx.beginPath()
    ctx.moveTo(padding.left, padding.top)
    ctx.lineTo(padding.left, chartHeight - padding.bottom)
    ctx.stroke()

    // X-axis
    ctx.beginPath()
    ctx.moveTo(padding.left, chartHeight - padding.bottom)
    ctx.lineTo(containerWidth - padding.right, chartHeight - padding.bottom)
    ctx.stroke()

    // Draw Y-axis labels
    ctx.fillStyle = "#9ca3af"
    ctx.font = containerWidth < 400 ? "10px sans-serif" : "12px sans-serif"
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"

    const yTickCount = containerWidth < 400 ? 3 : 5
    for (let i = 0; i <= yTickCount; i++) {
      const value = minValue + (maxValue - minValue) * (i / yTickCount)
      const y = padding.top + chartAreaHeight - (chartAreaHeight * (value - minValue)) / (maxValue - minValue)

      ctx.fillText(`$${Math.round(value).toLocaleString()}`, padding.left - 10, y)

      // Grid line
      ctx.strokeStyle = "#374151"
      ctx.globalAlpha = 0.2
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(containerWidth - padding.right, y)
      ctx.stroke()
      ctx.globalAlpha = 1
    }

    // Draw X-axis labels
    ctx.fillStyle = "#9ca3af"
    ctx.textAlign = "center"
    ctx.textBaseline = "top"

    const xTickCount = containerWidth < 400 ? 3 : 6
    for (let i = 0; i < xTickCount; i++) {
      const index = Math.floor((chartData.length - 1) * (i / (xTickCount - 1)))
      const dataPoint = chartData[index]
      const x = padding.left + (chartWidth * index) / (chartData.length - 1)

      const date = format(parseISO(dataPoint.date), containerWidth < 400 ? "MMM yy" : "MMM yyyy")
      ctx.fillText(date, x, chartHeight - padding.bottom + 10)
    }

    // Store point coordinates for hover detection
    const pointCoordinates = chartData.map((point, index) => {
      const x = padding.left + (chartWidth * index) / (chartData.length - 1)
      const y = padding.top + chartAreaHeight - (chartAreaHeight * (point.value - minValue)) / (maxValue - minValue)
      return { ...point, x, y }
    })

    // Animation setup
    let animationFrame = 0
    const totalFrames = 60

    const animate = () => {
      if (animationFrame > totalFrames) return

      // Clear the chart area only (not the axes)
      ctx.clearRect(padding.left + 1, padding.top, chartWidth, chartAreaHeight)

      // Calculate how much of the line to draw
      const progress = animationFrame / totalFrames
      const pointsToDraw = Math.ceil(chartData.length * progress)

      // Draw the line
      ctx.strokeStyle = lineColor
      ctx.lineWidth = 3
      ctx.lineJoin = "round"
      ctx.beginPath()

      const dataToRender = chartData.slice(0, pointsToDraw)
      dataToRender.forEach((point, index) => {
        const x = padding.left + (chartWidth * index) / (chartData.length - 1)
        const y = padding.top + chartAreaHeight - (chartAreaHeight * (point.value - minValue)) / (maxValue - minValue)

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Add event listeners for hover when animation completes
      if (animationFrame === totalFrames) {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = canvas.getBoundingClientRect()
          const mouseX = e.clientX - rect.left
          const mouseY = e.clientY - rect.top

          // Find closest point
          let closestPoint = null
          let closestDistance = Number.POSITIVE_INFINITY

          pointCoordinates.forEach((point) => {
            const distance = Math.sqrt(Math.pow(mouseX - point.x, 2) + Math.pow(mouseY - point.y, 2))
            if (distance < closestDistance && distance < 30) {
              closestDistance = distance
              closestPoint = point
            }
          })

          setHoveredPoint(closestPoint)
        }

        const handleTouchMove = (e: TouchEvent) => {
          if (e.touches.length === 0) return

          const rect = canvas.getBoundingClientRect()
          const touchX = e.touches[0].clientX - rect.left
          const touchY = e.touches[0].clientY - rect.top

          // Find closest point
          let closestPoint = null
          let closestDistance = Number.POSITIVE_INFINITY

          pointCoordinates.forEach((point) => {
            const distance = Math.sqrt(Math.pow(touchX - point.x, 2) + Math.pow(touchY - point.y, 2))
            if (distance < closestDistance && distance < 40) {
              closestDistance = distance
              closestPoint = point
            }
          })

          setHoveredPoint(closestPoint)
        }

        const handleLeave = () => {
          setHoveredPoint(null)
        }

        canvas.addEventListener("mousemove", handleMouseMove)
        canvas.addEventListener("touchmove", handleTouchMove)
        canvas.addEventListener("mouseleave", handleLeave)
        canvas.addEventListener("touchend", handleLeave)

        return () => {
          canvas.removeEventListener("mousemove", handleMouseMove)
          canvas.removeEventListener("touchmove", handleTouchMove)
          canvas.removeEventListener("mouseleave", handleLeave)
          canvas.removeEventListener("touchend", handleLeave)
        }
      }

      animationFrame++
      if (animationFrame <= totalFrames) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    // Start animation
    animate()

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [chartData, initialInvestment, isPositive, lineColor, containerWidth])

  if (chartData.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        No data available to display chart
      </div>
    )
  }

  return (
    <div className="h-[200px] md:h-[300px] w-full relative" ref={containerRef}>
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />

      {hoveredPoint && (
        <div
          className="absolute bg-white dark:bg-gray-800 p-2 md:p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm z-10 pointer-events-none text-xs md:text-sm"
          style={{
            left: `${Math.min(hoveredPoint.x + 10, containerWidth - 150)}px`,
            top: `${Math.min(hoveredPoint.y - 70, 150)}px`,
          }}
        >
          <p className="font-medium">{format(parseISO(hoveredPoint.date), "MMM d, yyyy")}</p>
          <p className="text-gray-600 dark:text-gray-400">
            Value: ${hoveredPoint.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <p
            className={
              hoveredPoint.value >= initialInvestment
                ? "text-green-600 dark:text-green-500"
                : "text-red-600 dark:text-red-500"
            }
          >
            {hoveredPoint.value >= initialInvestment ? "+" : ""}
            {(hoveredPoint.value - initialInvestment).toLocaleString(undefined, {
              maximumFractionDigits: 2,
              style: "currency",
              currency: "USD",
            })}{" "}
            ({hoveredPoint.value >= initialInvestment ? "+" : ""}
            {(((hoveredPoint.value - initialInvestment) / initialInvestment) * 100).toFixed(2)}%)
          </p>
        </div>
      )}
    </div>
  )
}
