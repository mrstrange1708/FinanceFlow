'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinanceStore } from '@/store/finance-store';
import { Pie } from 'react-chartjs-2';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export function IncomeChart() {
  const { transactions, categories } = useFinanceStore();

  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const currentMonthIncome = transactions.filter(transaction =>
    transaction.type === 'income' &&
    isWithinInterval(new Date(transaction.transaction_date), { start: monthStart, end: monthEnd })
  );

  const incomeByCategory = currentMonthIncome.reduce((acc, transaction) => {
    const category = categories.find(c => c.id === transaction.category_id);
    if (category) {
      acc[category.name] = (acc[category.name] || 0) + transaction.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const data = {
    labels: Object.keys(incomeByCategory),
    datasets: [
      {
        data: Object.values(incomeByCategory),
        backgroundColor: [
          '#10B981', '#059669', '#0D9488', '#06B6D4', '#3B82F6',
          '#6366F1', '#8B5CF6', '#22C55E', '#84CC16', '#EAB308',
          '#F59E0B', '#F97316', '#EF4444', '#DC2626', '#B91C1C'
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: $${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
          },
        },
      },
    },
  };

  return (
    <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          Income Sources
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {format(currentMonth, 'MMMM yyyy')}
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {Object.keys(incomeByCategory).length > 0 ? (
            <Pie data={data} options={options} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              No income data for this month
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}