import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Smartphone, 
  Camera, 
  Bell, 
  Shield, 
  Database, 
  Moon, 
  Sun,
  Volume2,
  VolumeX
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [cameraPrompts, setCameraPrompts] = useState(true);
  const [quietHours, setQuietHours] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);

  const connectedServices = [
    { name: "Apple Health", status: "connected", icon: "📱" },
    { name: "Google Fit", status: "disconnected", icon: "🏃" },
    { name: "MyFitnessPal", status: "connected", icon: "🍎" },
    { name: "Strava", status: "disconnected", icon: "🚴" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-gradient-start via-background to-background-gradient-end">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="px-4 pt-4 pb-24">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            {/* Data Connections */}
            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Data Connections</h2>
              </div>
              <div className="space-y-4">
                {connectedServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{service.icon}</span>
                      <span className="font-medium">{service.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={service.status === 'connected' ? 'default' : 'secondary'}>
                        {service.status}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant={service.status === 'connected' ? 'destructive' : 'default'}
                      >
                        {service.status === 'connected' ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Theme Settings */}
            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5 text-primary" />
                ) : (
                  <Sun className="h-5 w-5 text-primary" />
                )}
                <h2 className="text-lg font-semibold">Appearance</h2>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Theme</p>
                  <p className="text-sm text-foreground-secondary">Switch between light and dark mode</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setTheme('light')}
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                  >
                    <Sun className="h-4 w-4 mr-1" />
                    Light
                  </Button>
                  <Button
                    onClick={() => setTheme('dark')}
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                  >
                    <Moon className="h-4 w-4 mr-1" />
                    Dark
                  </Button>
                </div>
              </div>
            </Card>

            {/* Notifications & Camera */}
            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Notifications & Camera</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Meal Photo Reminders</p>
                    <p className="text-sm text-foreground-secondary">Get reminded to capture your meals</p>
                  </div>
                  <Switch 
                    checked={cameraPrompts} 
                    onCheckedChange={setCameraPrompts}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-foreground-secondary">Health insights and updates</p>
                  </div>
                  <Switch 
                    checked={notifications} 
                    onCheckedChange={setNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Quiet Hours</p>
                    <p className="text-sm text-foreground-secondary">22:00 - 07:00 (No notifications)</p>
                  </div>
                  <Switch 
                    checked={quietHours} 
                    onCheckedChange={setQuietHours}
                  />
                </div>
              </div>
            </Card>

            {/* Privacy & Security */}
            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Privacy & Security</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Anonymous Data Sharing</p>
                    <p className="text-sm text-foreground-secondary">Help improve our AI recommendations</p>
                  </div>
                  <Switch 
                    checked={dataSharing} 
                    onCheckedChange={setDataSharing}
                  />
                </div>
                
                <Button variant="outline" className="w-full">
                  View Privacy Policy
                </Button>
                
                <Button variant="outline" className="w-full">
                  Export My Data
                </Button>
                
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
              </div>
            </Card>

            {/* Device & Permissions */}
            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Smartphone className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Device Permissions</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Camera className="h-4 w-4" />
                    <span>Camera Access</span>
                  </div>
                  <Badge variant="default">Granted</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4" />
                    <span>Notifications</span>
                  </div>
                  <Badge variant="default">Granted</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Database className="h-4 w-4" />
                    <span>Health Data</span>
                  </div>
                  <Badge variant="secondary">Partial</Badge>
                </div>
              </div>
            </Card>

            {/* About */}
            <Card className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4">About</h2>
              <div className="space-y-2 text-sm text-foreground-secondary">
                <p>HealthGlass AI v2.1.0</p>
                <p>Your personalized health companion</p>
                <div className="flex gap-4 mt-4">
                  <Button variant="outline" size="sm">Terms of Service</Button>
                  <Button variant="outline" size="sm">Support</Button>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Settings;