import { useState } from "react"
import { Home, Heart, Utensils, Sparkles, UtensilsCrossed, Settings } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { AIChatbot } from "./AIChatbot"

export function BottomNavigation() {
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleAIClick = async () => {
    if (isAIOpen) {
      setIsAIOpen(false)
      return
    }

    setIsAnimating(true)
    
    // Wait for animation to complete
    setTimeout(() => {
      setIsAnimating(false)
      setIsAIOpen(true)
    }, 1500)
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-4 left-4 right-4 z-50">
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
              <span className="text-[9px] font-medium">Home</span>
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
              <span className="text-[9px] font-medium">Health</span>
            </Button>


            {/* AI Button - Center */}
            <div className="relative">
              <Button
                onClick={handleAIClick}
                disabled={isAnimating}
                className={`
                  w-14 h-14 rounded-full ai-golden p-0 relative overflow-hidden quantum-bloom-idle
                  ${isAnimating ? 'quantum-bloom-activating' : ''}
                  ${isAIOpen ? 'quantum-bloom-active' : ''}
                  hover:scale-110 active:scale-95 transition-all duration-200
                `}
              >
                <Sparkles className="h-5 w-5 text-ai-background relative z-10" />
                
                {/* Quantum Bloom Effects */}
                <div className="absolute inset-0 quantum-particles opacity-60" />
                <div className="absolute inset-0 quantum-orbit-1" />
                <div className="absolute inset-0 quantum-orbit-2" />
                
                {/* Activation Effects */}
                {isAnimating && (
                  <>
                    <div className="absolute inset-0 quantum-ripple-1" />
                    <div className="absolute inset-0 quantum-ripple-2" />
                    <div className="absolute inset-0 quantum-ripple-3" />
                    <div className="absolute -inset-4 quantum-hologram-beam" />
                  </>
                )}
                
                {/* Active State Hologram */}
                {isAIOpen && (
                  <>
                    <div className="absolute -inset-2 quantum-active-glow animate-pulse" />
                    <div className="absolute -inset-1 quantum-ascending-rings" />
                  </>
                )}
              </Button>
              
              {/* AI Label */}
              <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
                <span className="text-[9px] font-medium text-foreground-secondary">AI</span>
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
              <span className="text-[9px] font-medium">Food</span>
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
              <span className="text-[9px] font-medium">Meals</span>
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