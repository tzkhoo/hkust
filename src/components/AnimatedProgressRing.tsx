import { useEffect, useState } from 'react'

interface AnimatedProgressRingProps {
  value: number
  max: number
  size?: number
  duration?: number
  delay?: number
}

export function AnimatedProgressRing({ 
  value, 
  max, 
  size = 80, 
  duration = 1200,
  delay = 0 
}: AnimatedProgressRingProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const [animatedPercentage, setAnimatedPercentage] = useState(0)
  
  const percentage = (value / max) * 100
  const radius = size / 2 - 12
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => {
      const startTime = Date.now()
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Easing function (ease-out cubic)
        const easeOut = 1 - Math.pow(1 - progress, 3)
        
        const currentValue = value * easeOut
        const currentPercentage = percentage * easeOut
        
        setAnimatedValue(Math.round(currentValue))
        setAnimatedPercentage(currentPercentage)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      requestAnimationFrame(animate)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, percentage, duration, delay])

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-4 flex items-center justify-center">
        <div className="text-center px-2">
          <div className="text-base font-bold font-mono leading-tight">{animatedValue.toLocaleString()}</div>
          <div className="text-xs text-foreground-secondary mt-0.5">of {max.toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}