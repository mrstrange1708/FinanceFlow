'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';
import { TrendingUp, DollarSign, PieChart, BarChart3 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

export function AuthScreen() {
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle } = useAuthStore();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    
    try {
      await signInWithGoogle();
      toast.success('Welcome to FinanceFlow!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen gap-12">
          {/* Hero Section */}
          <div className="flex-1 max-w-lg text-center lg:text-left">
            <div className="mb-8">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                Finance<span className="text-amber-600">Flow</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Take control of your finances with smart expense tracking, budgeting, and financial insights.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">Track Income</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Monitor earnings</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <DollarSign className="w-6 h-6 text-red-600" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">Manage Expenses</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Control spending</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <PieChart className="w-6 h-6 text-blue-600" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">Visual Analytics</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Beautiful charts</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">Budget Planning</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Set financial goals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Auth Form */}
          <div className="flex-1 max-w-md w-full">
            <Card className="shadow-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Welcome to FinanceFlow</CardTitle>
                <CardDescription className="text-center">
                  Sign in with your Google account to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full h-12 text-lg bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm"
                  variant="outline"
                >
                  <FcGoogle className="w-6 h-6 mr-3" />
                  {loading ? 'Signing in...' : 'Continue with Google'}
                </Button>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}