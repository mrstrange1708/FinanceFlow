'use client';

import { Home, CreditCard, TrendingUp, PieChart, Target, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'accounts', label: 'Accounts', icon: CreditCard },
    { id: 'transactions', label: 'Transactions', icon: TrendingUp },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'budgets', label: 'Budgets', icon: PieChart },
    { id: 'categories', label: 'Categories', icon: Settings },
  ];

  return (
    <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Finance<span className="text-amber-600">Flow</span>
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navigation.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? 'default' : 'ghost'}
            className={cn(
              'w-full justify-start gap-3 h-12',
              activeTab === item.id
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            )}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Button>
        ))}
      </nav>
    </div>
  );
}