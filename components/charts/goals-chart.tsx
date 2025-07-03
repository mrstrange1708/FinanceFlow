'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useFinanceStore } from '@/store/finance-store';
import { Target, Calendar, TrendingUp } from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';

interface GoalsChartProps {
  showAll?: boolean;
}

export function GoalsChart({ showAll = false }: GoalsChartProps) {
  const { goals, categories } = useFinanceStore();

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const displayGoals = showAll ? activeGoals : activeGoals.slice(0, 4);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Target className="w-5 h-5" />
          Financial Goals Progress
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Track your savings and spending goals
        </p>
      </CardHeader>
      <CardContent>
        {displayGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayGoals.map((goal) => {
              const category = categories.find(c => c.id === goal.category_id);
              const progress = (goal.current_amount / goal.target_amount) * 100;
              const daysLeft = differenceInDays(parseISO(goal.target_date), new Date());
              const isOverdue = daysLeft < 0;

              return (
                <Card key={goal.id} className="bg-white/80 dark:bg-gray-800/80 border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category?.color || '#6B7280' }}
                        />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {goal.name}
                        </span>
                      </div>
                      <Badge className={getStatusColor(goal.status)}>
                        {goal.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {category?.name || 'Unknown Category'}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          ₹{goal.current_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} / 
                          ₹{goal.target_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(progress, 100)} 
                        className="h-2"
                        indicatorClassName={progress >= 100 ? 'bg-green-500' : 'bg-blue-500'}
                      />
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className={`${isOverdue ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>
                        {isOverdue 
                          ? `Overdue by ${Math.abs(daysLeft)} days`
                          : `${daysLeft} days left`
                        }
                      </span>
                    </div>

                    {progress >= 100 && (
                      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <TrendingUp className="w-4 h-4" />
                        <span>Goal achieved! 🎉</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No active goals found. Create your first financial goal to start tracking progress!
          </div>
        )}
      </CardContent>
    </Card>
  );
}