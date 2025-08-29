import { useState } from "react"
import { Watch, Wifi, WifiOff } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface WatchDetectionProps {
  className?: string
  onConnectionChange?: (connected: boolean) => void
}

export function WatchDetection({ className = "", onConnectionChange }: WatchDetectionProps) {
  const [isWatchConnected, setIsWatchConnected] = useState(true)

  const handleConnectionChange = (connected: boolean) => {
    setIsWatchConnected(connected)
    onConnectionChange?.(connected)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Watch Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
            isWatchConnected 
              ? 'bg-gradient-to-br from-primary/20 to-secondary/20 ring-2 ring-primary/30'
              : 'bg-muted/50'
          }`}>
            <Watch className={`h-5 w-5 transition-colors duration-300 ${
              isWatchConnected ? 'text-primary' : 'text-muted-foreground'
            }`} />
            
            {/* Connection Indicator */}
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full transition-all duration-300 ${
              isWatchConnected 
                ? 'bg-success animate-pulse' 
                : 'bg-muted-foreground'
            }`} />
          </div>
          
          <div>
            <h3 className="font-semibold">Smartwatch Status</h3>
            <p className={`text-sm transition-colors duration-300 ${
              isWatchConnected 
                ? 'text-primary font-medium' 
                : 'text-muted-foreground'
            }`}>
              {isWatchConnected ? 'Watch Detected' : 'Watch Not Detected'}
            </p>
          </div>
        </div>

        <Switch
          checked={isWatchConnected}
          onCheckedChange={handleConnectionChange}
          className="data-[state=checked]:bg-primary"
        />
      </div>

      {/* Status Details */}
      <div className={`glass-card rounded-xl p-4 border transition-all duration-300 ${
        isWatchConnected 
          ? 'border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5' 
          : 'border-muted/30 bg-muted/5'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isWatchConnected ? (
              <Wifi className="h-4 w-4 text-primary" />
            ) : (
              <WifiOff className="h-4 w-4 text-muted-foreground" />
            )}
            
            <div className="text-sm">
              <div className={`font-medium transition-colors duration-300 ${
                isWatchConnected ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {isWatchConnected ? 'Connected' : 'Disconnected'}
              </div>
              <div className="text-xs text-foreground-secondary">
                {isWatchConnected 
                  ? 'Monitoring eating patterns' 
                  : 'Manual logging only'
                }
              </div>
            </div>
          </div>

          {/* Connection Quality */}
          {isWatchConnected && (
            <div className="flex items-center gap-1">
              <div className="w-1 h-3 bg-primary/60 rounded-full" />
              <div className="w-1 h-4 bg-primary/80 rounded-full" />
              <div className="w-1 h-5 bg-primary rounded-full animate-pulse" />
            </div>
          )}
        </div>

        {/* Additional Info */}
        {isWatchConnected && (
          <div className="mt-3 pt-3 border-t border-primary/10">
            <div className="flex justify-between text-xs text-foreground-secondary">
              <span>Battery: 78%</span>
              <span>Last sync: 2m ago</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}