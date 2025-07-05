'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/store/auth-store';
import { useFinanceStore } from '@/store/finance-store';
import { useTheme } from '@/components/theme/theme-provider';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Settings, 
  LogOut, 
  Sun, 
  Moon, 
  Bell,
  CreditCard,
  Wallet,
  Target,
  TrendingUp,
  Database
} from 'lucide-react';
import { format } from 'date-fns';

export function ProfilePage() {
  const { user, signOut } = useAuthStore();
  const { accounts, transactions, goals, categories } = useFinanceStore();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      toast.success('Signed out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const userCreatedAt = user?.created_at ? new Date(user.created_at) : null;
  const lastSignIn = user?.last_sign_in_at ? new Date(user.last_sign_in_at) : null;

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h2>
        <Button 
          onClick={handleSignOut}
          disabled={loading}
          variant="destructive"
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          {loading ? 'Signing out...' : 'Sign Out'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Information Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar and Basic Info */}
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-amber-600 text-white text-2xl">
                    {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {user?.user_metadata?.full_name || 'User'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Active
                    </Badge>
                    {user?.email_confirmed_at && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Account Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Account Created
                  </Label>
                  <p className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {userCreatedAt ? format(userCreatedAt, 'PPP') : 'Unknown'}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Last Sign In
                  </Label>
                  <p className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {lastSignIn ? format(lastSignIn, 'PPP') : 'Unknown'}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    User ID
                  </Label>
                  <p className="text-gray-900 dark:text-white font-mono text-sm">
                    {user?.id || 'Unknown'}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Provider
                  </Label>
                  <p className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    {user?.app_metadata?.provider || 'Email'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* App Statistics */}
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                App Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg mx-auto mb-2">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{accounts.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Accounts</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg mx-auto mb-2">
                    <Wallet className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{transactions.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Transactions</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg mx-auto mb-2">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{goals.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Goals</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg mx-auto mb-2">
                    <Database className="w-6 h-6 text-orange-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Sidebar */}
        <div className="space-y-6">
          {/* Theme Settings */}
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Theme
                </Label>
                <div className="flex gap-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('light')}
                    className="flex items-center gap-2"
                  >
                    <Sun className="w-4 h-4" />
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('dark')}
                    className="flex items-center gap-2"
                  >
                    <Moon className="w-4 h-4" />
                    Dark
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Notifications
                </Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-900 dark:text-white">Email Notifications</span>
                  <Button variant="outline" size="sm">
                    <Bell className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>


        </div>
      </div>
    </div>
  );
} 