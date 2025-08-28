import { useState } from "react"
import { Camera, Clock, TrendingUp, Apple, Coffee, Zap } from "lucide-react"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { BottomNavigation } from "@/components/BottomNavigation"
import { CameraModal } from "@/components/CameraModal"

// Mock food data
const foodData = {
  todayMeals: [
    {
      id: 1,
      time: "8:30 AM",
      type: "Breakfast",
      foods: ["Oatmeal", "Banana", "Almonds"],
      calories: 340,
      confidence: 92,
      image: null
    },
    {
      id: 2, 
      time: "12:45 PM",
      type: "Lunch",
      foods: ["Grilled Chicken", "Quinoa", "Broccoli"],
      calories: 520,
      confidence: 89,
      image: null
    }
  ],
  weeklyNutrition: {
    avgCalories: 1847,
    avgProtein: 98,
    avgCarbs: 187,
    avgFat: 68
  },
  detectionStats: {
    accuracy: 91,
    totalDetections: 47,
    photosCaptured: 42
  }
}

function MacroRing({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const percentage = (value / max) * 100
  const circumference = 2 * Math.PI * 42
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
        <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 96 96">
          <circle
            cx="48"
            cy="48"
            r="42"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-muted"
          />
          <circle
            cx="48"
            cy="48"
            r="42"
            stroke={color}
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm sm:text-base md:text-lg font-bold font-mono">{value}g</div>
          </div>
        </div>
      </div>
      <div className="text-xs sm:text-sm font-medium mt-1 sm:mt-2">{label}</div>
      <div className="text-xs text-foreground-secondary">{percentage.toFixed(0)}%</div>
    </div>
  )
}

export default function Food() {
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([])

  const handleCapturePhoto = (photo: string) => {
    setCapturedPhotos(prev => [photo, ...prev])
    console.log('Photo captured:', photo)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background-secondary pt-16">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="px-4 pt-4 pb-24 space-y-8">
          {/* Page Header */}
          <div className="text-center animate-slide-down">
            <h1 className="text-4xl font-bold mb-2">Food Tracking</h1>
            <p className="text-foreground-secondary text-lg">AI-powered nutrition monitoring</p>
          </div>

          {/* Quick Add Photo */}
          <div className="hero-glass rounded-3xl p-8 text-center animate-slide-up">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6">
              <Camera className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Capture Your Meal</h2>
            <p className="text-foreground-secondary mb-6 max-w-md mx-auto">
              Take a photo of your food and let AI analyze the nutrition content automatically
            </p>
            <Button 
              className="btn-primary px-8 py-3 text-lg"
              onClick={() => setIsCameraOpen(true)}
            >
              <Camera className="h-5 w-5 mr-2" />
              Add Food Photo
            </Button>
          </div>

          {/* Today's Meals */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Today's Meals</h2>
              <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                <Zap className="h-4 w-4" />
                <span>{foodData.detectionStats.accuracy}% accuracy</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {foodData.todayMeals.map((meal) => (
                <div key={meal.id} className="glass-card-hover rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{meal.type}</h3>
                        <p className="text-sm text-foreground-secondary">{meal.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold font-mono text-primary">{meal.calories}</div>
                      <div className="text-xs text-foreground-secondary">calories</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">Detected Foods:</h4>
                      <div className="flex flex-wrap gap-2">
                        {meal.foods.map((food, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                          >
                            {food}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground-secondary">AI Confidence</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full">
                          <div 
                            className="h-2 bg-gradient-to-r from-success to-success/70 rounded-full transition-all duration-500"
                            style={{ width: `${meal.confidence}%` }}
                          />
                        </div>
                        <span className="font-mono text-success">{meal.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {foodData.todayMeals.length === 0 && (
                <div className="text-center py-12 text-foreground-secondary">
                  <Apple className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No meals logged today</p>
                  <p className="text-sm">Start by taking a photo of your food</p>
                </div>
              )}
            </div>
          </div>

          {/* Weekly Nutrition Summary */}
          <div className="glass-card rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Weekly Nutrition</h2>
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Daily Averages</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">Calories</span>
                    <span className="font-mono font-bold">{foodData.weeklyNutrition.avgCalories}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">Protein</span>
                    <span className="font-mono font-bold">{foodData.weeklyNutrition.avgProtein}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">Carbs</span>
                    <span className="font-mono font-bold">{foodData.weeklyNutrition.avgCarbs}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">Fat</span>
                    <span className="font-mono font-bold">{foodData.weeklyNutrition.avgFat}g</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Macro Distribution</h3>
                <div className="flex justify-center gap-3 sm:gap-4 md:gap-6">
                  <MacroRing label="Protein" value={98} max={120} color="#10b981" />
                  <MacroRing label="Carbs" value={187} max={250} color="#3b82f6" />
                  <MacroRing label="Fat" value={68} max={80} color="#f59e0b" />
                </div>
              </div>
            </div>
          </div>

          {/* Detection Statistics */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">AI Detection Stats</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold font-mono text-primary">{foodData.detectionStats.accuracy}%</div>
                <div className="text-sm text-foreground-secondary">Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-secondary">{foodData.detectionStats.totalDetections}</div>
                <div className="text-sm text-foreground-secondary">Detections</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-accent">{foodData.detectionStats.photosCaptured}</div>
                <div className="text-sm text-foreground-secondary">Photos</div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <BottomNavigation />
      
      {/* Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCapturePhoto}
      />
    </div>
  )
}