'use client';

import { Home, CreditCard, TrendingUp, PieChart, Target, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function BottomNavigation({ activeTab, setActiveTab }: BottomNavigationProps) {
  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'accounts', label: 'Accounts', icon: CreditCard },
    { id: 'transactions', label: 'Records', icon: TrendingUp },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'budgets', label: 'Budgets', icon: PieChart },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="grid grid-cols-5 h-16">
        {navigation.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              'flex flex-col items-center justify-center gap-1 transition-colors',
              activeTab === item.id
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}