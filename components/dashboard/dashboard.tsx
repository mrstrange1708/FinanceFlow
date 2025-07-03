'use client';

import { useState } from 'react';
import { BottomNavigation } from '@/components/navigation/bottom-navigation';
import { Sidebar } from '@/components/navigation/sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { FinancialSummary } from '@/components/dashboard/financial-summary';
import { ExpenseChart } from '@/components/charts/expense-chart';
import { IncomeChart } from '@/components/charts/income-chart';
import { BudgetChart } from '@/components/charts/budget-chart';
import { GoalsChart } from '@/components/charts/goals-chart';
import { RecentTransactions } from '@/components/transactions/recent-transactions';
import { AccountsOverview } from '@/components/accounts/accounts-overview';
import { BudgetsOverview } from '@/components/budgets/budgets-overview';
import { GoalsOverview } from '@/components/goals/goals-overview';
import { CategoriesOverview } from '@/components/categories/categories-overview';
import { TransactionModal } from '@/components/transactions/transaction-modal';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <FinancialSummary />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExpenseChart />
              <IncomeChart />
            </div>
            <GoalsChart />
            <BudgetChart />
            <RecentTransactions />
          </div>
        );
      case 'transactions':
        return <RecentTransactions showAll />;
      case 'accounts':
        return <AccountsOverview />;
      case 'goals':
        return <GoalsOverview />;
      case 'budgets':
        return <BudgetsOverview />;
      case 'categories':
        return <CategoriesOverview />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-50 w-64">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <DashboardHeader />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 lg:pb-6">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Floating Action Button */}
      <Button
        onClick={() => setShowTransactionModal(true)}
        className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 w-14 h-14 rounded-full shadow-lg bg-amber-600 hover:bg-amber-700 text-white z-40"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Transaction Modal */}
      <TransactionModal
        open={showTransactionModal}
        onOpenChange={setShowTransactionModal}
      />
    </div>
  );
}