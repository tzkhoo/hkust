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
  
  const percentage = Math.min((value / max) * 100, 100)
  
  // Better sizing calculations for cleaner appearance
  const strokeWidth = Math.max(size / 10, 6) // Responsive stroke width
  const radius = (size - strokeWidth) / 2
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
      <svg className="transform -rotate-90 drop-shadow-sm" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="transparent"
          opacity={0.2}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
          style={{
            filter: 'drop-shadow(0 2px 8px hsla(var(--primary), 0.3))'
          }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="50%" stopColor="hsl(var(--primary-glow))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content with better spacing */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-bold font-mono leading-none mb-1">
            {animatedValue.toLocaleString()}
          </div>
          <div className="text-xs text-foreground-secondary leading-none">
            of {max.toLocaleString()}
          </div>
        </div>
      </div>
      
      {/* Progress percentage indicator */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
        <div className="text-xs font-medium text-primary bg-background/80 backdrop-blur-sm rounded-full px-2 py-0.5 border border-primary/20">
          {Math.round(animatedPercentage)}%
        </div>
      </div>
    </div>
  )
}