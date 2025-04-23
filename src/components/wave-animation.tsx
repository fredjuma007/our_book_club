"use client"

import { useEffect, useRef } from "react"

interface WaveAnimationProps {
  color?: string
  height?: number
  amplitude?: number
  frequency?: number
  speed?: number
}

export default function WaveAnimation({
  color = "rgba(34, 197, 94, 0.2)", // green-500 with opacity
  height = 30,
  amplitude = 20,
  frequency = 0.02,
  speed = 0.05,
}: WaveAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = height
    }

    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    // Animation variables
    let offset = 0

    // Animation loop
    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw wave
      ctx.beginPath()
      ctx.moveTo(0, canvas.height)

      for (let x = 0; x < canvas.width; x++) {
        const y = Math.sin(x * frequency + offset) * amplitude + canvas.height / 2
        ctx.lineTo(x, y)
      }

      ctx.lineTo(canvas.width, canvas.height)
      ctx.lineTo(0, canvas.height)
      ctx.fillStyle = color
      ctx.fill()

      // Update offset for animation
      offset += speed

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      cancelAnimationFrame(animationId)
    }
  }, [color, height, amplitude, frequency, speed])

  return (
    <canvas
      ref={canvasRef}
      className="absolute bottom-0 left-0 w-full pointer-events-none"
      style={{ height: `${height}px` }}
    />
  )
}
