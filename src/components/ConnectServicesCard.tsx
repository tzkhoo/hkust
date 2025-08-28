import { useState } from "react"
import { Link, Smartphone, Heart, TrendingUp, Zap, Watch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import heroImage from "@/assets/hero-wearables.jpg"

const healthServices = [
  { name: "Apple Fitness", icon: Heart, color: "from-red-500 to-red-600", connected: false },
  { name: "Google Fit", icon: TrendingUp, color: "from-blue-500 to-blue-600", connected: false },
  { name: "Garmin Connect", icon: Watch, color: "from-blue-600 to-blue-700", connected: false },
  { name: "Fitbit", icon: Zap, color: "from-teal-500 to-teal-600", connected: false },
  { name: "Strava", icon: TrendingUp, color: "from-orange-500 to-orange-600", connected: false },
  { name: "Samsung Health", icon: Smartphone, color: "from-purple-500 to-purple-600", connected: false }
]

export function ConnectServicesCard() {
  const [services, setServices] = useState(healthServices)
  const [isOpen, setIsOpen] = useState(false)
  
  const connectedServices = services.filter(service => service.connected)
  const hasConnectedServices = connectedServices.length > 0

  const toggleConnection = (serviceName: string) => {
    setServices(prev => prev.map(service => 
      service.name === serviceName 
        ? { ...service, connected: !service.connected }
        : service
    ))
  }

  return (
    <div className={`hero-glass relative overflow-hidden animate-slide-up transition-all duration-500 ${
      hasConnectedServices ? 'p-6' : 'p-8'
    }`} style={{ borderRadius: '24px' }}>
      {/* Background Hero Image */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10">
        <img 
          src={heroImage} 
          alt="Smart wearables" 
          className="w-full h-full object-cover rounded-3xl"
        />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-3xl" />
      
      <div className="relative z-10">
        {!hasConnectedServices ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Connect Your Smart Watch</h2>
              <p className="text-foreground-secondary text-lg max-w-2xl mx-auto">
                Sync your fitness data from popular health platforms to get comprehensive insights into your wellness journey
              </p>
            </div>

            <div className="mb-8 overflow-hidden">
              {/* Desktop: Original sliding animation */}
              <div className="hidden md:flex gap-4 animate-conveyor">
                {/* First set of services */}
                {services.map((service) => {
                  const IconComponent = service.icon
                  return (
                    <div
                      key={`first-${service.name}`}
                      className="glass-card rounded-xl p-4 flex items-center gap-3 min-w-fit flex-shrink-0"
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-sm">{service.name}</span>
                    </div>
                  )
                })}
                {/* Duplicate set for seamless loop */}
                {services.map((service) => {
                  const IconComponent = service.icon
                  return (
                    <div
                      key={`second-${service.name}`}
                      className="glass-card rounded-xl p-4 flex items-center gap-3 min-w-fit flex-shrink-0"
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-sm">{service.name}</span>
                    </div>
                  )
                })}
              </div>

              {/* Mobile: Sequential sliding animation */}
              <div className="md:hidden flex gap-4 overflow-x-auto pb-2">
                {services.slice(0, 3).map((service, index) => {
                  const IconComponent = service.icon
                  return (
                    <div
                      key={service.name}
                      className="glass-card rounded-xl p-4 flex items-center gap-3 min-w-fit flex-shrink-0 animate-mobile-slide-in"
                      style={{ 
                        animationDelay: `${index * 300}ms`,
                        animationFillMode: 'both'
                      }}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-sm">{service.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="text-center">
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    className="btn-primary px-8 py-4 text-lg font-semibold rounded-2xl hover:scale-105 transition-all duration-200"
                  >
                    <Link className="mr-2 h-5 w-5" />
                    Connect Services
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-0 max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center mb-4">
                      Choose Health Services
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    {services.map((service) => {
                      const IconComponent = service.icon
                      return (
                        <button
                          key={service.name}
                          onClick={() => toggleConnection(service.name)}
                          className="w-full glass-card-hover rounded-xl p-4 flex items-center gap-4 transition-all duration-200"
                        >
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div className="text-left flex-1">
                            <div className="font-semibold">{service.name}</div>
                            <div className="text-sm text-foreground-secondary">
                              {service.connected ? "Connected" : "Tap to connect"}
                            </div>
                          </div>
                          {service.connected && (
                            <div className="w-3 h-3 rounded-full bg-success" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                  <Button 
                    onClick={() => setIsOpen(false)} 
                    className="w-full mt-6 btn-primary"
                  >
                    Done
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">Smart Watch Connected</h2>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {connectedServices.slice(0, 2).map((service) => {
                const IconComponent = service.icon
                return (
                  <div
                    key={service.name}
                    className="glass-card rounded-lg p-2 flex items-center gap-2"
                  >
                    <div className={`w-5 h-5 rounded bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                      <IconComponent className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-medium text-xs">{service.name}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-success" />
                  </div>
                )
              })}
              {connectedServices.length > 2 && (
                <div className="glass-card rounded-lg p-2 flex items-center gap-1">
                  <span className="font-medium text-xs">+{connectedServices.length - 2} more</span>
                </div>
              )}
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="glass-card-hover border-0 text-sm px-4 py-2">
                  Manage Connections
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-0 max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-center mb-4">
                    Manage Health Services
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  {services.map((service) => {
                    const IconComponent = service.icon
                    return (
                      <button
                        key={service.name}
                        onClick={() => toggleConnection(service.name)}
                        className="w-full glass-card-hover rounded-xl p-4 flex items-center gap-4 transition-all duration-200"
                      >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-semibold">{service.name}</div>
                          <div className="text-sm text-foreground-secondary">
                            {service.connected ? "Connected" : "Tap to connect"}
                          </div>
                        </div>
                        {service.connected && (
                          <div className="w-3 h-3 rounded-full bg-success" />
                        )}
                      </button>
                    )
                  })}
                </div>
                <Button 
                  onClick={() => setIsOpen(false)} 
                  className="w-full mt-6 btn-primary"
                >
                  Done
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  )
}