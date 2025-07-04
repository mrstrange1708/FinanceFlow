'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useFinanceStore } from '@/store/finance-store';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

interface BudgetChartProps {
  showAll?: boolean;
}

export function BudgetChart({ showAll = false }: BudgetChartProps) {
  const { transactions, categories, budgets } = useFinanceStore();

  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthKey = format(monthStart, 'yyyy-MM-01');

  const currentMonthBudgets = budgets.filter(budget => budget.month === monthKey);

  const budgetProgress = currentMonthBudgets.map(budget => {
    const category = categories.find(c => c.id === budget.category_id);
    const spent = transactions
      .filter(t => 
        t.category_id === budget.category_id &&
        t.type === 'expense' &&
        isWithinInterval(new Date(t.transaction_date), { start: monthStart, end: monthEnd })
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const percentage = (spent / budget.limit_amount) * 100;
    const remaining = budget.limit_amount - spent;

    return {
      ...budget,
      categoryName: category?.name || 'Unknown',
      categoryColor: category?.color || '#6B7280',
      spent,
      percentage: Math.min(percentage, 100),
      remaining,
      isOverBudget: spent > budget.limit_amount,
    };
  });

  const displayBudgets = showAll ? budgetProgress : budgetProgress.slice(0, 5);

  return (
    <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          Budget Progress
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {format(currentMonth, 'MMMM yyyy')}
        </p>
      </CardHeader>
      <CardContent>
        {displayBudgets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayBudgets.map((budget) => (
              <Card key={budget.id} className="bg-white/80 dark:bg-gray-800/80 border-0 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: budget.categoryColor }}
                    />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {budget.categoryName}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      ₹{budget.spent.toLocaleString('en-IN', { minimumFractionDigits: 2 })} / 
                      ₹{budget.limit_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div className={`text-xs ${
                      budget.isOverBudget 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      {budget.isOverBudget 
                        ? `Over by ₹${Math.abs(budget.remaining).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                        : `Remaining: ₹${budget.remaining.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                      }
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                <Progress 
                  value={budget.percentage} 
                  className="h-2"
                  indicatorClassName={budget.isOverBudget ? 'bg-red-500' : 'bg-green-500'}
                />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No budgets set for this month
          </div>
        )}
      </CardContent>
    </Card>
  );
}