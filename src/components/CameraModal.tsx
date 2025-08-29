import { useState, useRef, useEffect } from "react"
import { Camera, X, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CameraModalProps {
  isOpen: boolean
  onClose: () => void
  onCapture: (photo: string) => void
}

export function CameraModal({ isOpen, onClose, onCapture }: CameraModalProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [captured, setCaptured] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const isInIframe = window.self !== window.top

  const isSecureContext = () => {
    return window.location.protocol === 'https:' || 
           window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1'
  }

  const openCamera = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!isSecureContext()) {
        setError("Camera needs HTTPS or localhost.")
        return
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Camera API not supported on this browser.")
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      })

      setStream(stream)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        // Critical for iOS Safari - play after user gesture
        await videoRef.current.play().catch(() => {
          // Expected on some browsers, will work after user interaction
        })
      }

    } catch (err: any) {
      console.error('Camera error:', err)
      
      if (err.name === 'NotAllowedError') {
        setError('Permission denied. Enable camera access in browser settings.')
      } else if (err.name === 'NotFoundError') {
        setError('No camera found.')
      } else if (err.name === 'OverconstrainedError') {
        setError('Requested camera constraints not available.')
      } else if (err.message?.includes('secure')) {
        setError('Use HTTPS or localhost for camera access.')
      } else if (isInIframe) {
        setError('Camera blocked in iframe. Try opening in a new tab.')
      } else {
        setError('Unable to start camera.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !stream) return

    const video = videoRef.current
    const canvas = canvasRef.current
    
    const track = stream.getVideoTracks()[0]
    const settings = track.getSettings?.() || { width: 720, height: 1280 }
    const width = settings.width || video.videoWidth || 720
    const height = settings.height || video.videoHeight || 1280

    canvas.width = width
    canvas.height = height
    
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(video, 0, 0, width, height)
      
      canvas.toBlob(blob => {
        if (blob) {
          const reader = new FileReader()
          reader.onload = () => {
            const dataUrl = reader.result as string
            onCapture(dataUrl)
            setCaptured(true)
            
            setTimeout(() => {
              setCaptured(false)
              handleClose()
            }, 1500)
          }
          reader.readAsDataURL(blob)
        }
      }, 'image/jpeg', 0.92)
    }
  }

  const handleClose = () => {
    closeCamera()
    setError(null)
    setCaptured(false)
    onClose()
  }

  // Cleanup on unmount and modal close
  useEffect(() => {
    if (!isOpen) {
      closeCamera()
      setError(null)
      setCaptured(false)
    }
    
    return () => closeCamera()
  }, [isOpen])

  // Cleanup on page navigation
  useEffect(() => {
    const handlePageHide = () => closeCamera()
    window.addEventListener('pagehide', handlePageHide)
    return () => window.removeEventListener('pagehide', handlePageHide)
  }, [])

  const openInNewTab = () => {
    const url = `${window.location.origin}${window.location.pathname}?camera=true`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        handleClose()
      }
    }}>
      <DialogContent className="max-w-md mx-auto glass-card border-0 bg-background/95 backdrop-blur-xl">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-center text-2xl font-bold">
            Capture Your Meal
          </DialogTitle>
          <div className="text-center text-foreground-secondary">
            Position your food in the frame and tap to capture
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Camera Interface */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-black">
            {error ? (
              /* Error State */
              <div className="absolute inset-0 bg-gradient-to-br from-destructive/20 to-destructive/10 flex flex-col items-center justify-center p-4">
                <AlertCircle className="h-16 w-16 text-destructive mb-4" />
                <p className="text-destructive font-medium text-center mb-2">Camera Access Required</p>
                <p className="text-sm text-foreground-secondary text-center mb-4">
                  {error}
                </p>
                <div className="space-y-2">
                  <Button 
                    onClick={openCamera}
                    variant="outline"
                    className="border-destructive/30 hover:border-destructive/60 w-full"
                    disabled={isLoading}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {isLoading ? 'Opening Camera...' : 'Open Camera'}
                  </Button>
                  {isInIframe && (
                    <Button 
                      onClick={openInNewTab}
                      variant="outline"
                      className="border-primary/30 hover:border-primary/60 w-full"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in New Tab
                    </Button>
                  )}
                </div>
              </div>
            ) : !stream ? (
              /* Initial State */
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col items-center justify-center p-4">
                <Camera className="h-16 w-16 text-primary mb-4" />
                <p className="text-primary font-medium text-center mb-2">Ready to Capture</p>
                <p className="text-sm text-foreground-secondary text-center mb-4">
                  Tap "Open Camera" to start
                </p>
                <Button 
                  onClick={openCamera}
                  variant="outline"
                  className="border-primary/30 hover:border-primary/60"
                  disabled={isLoading}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {isLoading ? 'Opening Camera...' : 'Open Camera'}
                </Button>
              </div>
            ) : (
              /* Camera View */
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  controls={false}
                  className="w-full h-full object-cover"
                  style={{ 
                    display: 'block',
                    minHeight: '300px',
                    backgroundColor: '#000'
                  }}
                />
                
                {/* Success Overlay */}
                {captured && (
                  <div className="absolute inset-0 bg-success/20 flex items-center justify-center">
                    <CheckCircle className="h-16 w-16 text-success animate-scale-in" />
                  </div>
                )}

                {/* Corner Frame Indicators */}
                <div className="absolute top-4 left-4 w-6 h-6 border-l-3 border-t-3 border-white/80 rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-6 h-6 border-r-3 border-t-3 border-white/80 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-l-3 border-b-3 border-white/80 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-3 border-b-3 border-white/80 rounded-br-lg" />
              </>
            )}
          </div>

          {/* Hidden canvas for photo capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handleClose}
              className="glass-card border-muted hover:border-primary/50"
            >
              <X className="h-5 w-5 mr-2" />
              Cancel
            </Button>
            
            {stream && (
              <Button
                size="lg"
                onClick={takePhoto}
                disabled={captured}
                className={`btn-primary px-8 relative overflow-hidden ${
                  captured ? 'bg-success hover:bg-success' : ''
                }`}
              >
                {captured ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Captured!
                  </>
                ) : (
                  <>
                    <Camera className="h-5 w-5 mr-2" />
                    Take Photo
                  </>
                )}
              </Button>
            )}
            
            {stream && !captured && (
              <Button
                variant="outline"
                size="lg"
                onClick={closeCamera}
                className="glass-card border-muted hover:border-destructive/50"
              >
                Close Camera
              </Button>
            )}
          </div>

          {/* Info */}
          <div className="text-center text-sm text-foreground-secondary space-y-1">
            {!stream ? (
              <>
                <p>📱 Camera access required for photo capture</p>
                <p>🔒 Your privacy is protected - photos stay on your device</p>
              </>
            ) : (
              <>
                <p>💡 Make sure your food is well-lit</p>
                <p>📱 Hold your device steady</p>
              </>
            )}
            {isInIframe && (
              <p className="text-xs text-warning">⚠️ Running in preview mode - may have camera restrictions</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}