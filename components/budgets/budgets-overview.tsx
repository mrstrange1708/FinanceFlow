'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useFinanceStore } from '@/store/finance-store';
import { Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { BudgetModal } from '@/components/budgets/budget-modal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export function BudgetsOverview() {
  const { transactions, categories, budgets, deleteBudget } = useFinanceStore();
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);

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

  const handleEdit = (budget: any) => {
    setEditingBudget(budget);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBudget(id);
      toast.success('Budget deleted successfully');
    } catch (error) {
      toast.error('Failed to delete budget');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingBudget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Budgets</h2>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Budget
        </Button>
      </div>

      <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Budget Progress - {format(currentMonth, 'MMMM yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {budgetProgress.length > 0 ? (
            <div className="space-y-6">
              {budgetProgress.map((budget) => (
                <div key={budget.id} className="space-y-3 p-4 rounded-lg bg-white/50 dark:bg-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: budget.categoryColor }}
                      />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {budget.categoryName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(budget)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Budget</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this budget? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(budget.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <Progress 
                    value={budget.percentage} 
                    className="h-3"
                    indicatorClassName={budget.isOverBudget ? 'bg-red-500' : 'bg-green-500'}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No budgets set for this month. Click "Add Budget" to get started.
            </div>
          )}
        </CardContent>
      </Card>

      <BudgetModal
        open={showModal}
        onOpenChange={handleModalClose}
        budget={editingBudget}
      />
    </div>
  );
}