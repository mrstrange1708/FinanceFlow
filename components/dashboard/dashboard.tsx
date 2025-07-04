'use client';

import { useState } from 'react';
import { BottomNavigation } from '@/components/navigation/bottom-navigation';
import { Sidebar } from '@/components/navigation/sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { FinancialSummary } from '@/components/dashboard/financial-summary';
import { ExpenseChart } from '@/components/charts/expense-chart';
import { IncomeChart } from '@/components/charts/income-chart';
import { BudgetChart } from '@/components/charts/budget-chart';
import { RecentTransactions } from '@/components/transactions/recent-transactions';
import { AccountsOverview } from '@/components/accounts/accounts-overview';
import { BudgetsOverview } from '@/components/budgets/budgets-overview';
import { CategoriesOverview } from '@/components/categories/categories-overview';
import { GoalsOverview } from '@/components/goals/goals-overview';
import { TransactionModal } from '@/components/transactions/transaction-modal';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GoalModal } from '@/components/goals/goal-modal';
import { useFinanceStore } from '@/store/finance-store';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const { goals = [] } = useFinanceStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <FinancialSummary />
            <div className="w-full">
              <ExpenseChart />
            </div>
            <div className="w-full">
              <IncomeChart />
            </div>
            <div className="w-full">
              <BudgetChart />
            </div>
            {/* Goals Summary Section */}
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Goals</h2>
                <Button className="bg-amber-600 hover:bg-amber-700" onClick={() => setShowGoalModal(true)}>
                  Add Goal
                </Button>
              </div>
              {/* Show up to 3 active goals as a preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.filter(goal => goal.status === 'active').slice(0, 3).map(goal => (
                  <div key={goal.id} className="bg-white/80 dark:bg-gray-800/80 border-0 shadow-md rounded-lg p-4">
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">{goal.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Target: ₹{goal.target_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min((goal.current_amount / goal.target_amount) * 100, 100)}%` }} />
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{Math.round((goal.current_amount / goal.target_amount) * 100)}% complete</div>
                  </div>
                ))}
                {goals.filter(goal => goal.status === 'active').length === 0 && (
                  <div className="text-gray-500 dark:text-gray-400 col-span-full">No active goals yet.</div>
                )}
              </div>
            </div>
            <GoalModal open={showGoalModal} onOpenChange={setShowGoalModal} />
          </div>
        );
      case 'transactions':
        return <RecentTransactions showAll />;
      case 'accounts':
        return <AccountsOverview />;
      case 'budgets':
        return <BudgetsOverview />;
      case 'goals':
        return <GoalsOverview />;
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