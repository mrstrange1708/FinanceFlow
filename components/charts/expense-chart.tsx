'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinanceStore } from '@/store/finance-store';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

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

  const data = Object.entries(expenseByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
    '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
    '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
    '#EC4899', '#F43F5E'
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ₹{payload[0].value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, percent, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 32;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="#333" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={14} fontWeight={500}>
        {name} {(percent * 100).toFixed(0)}%
      </text>
    );
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
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 min-h-[300px]">
          <div className="w-full sm:w-2/3 flex items-center justify-center" style={{ minHeight: '260px', height: 'min(60vw, 520px)', maxHeight: '420px' }}>
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={window.innerWidth < 640 ? '60%' : '80%'}
                    fill="#8884d8"
                    dataKey="value"
                    label={renderCustomLabel}
                    labelLine={true}
                    isAnimationActive={true}
                    animationDuration={900}
                    animationEasing="ease-out"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                No expense data for this month
              </div>
            )}
          </div>
          {data.length > 0 && (
            <div className="w-full sm:w-1/3 flex items-center justify-center sm:items-start sm:justify-start">
              <div className="flex flex-col gap-3 w-full max-w-xs">
                {data.map((entry, idx) => (
                  <div key={entry.name} className="flex items-center gap-3 p-2 rounded-md bg-white/80 dark:bg-gray-800/80 shadow border">
                    <span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="font-medium text-gray-900 dark:text-white flex-1 truncate">{entry.name}</span>
                    <span className="text-gray-700 dark:text-gray-300 text-sm font-semibold">₹{entry.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}