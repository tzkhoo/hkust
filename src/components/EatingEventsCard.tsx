import { useState } from "react"
import { Camera, Timer, Utensils, Sparkles, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CameraModal } from "./CameraModal"
import { WatchDetection } from "./WatchDetection"

export function EatingEventsCard() {
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [recentPhotos, setRecentPhotos] = useState<string[]>([])
  const [isWatchConnected, setIsWatchConnected] = useState(true)

  const handleCapturePhoto = (photo: string) => {
    setRecentPhotos(prev => [photo, ...prev.slice(0, 2)])
  }

  // Eating detection data - only active when watch is connected
  const hasRecentDetection = isWatchConnected
  const detectionTime = "2 minutes ago"

  return (
    <>
      <div className="glass-card p-6 animate-slide-up space-y-6" style={{ borderRadius: '24px' }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Eating Events</h2>
            <p className="text-foreground-secondary">AI-powered meal detection</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-warning/20 to-warning/10 flex items-center justify-center">
            <Utensils className="h-6 w-6 text-warning" />
          </div>
        </div>

        {/* Watch Detection Status */}
        <WatchDetection onConnectionChange={setIsWatchConnected} />

        {/* Recent Detection Alert */}
        {hasRecentDetection && (
          <div className="relative overflow-hidden">
            {/* Animated Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-warning/10 via-warning/20 to-warning/10 rounded-xl animate-pulse" />
            
            <div className="glass-card rounded-xl p-4 sm:p-6 border border-warning/30 relative">
              {/* Live indicator - positioned to avoid overlap */}
              <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
                <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
                <span className="text-xs text-warning font-medium">LIVE</span>
              </div>

              {/* Main content - improved mobile layout */}
              <div className="space-y-4">
                {/* Detection info */}
                <div className="flex items-center gap-3 pr-12 sm:pr-0">
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-warning/20 flex items-center justify-center flex-shrink-0">
                    <Timer className="h-5 w-5 sm:h-6 sm:w-6 text-warning" />
                    {/* Pulsing Ring */}
                    <div className="absolute inset-0 rounded-lg border-2 border-warning/40 animate-ping" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold flex items-center gap-2 flex-wrap">
                      <span className="text-sm sm:text-base">Eating detected</span>
                      <Sparkles className="h-4 w-4 text-warning animate-pulse flex-shrink-0" />
                    </div>
                    <div className="text-xs sm:text-sm text-foreground-secondary flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      <span>{detectionTime}</span>
                    </div>
                  </div>
                </div>
                
                {/* Action button - full width on mobile, inline on desktop */}
                <div className="sm:flex sm:justify-end">
                  <Button 
                    onClick={() => setIsCameraOpen(true)}
                    className="btn-primary text-sm hover:scale-105 transition-transform duration-200 w-full sm:w-auto"
                    size="sm"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Add Photo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Capture Section */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Quick Capture
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              onClick={() => setIsCameraOpen(true)}
              variant="outline"
              className="h-16 sm:h-20 flex-col glass-card border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all duration-300"
            >
              <Camera className="h-5 w-5 sm:h-6 sm:w-6 text-primary mb-2" />
              <span className="text-sm font-medium">Capture Meal</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-16 sm:h-20 flex-col glass-card border-dashed border-secondary/30 hover:border-secondary/60 hover:bg-secondary/5 transition-all duration-300"
            >
              <Timer className="h-5 w-5 sm:h-6 sm:w-6 text-secondary mb-2" />
              <span className="text-sm font-medium">Log Manually</span>
            </Button>
          </div>
        </div>

        {/* Recent Photos */}
        {recentPhotos.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-foreground-secondary">Recent Captures</h3>
            <div className="flex gap-2">
              {recentPhotos.map((photo, index) => (
                <div
                  key={photo}
                  className="w-16 h-16 rounded-xl bg-gradient-to-br from-success/20 to-success/10 border-2 border-success/30 flex items-center justify-center animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Camera className="h-6 w-6 text-success" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasRecentDetection && recentPhotos.length === 0 && (
          <div className="text-center py-8 px-4 text-foreground-secondary">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-muted/20 to-muted/10 flex items-center justify-center mx-auto mb-4">
              <Camera className="h-8 w-8 opacity-50" />
            </div>
            <p className="text-base sm:text-lg mb-2">No recent meals logged</p>
            <p className="text-sm max-w-xs mx-auto">Your smartwatch will notify you when eating is detected</p>
          </div>
        )}
      </div>

      {/* Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCapturePhoto}
      />
    </>
  )
}