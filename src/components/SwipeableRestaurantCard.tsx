import { useState, useEffect } from "react"
import { Heart, X, MapPin, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useSwipeCard } from "@/hooks/useSwipeCard"

interface Restaurant {
  id: string
  name: string
  distance: string
  cuisine: string
  rating: number
  image: string
  topDishes: Array<{
    name: string
    healthScore: number
    price: string
  }>
}

interface SwipeableRestaurantCardProps {
  restaurant: Restaurant
  nextRestaurant?: Restaurant
  onSwipe: (direction: 'left' | 'right') => void
  totalCount: number
  currentIndex: number
}

export function SwipeableRestaurantCard({ 
  restaurant, 
  nextRestaurant, 
  onSwipe, 
  totalCount, 
  currentIndex 
}: SwipeableRestaurantCardProps) {
  const {
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
  } = useSwipeCard({
    onSwipe: (direction) => {
      // Announce action for screen readers
      const action = direction === 'left' ? 'Passed' : 'Interested in'
      announceAction(`${action} ${restaurant.name}`)
      onSwipe(direction)
    },
    threshold: 50
  })

  // Reset cards when restaurant changes
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM updates are complete
    requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.transition = ""
        cardRef.current.style.transform = ""
        cardRef.current.style.opacity = "1"
        cardRef.current.style.zIndex = "20"
      }
      if (nextCardRef.current) {
        nextCardRef.current.style.transition = ""
        nextCardRef.current.style.transform = "scale(0.95) translateY(8px)"
        nextCardRef.current.style.opacity = "0.7"
        nextCardRef.current.style.zIndex = "0"
      }
    })
  }, [restaurant.id])

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return "text-success"
    if (score >= 80) return "text-warning"
    return "text-metric-negative"
  }

  const getHealthScoreBg = (score: number) => {
    if (score >= 90) return "bg-success/20"
    if (score >= 80) return "bg-warning/20"
    return "bg-metric-negative/20"
  }

  // Check for reduced motion preference (but allow labels to show)
  const prefersReducedMotion = false // Always show labels for better UX

  const showLeft = (isDragging && swipeDistance < -10) || (isAnimating && activeDirection === 'left')
  const showRight = (isDragging && swipeDistance > 10) || (isAnimating && activeDirection === 'right')

  return (
    <div className="relative h-[90vh] max-h-[95vh] overflow-hidden rounded-2xl">
      {/* Next card (background layer) */}
      {nextRestaurant && (
        <Card 
          ref={nextCardRef}
          className="absolute inset-0 glass-card rounded-2xl pointer-events-none z-0 flex flex-col"
          style={{ 
            transform: 'scale(0.95) translateY(8px)',
            opacity: 0.7,
            transformOrigin: 'center bottom',
            willChange: 'transform, opacity'
          }}
        >
          <div className="relative h-48 sm:h-56 flex-shrink-0">
            <img 
              src={nextRestaurant.image} 
              alt={nextRestaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <Badge className="bg-background/80 text-foreground">
                {currentIndex + 2} of {totalCount}
              </Badge>
            </div>
          </div>

          {/* Scrollable Content Container */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {/* Restaurant Info */}
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold truncate">{nextRestaurant.name}</h2>
                  <p className="text-foreground-secondary text-sm truncate">{nextRestaurant.cuisine}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 ml-3">
                  <Star className="h-4 w-4 text-warning fill-current" />
                  <span className="text-sm font-medium">{nextRestaurant.rating}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6 text-sm text-foreground-secondary">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{nextRestaurant.distance}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Open now</span>
                </div>
              </div>

              {/* Top Recommended Dishes */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Top Matches for You</h3>
                <div className="space-y-3">
                  {nextRestaurant.topDishes.map((dish, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{dish.name}</h4>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge 
                            className={`text-xs ${getHealthScoreBg(dish.healthScore)} ${getHealthScoreColor(dish.healthScore)}`}
                          >
                            {dish.healthScore}% Health Match
                          </Badge>
                          <span className="text-xs font-medium">{dish.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Action Buttons with Safe Area */}
          <div className="flex-shrink-0 p-4 sm:p-6 pb-safe-area-inset-bottom bg-gradient-to-t from-background/95 to-transparent backdrop-blur-sm">
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                disabled
              >
                <X className="h-5 w-5 mr-2" />
                Pass
              </Button>
              <Button
                size="lg"
                className="flex-1"
                disabled
              >
                <Heart className="h-5 w-5 mr-2" />
                Interested
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Current card (foreground layer) */}
      <Card
        ref={cardRef}
        className={cn(
          "absolute inset-0 glass-card rounded-2xl cursor-grab active:cursor-grabbing z-20 flex flex-col",
          isDragging ? "transition-none" : "transition-all duration-300 ease-out",
          isAnimating && "pointer-events-none"
        )}
        style={{ willChange: 'transform, opacity' }}
        onMouseDown={handleMouseDown}
        onMouseMove={isDragging ? handleMouseMove : undefined}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        tabIndex={0}
        role="button"
        aria-label={`Restaurant: ${restaurant.name}. Swipe left to pass, right if interested.`}
      >
        {/* Swipe feedback labels */}
        {(isDragging || isAnimating) && (
          <>
            {/* Pass label (left) */}
            <div 
              className={cn(
                "absolute top-6 left-6 bg-destructive text-destructive-foreground px-4 py-2 rounded-full text-sm font-bold transition-all duration-150 z-20 shadow-lg border-2 border-destructive-foreground/20",
                showLeft ? "opacity-100 scale-110" : "opacity-0 scale-75"
              )}
            >
              PASS
            </div>
            
            {/* Interested label (right) */}
            <div 
              className={cn(
                "absolute top-6 right-6 bg-success text-success-foreground px-4 py-2 rounded-full text-sm font-bold transition-all duration-150 z-20 shadow-lg border-2 border-success-foreground/20",
                showRight ? "opacity-100 scale-110" : "opacity-0 scale-75"
              )}
            >
              INTERESTED
            </div>
          </>
        )}

        {/* Restaurant Image */}
        <div className="relative h-48 sm:h-56 flex-shrink-0">
          <img 
            src={restaurant.image} 
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <Badge className="bg-background/80 text-foreground">
              {currentIndex + 1} of {totalCount}
            </Badge>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Restaurant Info */}
          <div className="p-4 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-bold truncate">{restaurant.name}</h2>
                <p className="text-foreground-secondary text-sm truncate">{restaurant.cuisine}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 ml-3">
                <Star className="h-4 w-4 text-warning fill-current" />
                <span className="text-sm font-medium">{restaurant.rating}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6 text-sm text-foreground-secondary">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{restaurant.distance}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Open now</span>
              </div>
            </div>

            {/* Top Recommended Dishes */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Top Matches for You</h3>
              <div className="space-y-3">
                {restaurant.topDishes.map((dish, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{dish.name}</h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge 
                          className={`text-xs ${getHealthScoreBg(dish.healthScore)} ${getHealthScoreColor(dish.healthScore)}`}
                        >
                          {dish.healthScore}% Health Match
                        </Badge>
                        <span className="text-xs font-medium">{dish.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Action Buttons with Safe Area */}
        <div className="flex-shrink-0 p-4 sm:p-6 pb-safe-area-inset-bottom bg-gradient-to-t from-background/95 to-transparent backdrop-blur-sm">
          <div className="flex gap-4">
            <Button
              onClick={() => handleAction('left')}
              variant="outline"
              size="lg"
              className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
              disabled={isAnimating}
            >
              <X className="h-5 w-5 mr-2" />
              Pass
            </Button>
            <Button
              onClick={() => handleAction('right')}
              size="lg"
              className="flex-1"
              disabled={isAnimating}
            >
              <Heart className="h-5 w-5 mr-2" />
              Interested
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}