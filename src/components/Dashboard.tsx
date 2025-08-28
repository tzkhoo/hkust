import { Activity, Heart, Moon, TrendingUp } from "lucide-react"
import { MetricCard } from "./MetricCard"
import { ConnectServicesCard } from "./ConnectServicesCard"
import { AnimatedProgressRing } from "./AnimatedProgressRing"
import { EatingEventsCard } from "./EatingEventsCard"
import { useCountUpAnimation } from "@/hooks/useCountUpAnimation"

// Mock data for demonstration
const mockMetrics = {
  steps: { value: 8247, goal: 10000, change: 12 },
  heartRate: { current: 68, resting: 62, max: 145, change: -3 },
  sleep: { duration: 7.4, efficiency: 92, change: 8 },
  calories: { burned: 1240, goal: 1500, change: 15 }
}

function MiniChart({ data }: { data: number[] }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((value, index) => {
        const height = ((value - min) / (max - min)) * 100
        return (
          <div
            key={index}
            className="bg-gradient-to-t from-primary/60 to-primary/20 rounded-sm flex-1 min-w-[2px] transition-all duration-200 hover:from-primary hover:to-primary/40 hover:soft-glow"
            style={{ height: `${Math.max(height, 10)}%` }}
          />
        )
      })}
    </div>
  )
}

function ProgressRing({ value, max, size = 80 }: { value: number; max: number; size?: number }) {
  const percentage = (value / max) * 100
  const circumference = 2 * Math.PI * (size / 2 - 8)
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative soft-glow" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 8}
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          className="text-muted/40"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 8}
          stroke="url(#healthGradient)"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 drop-shadow-lg"
          style={{
            filter: 'drop-shadow(0 0 8px hsla(var(--primary), 0.4))'
          }}
        />
        <defs>
          <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="50%" stopColor="hsl(var(--primary-glow))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-bold font-mono">{value.toLocaleString()}</div>
          <div className="text-xs text-foreground-secondary">of {max.toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}

function AnimatedCaloriesDisplay() {
  const { current: animatedCalories } = useCountUpAnimation({
    end: mockMetrics.calories.burned,
    duration: 1200,
    startOnMount: true
  })

  return (
    <div className="flex items-center justify-between">
      <AnimatedProgressRing 
        value={mockMetrics.steps.value} 
        max={mockMetrics.steps.goal} 
        duration={1200}
        delay={200}
      />
      <div className="text-right">
        <div className="text-2xl font-bold font-mono text-metric-positive">
          {animatedCalories.toLocaleString()}
        </div>
        <div className="text-sm text-foreground-secondary">calories burned</div>
        <div className="text-xs text-metric-positive mt-1">
          +{mockMetrics.calories.change}% vs yesterday
        </div>
      </div>
    </div>
  )
}

export function Dashboard() {
  return (
    <div className="space-y-8 pb-8">
      {/* Hero Section */}
      <ConnectServicesCard />
      
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Activity Card */}
        <MetricCard
          title="Daily Activity"
          value={mockMetrics.steps.value}
          unit="steps"
          change={mockMetrics.steps.change}
          trend="up"
          icon={Activity}
          className="md:col-span-2 lg:col-span-1"
          animated={true}
        >
          <AnimatedCaloriesDisplay />
        </MetricCard>

        {/* Heart Rate Card */}
        <MetricCard
          title="Heart Rate"
          value={mockMetrics.heartRate.current}
          unit="bpm"
          change={mockMetrics.heartRate.change}
          trend="down"
          icon={Heart}
          animated={true}
        >
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-foreground-secondary">Resting</span>
              <span className="font-mono">{mockMetrics.heartRate.resting} bpm</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground-secondary">Max Today</span>
              <span className="font-mono">{mockMetrics.heartRate.max} bpm</span>
            </div>
            <MiniChart data={[65, 68, 72, 70, 69, 68, 66]} />
          </div>
        </MetricCard>

        {/* Sleep Card */}
        <MetricCard
          title="Sleep Quality"
          value={mockMetrics.sleep.duration}
          unit="hours"
          change={mockMetrics.sleep.change}
          trend="up"
          icon={Moon}
          animated={true}
        >
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-foreground-secondary">Efficiency</span>
              <span className="font-mono text-metric-positive">{mockMetrics.sleep.efficiency}%</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {['Deep', 'Light', 'REM', 'Awake'].map((stage, index) => (
                <div key={stage} className="text-center">
                  <div className={`h-2 rounded-full mb-1 ${
                    index === 0 ? 'bg-primary' : 
                    index === 1 ? 'bg-secondary' : 
                    index === 2 ? 'bg-accent' : 'bg-muted'
                  }`} />
                  <div className="text-xs text-foreground-secondary">{stage}</div>
                </div>
              ))}
            </div>
          </div>
        </MetricCard>
      </div>

      {/* Weekly Progress Section - Premium Design */}
      <div className="weekly-progress-container relative">
        {/* Background Glow Effects */}
        <div className="absolute inset-0 weekly-progress-glow opacity-30"></div>
        
        <div className="premium-glass-card p-8 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold weekly-progress-title">Weekly Progress</h2>
              <p className="text-sm weekly-progress-subtitle mt-1">Your fitness journey this week</p>
            </div>
            <div className="premium-icon-wrapper">
              <TrendingUp className="h-7 w-7 weekly-progress-icon" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Steps Progress Card */}
            <div className="progress-metric-card group">
              <div className="flex items-center justify-between mb-4">
                <h3 className="progress-metric-title">Daily Steps</h3>
                <Activity className="h-5 w-5 text-cyan-400" />
              </div>
              <div className="mb-4">
                <div className="text-3xl font-bold font-mono progress-metric-value">8,627</div>
                <div className="text-sm progress-metric-subtitle">avg steps/day</div>
                <div className="text-sm progress-metric-change">+12% from last week</div>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar steps-gradient">
                  <div className="progress-shine"></div>
                </div>
              </div>
              <div className="mt-4">
                <MiniChart data={[8200, 9100, 7800, 8900, 9500, 8247, 8600]} />
              </div>
            </div>

            {/* Heart Rate Progress Card */}
            <div className="progress-metric-card group">
              <div className="flex items-center justify-between mb-4">
                <h3 className="progress-metric-title">Heart Rate</h3>
                <Heart className="h-5 w-5 text-pink-400" />
              </div>
              <div className="mb-4">
                <div className="text-3xl font-bold font-mono progress-metric-value">68</div>
                <div className="text-sm progress-metric-subtitle">avg bpm</div>
                <div className="text-sm progress-metric-change">-3% healthier</div>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar heart-gradient">
                  <div className="progress-shine"></div>
                </div>
              </div>
              <div className="mt-4">
                <MiniChart data={[68, 70, 69, 67, 71, 68, 66]} />
              </div>
            </div>

            {/* Sleep Progress Card */}
            <div className="progress-metric-card group">
              <div className="flex items-center justify-between mb-4">
                <h3 className="progress-metric-title">Sleep Quality</h3>
                <Moon className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="mb-4">
                <div className="text-3xl font-bold font-mono progress-metric-value">7.4</div>
                <div className="text-sm progress-metric-subtitle">avg hours/night</div>
                <div className="text-sm progress-metric-change">+8% improvement</div>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar sleep-gradient">
                  <div className="progress-shine"></div>
                </div>
              </div>
              <div className="mt-4">
                <MiniChart data={[7.2, 8.1, 6.9, 7.8, 7.5, 7.4, 8.2]} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Eating Events Card */}
      <EatingEventsCard />
    </div>
  )
}