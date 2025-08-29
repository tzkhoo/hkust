import { Activity, Heart, TrendingUp, Target, Calendar, Award } from "lucide-react"
import { Header } from "@/components/Header"
import { MetricCard } from "@/components/MetricCard"
import { BottomNavigation } from "@/components/BottomNavigation"

// Mock detailed health data
const healthData = {
  weeklyStats: {
    totalSteps: 58247,
    avgHeartRate: 68,
    activeMinutes: 187,
    caloriesBurned: 8640
  },
  goals: {
    dailySteps: { current: 8247, target: 10000 },
    weeklyWorkouts: { current: 4, target: 5 },
    activeMinutes: { current: 187, target: 150 }
  },
  achievements: [
    { title: "Step Master", description: "Reached 10k steps 5 days this week", icon: Target, earned: true },
    { title: "Heart Healthy", description: "Maintained optimal heart rate zone", icon: Heart, earned: true },
    { title: "Consistency King", description: "Active 7 days in a row", icon: Calendar, earned: false }
  ]
}

function ProgressBar({ current, target, color = "primary", label }: { 
  current: number; 
  target: number; 
  color?: string;
  label?: string;
}) {
  const percentage = Math.min((current / target) * 100, 100)
  
  // Get gradient class based on color
  const getGradientClass = () => {
    switch(color) {
      case 'secondary': return 'heart-gradient'
      case 'accent': return 'sleep-gradient'
      default: return 'steps-gradient'
    }
  }
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="font-mono font-semibold">{current.toLocaleString()}</span>
        <span className="text-foreground-secondary">{target.toLocaleString()}</span>
      </div>
      
      {/* Premium Progress Bar Container */}
      <div className="progress-bar-container">
        <div 
          className={`progress-bar ${getGradientClass()}`}
          style={{ width: `${percentage}%` }}
        >
          <div className="progress-shine"></div>
        </div>
      </div>
      
      <div className="flex justify-between items-center text-xs">
        <span className="progress-metric-change">
          {percentage.toFixed(0)}% of goal
        </span>
        {label && (
          <span className="text-foreground-secondary font-medium">
            {label}
          </span>
        )}
      </div>
    </div>
  )
}

export default function Health() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background-secondary pt-16">
      <Header />
      <div className="max-w-7xl mx-auto">
        <main className="px-4 pt-4 pb-24 space-y-8">
          {/* Page Header */}
          <div className="text-center animate-slide-down">
            <h1 className="text-4xl font-bold mb-2">Health Overview</h1>
            <p className="text-foreground-secondary text-lg">Comprehensive view of your wellness journey</p>
          </div>

          {/* Weekly Summary */}
          <div className="hero-glass p-8 animate-slide-up" style={{ borderRadius: '24px' }}>
            <h2 className="text-2xl font-bold mb-6 text-center">This Week's Summary</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold font-mono text-primary">{healthData.weeklyStats.totalSteps.toLocaleString()}</div>
                <div className="text-sm text-foreground-secondary">Total Steps</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold font-mono text-metric-positive">{healthData.weeklyStats.avgHeartRate}</div>
                <div className="text-sm text-foreground-secondary">Avg Heart Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold font-mono text-secondary">{healthData.weeklyStats.activeMinutes}</div>
                <div className="text-sm text-foreground-secondary">Active Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold font-mono text-accent">{healthData.weeklyStats.caloriesBurned.toLocaleString()}</div>
                <div className="text-sm text-foreground-secondary">Calories Burned</div>
              </div>
            </div>
          </div>

          {/* Goals Progress - Premium Design */}
          <div className="weekly-progress-container relative">
            {/* Background Glow Effects */}
            <div className="absolute inset-0 weekly-progress-glow opacity-30"></div>
            
            <div className="premium-glass-card p-8 relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold weekly-progress-title">Daily Goals Progress</h2>
                  <p className="text-sm weekly-progress-subtitle mt-1">Track your health achievements</p>
                </div>
                <div className="premium-icon-wrapper">
                  <Target className="h-7 w-7 weekly-progress-icon" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Daily Steps */}
                <div className="progress-metric-card group">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="progress-metric-title">Daily Steps</h3>
                    <Activity className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div className="mb-4">
                    <div className="text-3xl font-bold font-mono progress-metric-value">
                      {healthData.goals.dailySteps.current.toLocaleString()}
                    </div>
                    <div className="text-sm progress-metric-subtitle">steps today</div>
                    <div className="text-sm progress-metric-change">+12% from yesterday</div>
                  </div>
                  <ProgressBar 
                    current={healthData.goals.dailySteps.current} 
                    target={healthData.goals.dailySteps.target}
                    label="steps"
                  />
                </div>

                {/* Weekly Workouts */}
                <div className="progress-metric-card group">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="progress-metric-title">Weekly Workouts</h3>
                    <TrendingUp className="h-5 w-5 text-pink-400" />
                  </div>
                  <div className="mb-4">
                    <div className="text-3xl font-bold font-mono progress-metric-value">
                      {healthData.goals.weeklyWorkouts.current}
                    </div>
                    <div className="text-sm progress-metric-subtitle">sessions this week</div>
                    <div className="text-sm progress-metric-change">+25% improvement</div>
                  </div>
                  <ProgressBar 
                    current={healthData.goals.weeklyWorkouts.current} 
                    target={healthData.goals.weeklyWorkouts.target}
                    color="secondary"
                    label="workouts"
                  />
                </div>

                {/* Active Minutes */}
                <div className="progress-metric-card group">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="progress-metric-title">Active Minutes</h3>
                    <Heart className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="mb-4">
                    <div className="text-3xl font-bold font-mono progress-metric-value">
                      {healthData.goals.activeMinutes.current}
                    </div>
                    <div className="text-sm progress-metric-subtitle">minutes this week</div>
                    <div className="text-sm progress-metric-change">+8% increase</div>
                  </div>
                  <ProgressBar 
                    current={healthData.goals.activeMinutes.current} 
                    target={healthData.goals.activeMinutes.target}
                    color="accent"
                    label="minutes"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {healthData.achievements.map((achievement, index) => {
                const IconComponent = achievement.icon
                return (
                  <div
                    key={index}
                    className={`
                      glass-card-hover p-6 text-center transition-all duration-200
                      ${achievement.earned ? 'ring-2 ring-success/50' : 'opacity-60'}
                    `}
                    style={{ borderRadius: '20px' }}
                  >
                    <div className={`
                      w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center
                      ${achievement.earned 
                        ? 'bg-gradient-to-br from-success/20 to-success/10' 
                        : 'bg-gradient-to-br from-muted/20 to-muted/10'
                      }
                    `}>
                      <IconComponent className={`h-8 w-8 ${achievement.earned ? 'text-success' : 'text-muted-foreground'}`} />
                    </div>
                    <h3 className="font-semibold mb-2">{achievement.title}</h3>
                    <p className="text-sm text-foreground-secondary">{achievement.description}</p>
                    {achievement.earned && (
                      <div className="mt-3">
                        <Award className="h-4 w-4 text-success mx-auto" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </main>
      </div>
      <BottomNavigation />
    </div>
  )
}