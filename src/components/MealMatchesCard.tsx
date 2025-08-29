import { useState, useRef, useEffect } from "react"
import { Heart, X, ChefHat, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MealMatch {
  id: string
  name: string
  description: string
  image: string
  cookTime: string
  rating: number
  calories: number
  protein: string
  tags: string[]
}

const mockMeals: MealMatch[] = [
  {
    id: "1",
    name: "Mediterranean Quinoa Bowl",
    description: "Fresh quinoa with roasted vegetables, feta cheese, and tahini dressing",
    image: "🥗",
    cookTime: "15 min",
    rating: 4.8,
    calories: 420,
    protein: "18g",
    tags: ["Vegetarian", "High Protein", "Mediterranean"]
  },
  {
    id: "2", 
    name: "Grilled Salmon with Asparagus",
    description: "Wild-caught salmon with garlic roasted asparagus and lemon herb butter",
    image: "🐟",
    cookTime: "20 min",
    rating: 4.9,
    calories: 380,
    protein: "32g",
    tags: ["High Protein", "Omega-3", "Low Carb"]
  },
  {
    id: "3",
    name: "Thai Coconut Curry",
    description: "Creamy coconut curry with fresh vegetables and jasmine rice",
    image: "🍛",
    cookTime: "25 min", 
    rating: 4.7,
    calories: 450,
    protein: "14g",
    tags: ["Vegan", "Spicy", "Asian"]
  }
]

export function MealMatchesCard() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [swipeDistance, setSwipeDistance] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const [touchStart, setTouchStart] = useState(0)

  // Swipe threshold
  const SWIPE_THRESHOLD = 120

  // Handle card action (pass or interested)
  const handleAction = (action: 'pass' | 'interested') => {
    if (isAnimating) return
    
    setIsAnimating(true)
    
    // Animate card away
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${action === 'pass' ? '-100%' : '100%'}) rotate(${action === 'pass' ? '-30deg' : '30deg'})`
      cardRef.current.style.opacity = '0'
    }
    
    // Move to next card after animation
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % mockMeals.length)
      setSwipeDistance(0)
      setIsAnimating(false)
      if (cardRef.current) {
        cardRef.current.style.transform = ''
        cardRef.current.style.opacity = '1'
      }
    }, 300)
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
    
    if (cardRef.current) {
      const rotation = distance * 0.1 // Subtle tilt
      const opacity = Math.max(0.5, 1 - Math.abs(distance) / 300)
      cardRef.current.style.transform = `translateX(${distance}px) rotate(${rotation}deg)`
      cardRef.current.style.opacity = opacity.toString()
    }
  }

  const handleDragEnd = () => {
    if (!isDragging || isAnimating) return
    
    setIsDragging(false)
    
    // Check if swipe threshold was met
    if (Math.abs(swipeDistance) > SWIPE_THRESHOLD) {
      handleAction(swipeDistance < 0 ? 'pass' : 'interested')
    } else {
      // Snap back to center
      if (cardRef.current) {
        cardRef.current.style.transform = ''
        cardRef.current.style.opacity = '1'
      }
      setSwipeDistance(0)
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
    setTouchStart(touch.clientX)
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
        handleAction('pass')
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleAction('interested')
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

  const currentMeal = mockMeals[currentIndex]
  const nextMeal = mockMeals[(currentIndex + 1) % mockMeals.length]

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div className="glass-card p-6 animate-slide-up space-y-6" style={{ borderRadius: '24px' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Meal Matches</h2>
          <p className="text-foreground-secondary">Swipe to discover your next meal</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <ChefHat className="h-6 w-6 text-primary" />
        </div>
      </div>

      {/* Card Stack */}
      <div className="relative h-96 overflow-hidden rounded-2xl">
        {/* Next card (background) */}
        <div className="absolute inset-0 glass-card rounded-2xl p-6 scale-95 opacity-50 z-0">
          <div className="text-center">
            <div className="text-6xl mb-4">{nextMeal.image}</div>
            <h3 className="text-lg font-semibold mb-2">{nextMeal.name}</h3>
          </div>
        </div>

        {/* Current card */}
        <div
          ref={cardRef}
          className={cn(
            "absolute inset-0 glass-card rounded-2xl p-6 cursor-grab active:cursor-grabbing transition-all z-10",
            isDragging ? "duration-0" : "duration-300 ease-out",
            isAnimating && "pointer-events-none"
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={isDragging ? handleMouseMove : undefined}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          tabIndex={0}
          role="button"
          aria-label={`Meal option: ${currentMeal.name}. Swipe left to pass, right if interested.`}
        >
          {/* Swipe feedback labels */}
          {isDragging && !prefersReducedMotion && (
            <>
              {/* Pass label (left) */}
              <div 
                className={cn(
                  "absolute top-4 left-4 bg-destructive/90 text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium transition-opacity",
                  swipeDistance < -30 ? "opacity-100" : "opacity-0"
                )}
              >
                PASS
              </div>
              
              {/* Interested label (right) */}
              <div 
                className={cn(
                  "absolute top-4 right-4 bg-success/90 text-success-foreground px-3 py-1 rounded-full text-sm font-medium transition-opacity",
                  swipeDistance > 30 ? "opacity-100" : "opacity-0"
                )}
              >
                INTERESTED
              </div>
            </>
          )}

          {/* Card content */}
          <div className="space-y-4 h-full flex flex-col">
            {/* Meal image */}
            <div className="text-center">
              <div className="text-8xl mb-4">{currentMeal.image}</div>
            </div>

            {/* Meal info */}
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-xl font-bold mb-2">{currentMeal.name}</h3>
                <p className="text-foreground-secondary text-sm leading-relaxed">
                  {currentMeal.description}
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{currentMeal.cookTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-warning fill-current" />
                  <span>{currentMeal.rating}</span>
                </div>
                <div className="text-foreground-secondary">
                  {currentMeal.calories} cal • {currentMeal.protein} protein
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {currentMeal.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 sm:gap-4">
        <Button
          variant="outline"
          className="flex-1 h-12 sm:h-auto sm:flex-initial sm:min-w-[120px] border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 hover:scale-105"
          onClick={() => handleAction('pass')}
          disabled={isAnimating}
        >
          <X className="h-5 w-5 sm:mr-2" />
          <span className="hidden sm:inline">Pass</span>
        </Button>
        
        <Button
          className="flex-1 h-12 sm:h-auto sm:flex-initial sm:min-w-[120px] bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105"
          onClick={() => handleAction('interested')}
          disabled={isAnimating}
        >
          <Heart className="h-5 w-5 sm:mr-2" />
          <span className="hidden sm:inline">Interested</span>
        </Button>
      </div>

      {/* Card counter */}
      <div className="text-center text-sm text-foreground-secondary">
        {currentIndex + 1} of {mockMeals.length}
      </div>
    </div>
  )
}