'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useFinanceStore } from '@/store/finance-store';
import { LoadingScreen } from '@/components/ui/loading-screen';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initialize, loading, user } = useAuthStore();
  const { refreshAllData } = useFinanceStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (user) {
      // Fetch all data when user is authenticated
      refreshAllData();
    }
  }, [user, refreshAllData]);

  if (loading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}