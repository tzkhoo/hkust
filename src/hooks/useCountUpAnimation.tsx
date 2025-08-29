import { useState, useEffect } from 'react'

interface UseCountUpOptions {
  end: number
  duration?: number
  startOnMount?: boolean
  decimals?: number
}

export function useCountUpAnimation({ 
  end, 
  duration = 1000, 
  startOnMount = true,
  decimals = 0 
}: UseCountUpOptions) {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const start = () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    const startTime = Date.now()
    const startValue = 0

    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function (ease-out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = startValue + (end - startValue) * easeOut
      
      setCurrent(Number(currentValue.toFixed(decimals)))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }
    
    requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (startOnMount) {
      // Small delay to make the animation more noticeable
      const timer = setTimeout(start, 100)
      return () => clearTimeout(timer)
    }
  }, [end, startOnMount])

  return { current, start, isAnimating }
}