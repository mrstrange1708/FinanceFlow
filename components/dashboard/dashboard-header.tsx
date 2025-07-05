'use client';

import { Bell, Settings, Sun, Moon, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme/theme-provider';
import { useAuthStore } from '@/store/auth-store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface DashboardHeaderProps {
  setActiveTab: (tab: string) => void;
}

export function DashboardHeader({ setActiveTab }: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { user } = useAuthStore();



  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - App title */}
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Finance<span className="text-amber-600">Flow</span>
            </h1>
          </div>

          {/* Right side - User controls */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>

            {/* Avatar/Profile Button - direct navigation */}
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full"
              onClick={() => setActiveTab('profile')}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-amber-600 text-white">
                  {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}