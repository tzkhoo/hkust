import { Activity, User, LogIn, Settings as SettingsIcon } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"

export function Header() {
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full glass-card border-0 border-b border-glass-border/20">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">HealthGlass</h1>
            <p className="text-xs text-foreground-secondary">Smart Health Tracker</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="glass-card-hover w-9 h-9 rounded-xl">
                <Avatar className="w-6 h-6">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xs">
                    <User className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-48 glass-card border border-glass-border/50 bg-glass-background/95 backdrop-blur-xl z-50"
              sideOffset={8}
            >
              <DropdownMenuItem className="flex items-center gap-2 hover:bg-muted/50">
                <User className="h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 hover:bg-muted/50">
                <LogIn className="h-4 w-4" />
                Login
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-glass-border/30" />
              <DropdownMenuItem 
                className="flex items-center gap-2 hover:bg-muted/50"
                onClick={() => navigate('/settings')}
              >
                <SettingsIcon className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}