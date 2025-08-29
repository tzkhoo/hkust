import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCountUpAnimation } from "@/hooks/useCountUpAnimation"

interface MetricCardProps {
  title: string
  value: string | number
  unit?: string
  change?: number
  icon: LucideIcon
  trend?: "up" | "down" | "neutral"
  className?: string
  children?: React.ReactNode
  animated?: boolean
  animationDelay?: number
}

export function MetricCard({ 
  title, 
  value, 
  unit, 
  change, 
  icon: Icon, 
  trend = "neutral",
  className,
  children,
  animated = false,
  animationDelay = 0
}: MetricCardProps) {
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value
  const hasDecimals = typeof value === 'number' && value % 1 !== 0
  
  const { current: animatedValue } = useCountUpAnimation({
    end: animated ? numericValue : numericValue,
    duration: 1200,
    startOnMount: animated,
    decimals: hasDecimals ? 1 : 0
  })
  
  const displayValue = animated ? 
    (hasDecimals ? animatedValue.toFixed(1) : animatedValue.toLocaleString()) : 
    value
  const getTrendColor = () => {
    switch (trend) {
      case "up": return "text-metric-positive"
      case "down": return "text-metric-negative"
      default: return "text-metric-neutral"
    }
  }

  const getTrendGlow = () => {
    switch (trend) {
      case "up": return "metric-glow-positive"
      case "down": return "metric-glow-negative"
      default: return ""
    }
  }

  const getTrendIcon = () => {
    if (change === undefined) return null
    return change > 0 ? "↗" : change < 0 ? "↙" : "→"
  }

  return (
    <div className={cn("metric-card group", getTrendGlow(), className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 group-hover:soft-glow transition-all duration-300">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono">{displayValue}</span>
              {unit && <span className="text-sm text-foreground-secondary">{unit}</span>}
            </div>
          </div>
        </div>
        
        {change !== undefined && (
          <div className={cn("flex items-center gap-1 text-sm font-medium", getTrendColor())}>
            <span>{getTrendIcon()}</span>
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      
      {children && (
        <div className="mt-4 pt-4 border-t border-glass-border/30">
          {children}
        </div>
      )}
    </div>
  )
}