import { useState, useRef, useEffect } from "react"

interface UseSwipeCardProps {
  onSwipe: (direction: 'left' | 'right') => void
  onAnimationComplete?: () => void
  threshold?: number
}

export function useSwipeCard({ onSwipe, onAnimationComplete, threshold = 80 }: UseSwipeCardProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [swipeDistance, setSwipeDistance] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [activeDirection, setActiveDirection] = useState<'left' | 'right' | null>(null)
  const [hasPassedThreshold, setHasPassedThreshold] = useState(false)
  const [dragProgress, setDragProgress] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const nextCardRef = useRef<HTMLDivElement>(null)
  const swipeDistanceRef = useRef(0)

  // ARIA live region for announcements
  const announceAction = (message: string) => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    document.body.appendChild(announcement)
    setTimeout(() => document.body.removeChild(announcement), 1000)
  }

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Handle card action (pass or interested)
  const handleAction = (direction: 'left' | 'right') => {
    if (isAnimating) return
    
    setActiveDirection(direction)
    setIsAnimating(true)
    
    // Animate current card away and next card to front simultaneously
    if (cardRef.current) {
      const exitDirection = direction === 'left' ? '-120%' : '120%'
      const exitRotation = direction === 'left' ? '-30deg' : '30deg'
      cardRef.current.style.transform = `translateX(${exitDirection}) rotate(${exitRotation})`
      cardRef.current.style.opacity = '0'
      cardRef.current.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }
    
    // Animate next card to front position
    if (nextCardRef.current) {
      nextCardRef.current.style.transform = 'scale(1) translateY(0)'
      nextCardRef.current.style.opacity = '1'
      nextCardRef.current.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      nextCardRef.current.style.zIndex = '15' // Between background and foreground
    }
    
    // Call onSwipe immediately
    onSwipe(direction)
    
    setTimeout(() => {
      // Reset states only after parent updates
      setSwipeDistance(0)
      setIsAnimating(false)
      setActiveDirection(null)
      setHasPassedThreshold(false)
      setDragProgress(0)
      onAnimationComplete?.()
    }, 500)
  }

  // Mouse/touch event handlers
  const handleDragStart = (clientX: number, clientY: number) => {
    if (isAnimating) return
    setIsDragging(true)
    setDragStart({ x: clientX, y: clientY })
  }

  const handleDragMove = (clientX: number) => {
    if (!isDragging || isAnimating) return
    
    const distance = clientX - dragStart.x
    setSwipeDistance(distance)
    swipeDistanceRef.current = distance

    // Calculate drag progress (0 to 1)
    const progress = Math.min(Math.abs(distance) / 200, 1) // Max progress at 200px
    setDragProgress(progress)

    // Update threshold/label state during drag
    const abs = Math.abs(distance)
    if (abs > 10) {
      setActiveDirection(distance < 0 ? 'left' : 'right')
    } else {
      setActiveDirection(null)
    }
    
    if (abs > threshold) {
      setHasPassedThreshold(true)
    } else {
      setHasPassedThreshold(false)
    }
    
    // Animate current card
    if (cardRef.current) {
      const rotation = prefersReducedMotion ? 0 : distance * 0.15
      const opacity = prefersReducedMotion ? 1 : Math.max(0.7, 1 - Math.abs(distance) / 400)
      const rotationStr = rotation !== 0 ? ` rotate(${rotation}deg)` : ''
      
      cardRef.current.style.transform = `translateX(${distance}px)${rotationStr}`
      cardRef.current.style.opacity = opacity.toString()
      cardRef.current.style.transition = ''
    }
    
    // Animate next card reveal based on drag progress
    if (nextCardRef.current) {
      const scale = 0.95 + (progress * 0.05) // Scale from 0.95 to 1.0
      const opacity = 0.7 + (progress * 0.3) // Opacity from 0.7 to 1.0
      const translateY = 8 - (progress * 8) // Move from 8px down to 0
      const parallax = distance * 0.1 // Subtle parallax effect
      
      nextCardRef.current.style.transform = `scale(${scale}) translateY(${translateY}px) translateX(${parallax}px)`
      nextCardRef.current.style.opacity = opacity.toString()
      nextCardRef.current.style.transition = ''
    }
  }

  const handleDragEnd = () => {
    if (!isDragging || isAnimating) return
    
    setIsDragging(false)
    
    // Check if swipe threshold was met using ref for accurate distance
    if (Math.abs(swipeDistanceRef.current) > threshold) {
      handleAction(swipeDistanceRef.current < 0 ? 'left' : 'right')
    } else {
      // Snap both cards back to original positions
      if (cardRef.current) {
        cardRef.current.style.transform = ''
        cardRef.current.style.opacity = '1'
        cardRef.current.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }
      
      if (nextCardRef.current) {
        nextCardRef.current.style.transform = 'scale(0.95) translateY(8px)'
        nextCardRef.current.style.opacity = '0.7'
        nextCardRef.current.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }
      
      // Reset transition after animation
      setTimeout(() => {
        if (cardRef.current) cardRef.current.style.transition = ''
        if (nextCardRef.current) nextCardRef.current.style.transition = ''
      }, 300)
      
      setSwipeDistance(0)
      swipeDistanceRef.current = 0
      setActiveDirection(null)
      setHasPassedThreshold(false)
      setDragProgress(0)
    }
  }

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleDragStart(e.clientX, e.clientY)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX)
  }

  const handleMouseUp = () => {
    handleDragEnd()
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    handleDragStart(touch.clientX, touch.clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    handleDragMove(touch.clientX)
  }

  const handleTouchEnd = () => {
    handleDragEnd()
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handleAction('left')
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleAction('right')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Mouse events for desktop
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleDragMove(e.clientX)
      }
    }

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleDragEnd()
      }
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isDragging, dragStart.x])

  return {
    cardRef,
    nextCardRef,
    isAnimating,
    isDragging,
    swipeDistance,
    dragProgress,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleAction,
    activeDirection,
    hasPassedThreshold,
    announceAction
  }
}