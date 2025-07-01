'use client';

import { AuthScreen } from '@/components/auth/auth-screen';
import { Dashboard } from '@/components/dashboard/dashboard';
import { useAuthStore } from '@/store/auth-store';

export default function Home() {
  const { user } = useAuthStore();

  return user ? <Dashboard /> : <AuthScreen />;
}