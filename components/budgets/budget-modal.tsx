'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFinanceStore } from '@/store/finance-store';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface BudgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget?: any;
}

export function BudgetModal({ open, onOpenChange, budget }: BudgetModalProps) {
  const [categoryId, setCategoryId] = useState('');
  const [limitAmount, setLimitAmount] = useState('');
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [loading, setLoading] = useState(false);

  const { categories, addBudget, updateBudget } = useFinanceStore();
  const { user } = useAuthStore();

  const expenseCategories = categories.filter(category => 
    category.type === 'expense' && (category.is_default || category.user_id === user?.id)
  );

  useEffect(() => {
    if (budget) {
      setCategoryId(budget.category_id);
      setLimitAmount(budget.limit_amount.toString());
      setMonth(budget.month.substring(0, 7)); // Convert YYYY-MM-DD to YYYY-MM
    } else {
      setCategoryId('');
      setLimitAmount('');
      setMonth(format(new Date(), 'yyyy-MM'));
    }
  }, [budget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    try {
      const budgetData = {
        user_id: user.id,
        category_id: categoryId,
        limit_amount: parseFloat(limitAmount),
        month: `${month}-01`, // Convert YYYY-MM to YYYY-MM-01
      };

      if (budget) {
        await updateBudget(budget.id, budgetData);
        toast.success('Budget updated successfully!');
      } else {
        await addBudget(budgetData);
        toast.success('Budget added successfully!');
      }

      onOpenChange(false);
    } catch (error: any) {
      if (error.message?.includes('duplicate key')) {
        toast.error('Budget already exists for this category and month');
      } else {
        toast.error(budget ? 'Failed to update budget' : 'Failed to add budget');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{budget ? 'Edit Budget' : 'Add Budget'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="limitAmount">Budget Limit</Label>
            <Input
              id="limitAmount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={limitAmount}
              onChange={(e) => setLimitAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Input
              id="month"
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (budget ? 'Updating...' : 'Adding...') : (budget ? 'Update Budget' : 'Add Budget')}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}