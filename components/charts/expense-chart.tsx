'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinanceStore } from '@/store/finance-store';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export function ExpenseChart() {
  const { transactions, categories } = useFinanceStore();

  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const currentMonthExpenses = transactions.filter(transaction =>
    transaction.type === 'expense' &&
    isWithinInterval(new Date(transaction.transaction_date), { start: monthStart, end: monthEnd })
  );

  const expenseByCategory = currentMonthExpenses.reduce((acc, transaction) => {
    const category = categories.find(c => c.id === transaction.category_id);
    if (category) {
      acc[category.name] = (acc[category.name] || 0) + transaction.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const data = {
    labels: Object.keys(expenseByCategory),
    datasets: [
      {
        data: Object.values(expenseByCategory),
        backgroundColor: [
          '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
          '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
          '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
          '#EC4899', '#F43F5E'
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
          Expense Categories
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {format(currentMonth, 'MMMM yyyy')}
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {Object.keys(expenseByCategory).length > 0 ? (
            <Pie data={data} options={options} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              No expense data for this month
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}