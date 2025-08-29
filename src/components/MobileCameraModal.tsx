import { useState } from "react"
import { Camera, X, CheckCircle, AlertCircle, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Capacitor } from '@capacitor/core'

interface MobileCameraModalProps {
  isOpen: boolean
  onClose: () => void
  onCapture: (photo: string) => void
}

export function MobileCameraModal({ isOpen, onClose, onCapture }: MobileCameraModalProps) {
  const [isCapturing, setIsCapturing] = useState(false)
  const [captured, setCaptured] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isNativeApp = Capacitor.isNativePlatform()

  const handleNativeCapture = async () => {
    try {
      setIsCapturing(true)
      setError(null)

      // Ensure camera permission is granted before attempting to capture
      try {
        const perm = await CapacitorCamera.checkPermissions()
        let granted = perm.camera === 'granted'
        if (!granted) {
          const req = await CapacitorCamera.requestPermissions({ permissions: ['camera'] as any })
          granted = req.camera === 'granted'
        }
        if (!granted) {
          setError('Camera permission denied. Please enable camera access in system settings and try again.')
          return
        }
      } catch (permErr) {
        console.error('Permission check error:', permErr)
        // Proceed to attempt getPhoto which may prompt on some platforms
      }

      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: 1280,
        height: 720
      })

      if (image.dataUrl) {
        setCaptured(true)
        onCapture(image.dataUrl)
        
        // Auto close after success animation
        setTimeout(() => {
          setCaptured(false)
          handleClose()
        }, 1500)
      }
    } catch (err: any) {
      console.error('Native camera error:', err)
      // Provide clearer guidance when permission is the underlying cause
      if (err?.message && String(err.message).toLowerCase().includes('permission')) {
        setError('Camera permission is required. Please enable it in Settings and relaunch the app.')
      } else {
        setError('Failed to capture photo with native camera')
      }
    } finally {
      setIsCapturing(false)
    }
  }

  const handleWebCapture = async () => {
    try {
      setIsCapturing(true)
      setError(null)

      // Fallback to web camera for browsers
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })

      // Create video element to capture frame
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      video.srcObject = stream
      video.play()

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        
        if (context) {
          context.drawImage(video, 0, 0)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
          
          // Stop stream
          stream.getTracks().forEach(track => track.stop())
          
          setCaptured(true)
          onCapture(dataUrl)
          
          setTimeout(() => {
            setCaptured(false)
            handleClose()
          }, 1500)
        }
      }
    } catch (err) {
      console.error('Web camera error:', err)
      setError('Failed to access camera')
      setIsCapturing(false)
    }
  }

  const handleCapture = () => {
    if (isNativeApp) {
      handleNativeCapture()
    } else {
      handleWebCapture()
    }
  }

  const handleClose = () => {
    if (!isCapturing) {
      setCaptured(false)
      setError(null)
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
            {isNativeApp ? 'Using native camera for best quality' : 'Using web camera'}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Camera Interface */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col items-center justify-center p-8">
            {error ? (
              <div className="text-center">
                <AlertCircle className="h-16 w-16 text-destructive mb-4 mx-auto" />
                <p className="text-destructive font-medium mb-2">Camera Error</p>
                <p className="text-sm text-foreground-secondary">{error}</p>
              </div>
            ) : captured ? (
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-success animate-scale-in mb-4 mx-auto" />
                <p className="text-success font-medium">Photo Captured!</p>
              </div>
            ) : (
              <div className="text-center">
                {isNativeApp ? (
                  <Smartphone className="h-16 w-16 text-primary mb-4 mx-auto" />
                ) : (
                  <Camera className="h-16 w-16 text-primary mb-4 mx-auto" />
                )}
                <p className="text-primary font-medium mb-2">Ready to Capture</p>
                <p className="text-sm text-foreground-secondary">
                  {isNativeApp 
                    ? 'Tap capture to open native camera app'
                    : 'This will open your device camera'
                  }
                </p>
              </div>
            )}
          </div>

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
              disabled={isCapturing || captured}
              className={`btn-primary px-8 relative overflow-hidden ${
                captured ? 'bg-success hover:bg-success' : ''
              }`}
            >
              {captured ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Captured!
                </>
              ) : isCapturing ? (
                <>
                  <Camera className="h-5 w-5 mr-2 animate-pulse" />
                  Opening Camera...
                </>
              ) : (
                <>
                  <Camera className="h-5 w-5 mr-2" />
                  Capture Photo
                </>
              )}
              
              {/* Capture Flash Effect */}
              {isCapturing && (
                <div className="absolute inset-0 bg-white/30 animate-ping" />
              )}
            </Button>
          </div>

          {/* Info */}
          <div className="text-center text-sm text-foreground-secondary space-y-1">
            {isNativeApp ? (
              <>
                <p>📱 Using native camera for optimal quality</p>
                <p>✨ Full resolution and advanced features available</p>
              </>
            ) : (
              <>
                <p>🌐 Using web camera</p>
                <p>📱 Install as an app for better camera experience</p>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}