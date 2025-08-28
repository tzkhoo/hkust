import { useState, useRef, useEffect } from "react"
import { Camera, X, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CameraModalProps {
  isOpen: boolean
  onClose: () => void
  onCapture: (photo: string) => void
}

export function CameraModal({ isOpen, onClose, onCapture }: CameraModalProps) {
  const [isCapturing, setIsCapturing] = useState(false)
  const [captured, setCaptured] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Request camera permissions and start stream
  useEffect(() => {
    console.log('CameraModal useEffect triggered, isOpen:', isOpen)
    if (isOpen) {
      console.log('Modal is open, requesting camera access...')
      requestCameraAccess()
    } else {
      console.log('Modal is closed, stopping camera...')
      stopCamera()
    }
    
    return () => {
      console.log('CameraModal cleanup triggered')
      stopCamera()
    }
  }, [isOpen])

  const requestCameraAccess = async () => {
    try {
      setError(null)
      setHasPermission(null)
      
      console.log('Requesting camera access...')
      
      // Prevent duplicate stream requests
      if (stream) {
        console.log('Stream already exists, skipping request')
        return
      }
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported on this device")
      }

      // Request camera permission with more specific constraints
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        },
        audio: false
      })

      console.log('Camera access granted, stream:', mediaStream)
      setStream(mediaStream)
      setHasPermission(true)

      // Start video stream
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        
        // Wait for metadata to load before playing
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded, dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight)
          if (videoRef.current) {
            console.log('Attempting to play video...')
            videoRef.current.play().then(() => {
              console.log('Video playing successfully')
            }).catch(err => {
              console.error('Failed to play video:', err)
            })
          }
        }
        
        // Additional event listeners for debugging
        videoRef.current.oncanplay = () => {
          console.log('Video can start playing')
        }
        
        videoRef.current.onerror = (err) => {
          console.error('Video error:', err)
        }
      }
    } catch (err) {
      console.error('Camera access error:', err)
      setHasPermission(false)
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError("Camera permission denied. Please allow camera access and try again.")
        } else if (err.name === 'NotFoundError') {
          setError("No camera found on this device.")
        } else if (err.name === 'NotSupportedError') {
          setError("Camera not supported on this browser.")
        } else if (err.name === 'SecurityError') {
          setError("Camera blocked by browser security. Try opening in a new tab if using an iframe.")
        } else {
          setError("Failed to access camera. Please try again.")
        }
      } else {
        setError("An unexpected error occurred.")
      }
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current || !hasPermission) {
      console.error('Missing required elements for capture:', {
        video: !!videoRef.current,
        canvas: !!canvasRef.current,
        permission: hasPermission
      })
      return
    }
    
    setIsCapturing(true)
    console.log('Starting capture...')
    
    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      if (!context) throw new Error('Canvas context not available')

      // Ensure video is playing and has dimensions
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        throw new Error('Video not ready - no dimensions available')
      }

      console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight)

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert to blob and create photo URL
      canvas.toBlob((blob) => {
        if (blob) {
          const photoUrl = URL.createObjectURL(blob)
          console.log('Photo captured successfully:', photoUrl)
          setCaptured(true)
          setIsCapturing(false)
          
          // Call parent callback with photo
          onCapture(photoUrl)
          
          // Auto close after success animation
          setTimeout(() => {
            setCaptured(false)
            handleClose()
          }, 1500)
        } else {
          throw new Error('Failed to create blob from canvas')
        }
      }, 'image/jpeg', 0.9)
    } catch (err) {
      console.error('Capture error:', err)
      setError("Failed to capture photo. Please try again.")
      setIsCapturing(false)
    }
  }

  const handleClose = () => {
    if (!isCapturing) {
      setCaptured(false)
      stopCamera()
      setError(null)
      setHasPermission(null)
      onClose()
    }
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
          {/* Camera Viewfinder */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-black">
            {hasPermission === false || error ? (
              /* Error State */
              <div className="absolute inset-0 bg-gradient-to-br from-destructive/20 to-destructive/10 flex flex-col items-center justify-center p-4">
                <AlertCircle className="h-16 w-16 text-destructive mb-4" />
                <p className="text-destructive font-medium text-center mb-2">Camera Access Required</p>
                <p className="text-sm text-foreground-secondary text-center mb-4">
                  {error || "Please allow camera access to capture photos"}
                </p>
                <Button 
                  onClick={requestCameraAccess}
                  variant="outline"
                  className="border-destructive/30 hover:border-destructive/60"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            ) : hasPermission === null ? (
              /* Loading State */
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col items-center justify-center">
                <Camera className="h-16 w-16 text-primary animate-pulse mb-4" />
                <p className="text-primary font-medium">Requesting Camera Access...</p>
                <p className="text-sm text-foreground-secondary mt-2">Please allow camera permissions</p>
              </div>
            ) : (
              /* Camera View */
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Success Overlay */}
                {captured && (
                  <div className="absolute inset-0 bg-success/20 flex items-center justify-center">
                    <CheckCircle className="h-16 w-16 text-success animate-scale-in" />
                  </div>
                )}
                
                {/* Scanning Animation */}
                {isCapturing && (
                  <div className="absolute inset-0 border-2 border-primary/60 animate-pulse">
                    <div className="absolute inset-2 border border-accent/40 animate-glow-pulse" />
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
              disabled={isCapturing}
              className="glass-card border-muted hover:border-primary/50"
            >
              <X className="h-5 w-5 mr-2" />
              Cancel
            </Button>
            
            <Button
              size="lg"
              onClick={handleCapture}
              disabled={isCapturing || captured || !hasPermission}
              className={`btn-primary px-8 relative overflow-hidden ${
                captured ? 'bg-success hover:bg-success' : ''
              }`}
            >
              {captured ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Captured!
                </>
              ) : !hasPermission ? (
                <>
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Enable Camera
                </>
              ) : isCapturing ? (
                <>
                  <Camera className="h-5 w-5 mr-2 animate-pulse" />
                  Capturing...
                </>
              ) : (
                <>
                  <Camera className="h-5 w-5 mr-2" />
                  Capture
                </>
              )}
              
              {/* Capture Flash Effect */}
              {isCapturing && (
                <div className="absolute inset-0 bg-white/30 animate-ping" />
              )}
            </Button>
          </div>

          {/* Tips */}
          <div className="text-center text-sm text-foreground-secondary space-y-1">
            <p>💡 Make sure your food is well-lit</p>
            <p>📱 Hold your device steady</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}