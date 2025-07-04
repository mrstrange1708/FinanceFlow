'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';
import { TrendingUp, DollarSign, PieChart, BarChart3, Mail, Lock } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

export function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuthStore();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signIn(email, password);
      toast.success('Welcome back!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signUp(email, password, fullName);
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  // Updated Google Sign-In with redirectTo option
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);

    try {
      // Import supabase dynamically if not already imported elsewhere
      const { supabase } = await import('@/lib/supabase');
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://financeflow.oildelta.com',
        },
      });
      toast.success('Redirecting to Google...');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Google');
    } finally {
      setGoogleLoading(false);
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
                  Choose your preferred way to sign in
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Google Sign In */}
                <Button 
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading || loading}
                  className="w-full h-12 text-lg bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm"
                  variant="outline"
                >
                  <FcGoogle className="w-6 h-6 mr-3" />
                  {googleLoading ? 'Signing in...' : 'Continue with Google'}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">
                      Or continue with email
                    </span>
                  </div>
                </div>

                {/* Email/Password Authentication */}
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Sign Up
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signin" className="space-y-4 mt-6">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email">Email</Label>
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading || googleLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signin-password">Password</Label>
                        <Input
                          id="signin-password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading || googleLoading}
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-amber-600 hover:bg-amber-700" 
                        disabled={loading || googleLoading}
                      >
                        {loading ? 'Signing in...' : 'Sign In'}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup" className="space-y-4 mt-6">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">Full Name</Label>
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="John Doe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          disabled={loading || googleLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading || googleLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading || googleLoading}
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-amber-600 hover:bg-amber-700" 
                        disabled={loading || googleLoading}
                      >
                        {loading ? 'Creating account...' : 'Create Account'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="text-center">
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