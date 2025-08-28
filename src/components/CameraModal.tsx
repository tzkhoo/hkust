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
  const [isCapturing, setIsCapturing] = useState(false)
  const [captured, setCaptured] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isInIframe, setIsInIframe] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Request camera permissions and start stream
  useEffect(() => {
    console.log('CameraModal useEffect triggered, isOpen:', isOpen)
    
    // Check if running in iframe
    const inIframe = window !== window.top
    setIsInIframe(inIframe)
    addDebugInfo(`Running in iframe: ${inIframe}`)
    addDebugInfo(`User agent: ${navigator.userAgent}`)
    addDebugInfo(`Protocol: ${window.location.protocol}`)
    addDebugInfo(`Host: ${window.location.host}`)
    
    if (isOpen) {
      console.log('Modal is open, requesting camera access...')
      // Add small delay to ensure DOM is ready
      setTimeout(() => {
        requestCameraAccess()
      }, 100)
    } else {
      console.log('Modal is closed, stopping camera...')
      stopCamera()
      resetState()
    }
    
    return () => {
      console.log('CameraModal cleanup triggered')
      stopCamera()
    }
  }, [isOpen])

  const addDebugInfo = (info: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setDebugInfo(prev => [`[${timestamp}] ${info}`, ...prev.slice(0, 9)])
    console.log(`[CameraModal Debug] ${info}`)
  }

  const resetState = () => {
    setIsCapturing(false)
    setCaptured(false)
    setHasPermission(null)
    setError(null)
    setDebugInfo([])
  }

  const requestCameraAccess = async () => {
    try {
      setError(null)
      setHasPermission(null)
      addDebugInfo('Starting camera access request...')
      
      // Prevent duplicate stream requests
      if (stream) {
        addDebugInfo('Stream already exists, skipping request')
        return
      }
      
      // Check iframe security restrictions
      if (isInIframe) {
        addDebugInfo('Running in iframe - potential security restrictions')
        // Try to detect if camera is blocked by iframe policy
        try {
          await navigator.permissions.query({ name: 'camera' as PermissionName })
          addDebugInfo('Permissions API available')
        } catch (e) {
          addDebugInfo('Permissions API not available')
        }
      }
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported on this device")
      }
      
      addDebugInfo('getUserMedia is supported')

      // Try to get existing permissions first
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName })
        addDebugInfo(`Current camera permission: ${permissionStatus.state}`)
        
        if (permissionStatus.state === 'denied') {
          throw new Error('Camera permission was previously denied')
        }
      } catch (e) {
        addDebugInfo('Unable to check camera permissions')
      }

      addDebugInfo('Requesting media stream...')
      
      // Request camera permission with fallback constraints
      let mediaStream: MediaStream
      try {
        // Try with ideal constraints first
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280, min: 640 },
            height: { ideal: 720, min: 480 }
          },
          audio: false
        })
      } catch (firstErr) {
        addDebugInfo('Failed with environment camera, trying user camera...')
        // Fallback to front camera
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'user',
            width: { ideal: 1280, min: 320 },
            height: { ideal: 720, min: 240 }
          },
          audio: false
        })
      }

      addDebugInfo(`Camera access granted, tracks: ${mediaStream.getVideoTracks().length}`)
      const videoTrack = mediaStream.getVideoTracks()[0]
      if (videoTrack) {
        addDebugInfo(`Video track settings: ${JSON.stringify(videoTrack.getSettings())}`)
      }
      
      setStream(mediaStream)
      setHasPermission(true)

      // Start video stream
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        
        // Wait for metadata to load before playing
        videoRef.current.onloadedmetadata = () => {
          addDebugInfo(`Video metadata loaded: ${videoRef.current?.videoWidth}x${videoRef.current?.videoHeight}`)
          if (videoRef.current) {
            addDebugInfo('Attempting to play video...')
            videoRef.current.play().then(() => {
              addDebugInfo('Video playing successfully')
            }).catch(err => {
              addDebugInfo(`Failed to play video: ${err.message}`)
            })
          }
        }
        
        videoRef.current.oncanplay = () => {
          addDebugInfo('Video can start playing')
        }
        
        videoRef.current.onerror = (err) => {
          addDebugInfo(`Video error: ${err}`)
        }
      }
    } catch (err) {
      addDebugInfo(`Camera access error: ${err instanceof Error ? err.message : String(err)}`)
      setHasPermission(false)
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          if (isInIframe) {
            setError("Camera blocked by iframe security. Please open this app in a new tab to use the camera.")
          } else {
            setError("Camera permission denied. Please allow camera access and try again.")
          }
        } else if (err.name === 'NotFoundError') {
          setError("No camera found on this device.")
        } else if (err.name === 'NotSupportedError') {
          setError("Camera not supported on this browser.")
        } else if (err.name === 'SecurityError') {
          setError("Camera blocked by browser security. This is common in iframe previews - try opening in a new tab.")
        } else if (err.message.includes('denied')) {
          setError("Camera permission was denied. Please reset camera permissions in your browser settings.")
        } else {
          setError(`Camera error: ${err.message}`)
        }
      } else {
        setError("An unexpected error occurred.")
      }
    }
  }

  const stopCamera = () => {
    if (stream) {
      addDebugInfo(`Stopping camera stream with ${stream.getTracks().length} tracks`)
      stream.getTracks().forEach(track => {
        track.stop()
        addDebugInfo(`Stopped track: ${track.kind}`)
      })
      setStream(null)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const openInNewTab = () => {
    const currentUrl = window.location.href
    window.open(currentUrl, '_blank')
  }

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current || !hasPermission) {
      addDebugInfo(`Capture failed - missing elements: video=${!!videoRef.current}, canvas=${!!canvasRef.current}, permission=${hasPermission}`)
      return
    }
    
    setIsCapturing(true)
    addDebugInfo('Starting capture...')
    
    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      if (!context) throw new Error('Canvas context not available')

      // Ensure video is playing and has dimensions
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        addDebugInfo(`Video not ready - dimensions: ${video.videoWidth}x${video.videoHeight}`)
        throw new Error('Video not ready - no dimensions available')
      }

      addDebugInfo(`Capturing from video: ${video.videoWidth}x${video.videoHeight}`)

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert to blob and create photo URL
      canvas.toBlob((blob) => {
        if (blob) {
          const photoUrl = URL.createObjectURL(blob)
          addDebugInfo(`Photo captured successfully: ${blob.size} bytes`)
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
      addDebugInfo(`Capture error: ${err instanceof Error ? err.message : String(err)}`)
      setError("Failed to capture photo. Please try again.")
      setIsCapturing(false)
    }
  }

  const handleClose = () => {
    if (!isCapturing) {
      addDebugInfo('Closing modal and resetting state')
      resetState()
      stopCamera()
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
                <div className="space-y-2">
                  <Button 
                    onClick={requestCameraAccess}
                    variant="outline"
                    className="border-destructive/30 hover:border-destructive/60 w-full"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Try Again
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
                  className="w-full h-full object-cover bg-black"
                  style={{ 
                    minHeight: '200px',
                    backgroundColor: '#000'
                  }}
                  onLoadedData={() => addDebugInfo('Video data loaded and ready to play')}
                  onPlay={() => addDebugInfo('Video started playing')}
                  onTimeUpdate={() => {
                    if (videoRef.current) {
                      addDebugInfo(`Video playing: ${videoRef.current.videoWidth}x${videoRef.current.videoHeight}`)
                    }
                  }}
                />
                
                {/* Loading overlay if video dimensions aren't ready */}
                {hasPermission && videoRef.current?.videoWidth === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="h-8 w-8 text-white animate-pulse mx-auto mb-2" />
                      <p className="text-white text-sm">Starting camera...</p>
                    </div>
                  </div>
                )}
                
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
            {isInIframe && (
              <p className="text-xs text-warning">⚠️ Running in preview mode - camera may be restricted</p>
            )}
          </div>

          {/* Debug Info (only show if there are errors) */}
          {(error || debugInfo.length > 0) && (
            <details className="text-xs text-foreground-secondary">
              <summary className="cursor-pointer text-xs mb-2">Debug Information</summary>
              <div className="bg-muted/10 rounded p-2 max-h-32 overflow-y-auto">
                {debugInfo.map((info, index) => (
                  <div key={index} className="font-mono text-xs break-all">{info}</div>
                ))}
              </div>
            </details>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}