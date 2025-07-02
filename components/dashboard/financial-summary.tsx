'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinanceStore } from '@/store/finance-store';
import { TrendingUp, TrendingDown, Wallet, DollarSign } from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export function FinancialSummary() {
  const { accounts, transactions } = useFinanceStore();

  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const currentMonthTransactions = transactions.filter(transaction =>
    isWithinInterval(new Date(transaction.transaction_date), { start: monthStart, end: monthEnd })
  );

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const monthlyIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = monthlyIncome - monthlyExpenses;

  const summaryCards = [
    {
      title: 'Total Balance',
      value: totalBalance,
      icon: Wallet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Monthly Income',
      value: monthlyIncome,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Monthly Expenses',
      value: monthlyExpenses,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'Net Income',
      value: netIncome,
      icon: DollarSign,
      color: netIncome >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: netIncome >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryCards.map((card) => (
        <Card key={card.title} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${card.bgColor}`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {card.value < 0 ? '-₹' : '₹'}{Math.abs(card.value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {card.title === 'Total Balance' ? 'All accounts' : format(currentMonth, 'MMMM yyyy')}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}