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
          <div className="space-y-6">
            {displayBudgets.map((budget) => (
              <div key={budget.id} className="space-y-2">
                <div className="flex items-center justify-between">
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
                      ${budget.spent.toLocaleString('en-US', { minimumFractionDigits: 2 })} / 
                      ${budget.limit_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className={`text-xs ${
                      budget.isOverBudget 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      {budget.isOverBudget 
                        ? `Over by $${Math.abs(budget.remaining).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                        : `Remaining: $${budget.remaining.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                      }
                    </div>
                  </div>
                </div>
                <Progress 
                  value={budget.percentage} 
                  className="h-2"
                  indicatorClassName={budget.isOverBudget ? 'bg-red-500' : 'bg-green-500'}
                />
              </div>
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