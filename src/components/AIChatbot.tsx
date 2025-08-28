import { useState, useRef, useEffect } from "react"
import { X, Send, MessageCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface AIChatbotProps {
  isOpen: boolean
  onClose: () => void
}

export function AIChatbot({ isOpen, onClose }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI health assistant. I can help you track your wellness journey, analyze your eating patterns, and provide personalized insights. What would you like to know?",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputValue),
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    if (input.includes("eating") || input.includes("food") || input.includes("meal")) {
      return "Based on your wearable data, I've detected several eating events today. Your meal timing suggests a healthy eating pattern. Would you like me to analyze your nutritional balance or suggest optimal meal timing?"
    }
    
    if (input.includes("heart") || input.includes("cardio") || input.includes("exercise")) {
      return "Your heart rate data shows great cardiovascular health! Your resting heart rate of 68 bpm is excellent. I notice your heart rate variability improved by 12% this week. Keep up the great work!"
    }
    
    if (input.includes("sleep") || input.includes("rest") || input.includes("tired")) {
      return "Your sleep quality has improved significantly! With 7.4 hours of sleep and 92% efficiency, you're in the optimal range. Your deep sleep phases are well-distributed. Try maintaining this consistent bedtime routine."
    }
    
    if (input.includes("goal") || input.includes("target") || input.includes("progress")) {
      return "You're making excellent progress! You've completed 82% of your daily step goal and burned 1,240 calories. Based on your patterns, you typically reach your goals by 6 PM. Keep moving!"
    }
    
    return "That's an interesting question! Based on your health data, I can provide personalized insights about your activity, nutrition, sleep, and overall wellness. Feel free to ask about any specific health metrics or goals you'd like to explore."
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-2 py-4 backdrop-blur-lg bg-black/30">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-lg"
        onClick={onClose}
      />
      
      {/* Nearly Full-Screen Chatbot Container */}
      <div className={`
        relative w-full max-w-[calc(100vw-32px)] h-[calc(100vh-32px)] rounded-3xl overflow-hidden
        ${isOpen ? 'ai-popup-enter' : 'ai-popup-exit'}
      `}>
        {/* Enhanced Golden Border Frame - Thicker for emphasis */}
        <div className="absolute inset-0 ai-golden rounded-3xl p-[4px] ai-golden-shimmer">
          <div className="w-full h-full bg-ai-background/95 backdrop-blur-xl rounded-3xl border border-ai-gold-light/30">
            {/* Enhanced Golden Header with Holographic Effects */}
            <div className="bg-gradient-to-r from-ai-gold via-ai-gold-light to-ai-gold text-ai-background p-6 flex items-center justify-between border-b-4 border-ai-border relative overflow-hidden">
              {/* Holographic background effects */}
              <div className="absolute inset-0 bg-gradient-to-45 from-transparent via-ai-gold-light/20 to-transparent animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-ai-gold/10 via-transparent to-ai-gold-glow/10 animate-shimmer"></div>
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-ai-background flex items-center justify-center border-2 border-ai-gold shadow-lg ai-hologram">
                  <Sparkles className="h-6 w-6 text-ai-gold animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">AI Health Assistant</h3>
                  <p className="text-sm opacity-90">Powered by advanced nutrition AI</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="glass-card-hover w-8 h-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 h-[calc(100%-140px)]">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`
                        max-w-[80%] p-3 rounded-2xl text-sm
                        ${message.isUser 
                          ? 'bg-primary text-primary-foreground ml-8' 
                          : 'ai-golden ai-golden-shimmer mr-8 text-ai-background font-medium'
                        }
                      `}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="ai-golden ai-golden-shimmer p-3 rounded-2xl mr-8">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-ai-background rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-ai-background rounded-full animate-pulse [animation-delay:0.2s]" />
                        <div className="w-2 h-2 bg-ai-background rounded-full animate-pulse [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-ai-border/30">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about your health data..."
                  className="flex-1 glass-card border-ai-border/50 focus:border-ai-gold"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="ai-golden w-12 h-12 rounded-xl p-0"
                >
                  <Send className="h-4 w-4 text-ai-background" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}