import { useState } from "react"
import { Home, Heart, Utensils, Sparkles, UtensilsCrossed, Settings } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { AIChatbot } from "./AIChatbot"

export function BottomNavigation() {
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showRipples, setShowRipples] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleAIClick = async () => {
    if (isAIOpen) {
      // Closing animation sequence
      setIsAnimating(true)
      setShowRipples(true)
      
      // Animation sequence timing for closing
      setTimeout(() => {
        setShowRipples(false)
      }, 600)
      
      setTimeout(() => {
        setIsAnimating(false)
        setIsAIOpen(false)
      }, 800)
      return
    }

    // Opening animation sequence
    setIsAnimating(true)
    setShowRipples(true)
    
    // Animation sequence timing for opening
    setTimeout(() => {
      setShowRipples(false)
    }, 1000)
    
    // Show chatbot after animation completes
    setTimeout(() => {
      setIsAnimating(false)
      setIsAIOpen(true)
    }, 1200)
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-4 left-4 right-4 z-50 pb-safe-bottom">
        <div className="max-w-lg mx-auto">
          <nav className="glass-card px-3 py-2 flex items-center justify-between border-2 soft-glow" style={{ height: '60px', borderRadius: '30px' }}>
            {/* Home Tab */}
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className={`
                flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200 h-12 min-w-[60px]
                ${isActive('/') 
                  ? 'bg-primary/20 text-primary' 
                  : 'text-foreground-secondary hover:text-foreground'
                }
              `}
            >
              <Home className="h-4 w-4" />
              <span className="text-[9px] font-medium hidden min-[360px]:block">Home</span>
            </Button>

            {/* Health Tab */}
            <Button
              variant="ghost"
              onClick={() => navigate('/health')}
              className={`
                flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200 h-12 min-w-[60px]
                ${isActive('/health') 
                  ? 'bg-primary/20 text-primary' 
                  : 'text-foreground-secondary hover:text-foreground'
                }
              `}
            >
              <Heart className="h-4 w-4" />
              <span className="text-[9px] font-medium hidden min-[360px]:block">Health</span>
            </Button>

            {/* AI Button - Center with proper layout */}
            <div className="flex flex-col items-center gap-1 relative">
              <div className="relative">
                <Button
                  onClick={handleAIClick}
                  disabled={isAnimating}
                  className={`
                    w-14 h-14 rounded-full ai-golden p-0 relative overflow-hidden
                    ${isAnimating ? 'ai-button-premium-sequence' : 'ai-button-idle'}
                    ${isAIOpen ? 'ai-button-active' : ''}
                    hover:scale-110 active:scale-95 transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-ai-gold-light focus:ring-offset-2
                  `}
                >
                  <Sparkles className="h-5 w-5 text-ai-background relative z-10" />
                  
                  {/* Enhanced particle effects */}
                  <div className="absolute inset-0 quantum-particles opacity-60" />
                  <div className="absolute inset-0 quantum-orbit-1" />
                  <div className="absolute inset-0 quantum-orbit-2" />
                  
                  {/* Premium Animation Effects */}
                  {showRipples && (
                    <>
                      <div className="ai-ripple-effect" />
                      <div className="ai-glow-ring" />
                    </>
                  )}
                  
                  {/* Active State Effects */}
                  {isAIOpen && (
                    <>
                      <div className="absolute -inset-2 quantum-active-glow animate-pulse" />
                      <div className="absolute -inset-1 quantum-ascending-rings" />
                    </>
                  )}
                </Button>
              </div>
              
              {/* AI Label - properly positioned */}
              <span className="text-[9px] font-medium text-foreground-secondary hidden min-[360px]:block">
                AI
              </span>
              
              {/* Tooltip for small screens */}
              <div className="min-[360px]:hidden absolute -top-8 left-1/2 transform -translate-x-1/2 bg-ai-golden text-ai-background px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                AI
              </div>
            </div>

            {/* Food Tab */}
            <Button
              variant="ghost"
              onClick={() => navigate('/food')}
              className={`
                flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200 h-12 min-w-[60px]
                ${isActive('/food') 
                  ? 'bg-primary/20 text-primary' 
                  : 'text-foreground-secondary hover:text-foreground'
                }
              `}
            >
              <Utensils className="h-4 w-4" />
              <span className="text-[9px] font-medium hidden min-[360px]:block">Food</span>
            </Button>

            {/* Meals Tab */}
            <Button
              variant="ghost"
              onClick={() => navigate('/meals')}
              className={`
                flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200 h-12 min-w-[60px]
                ${isActive('/meals')
                  ? 'bg-primary/20 text-primary' 
                  : 'text-foreground-secondary hover:text-foreground'
                }
              `}
            >
              <UtensilsCrossed className="h-4 w-4" />
              <span className="text-[9px] font-medium hidden min-[360px]:block">Meals</span>
            </Button>
          </nav>
        </div>
      </div>

      {/* AI Chatbot */}
      <AIChatbot 
        isOpen={isAIOpen} 
        onClose={() => setIsAIOpen(false)} 
      />
    </>
  )
}