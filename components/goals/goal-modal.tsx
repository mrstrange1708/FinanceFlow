'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useFinanceStore } from '@/store/finance-store';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';

interface GoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: any;
}

export function GoalModal({ open, onOpenChange, goal }: GoalModalProps) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'completed' | 'paused'>('active');
  const [loading, setLoading] = useState(false);

  const { categories, addGoal, updateGoal } = useFinanceStore();
  const { user } = useAuthStore();

  const availableCategories = categories.filter(category => 
    category.is_default || category.user_id === user?.id
  );

  useEffect(() => {
    if (goal) {
      setName(goal.name);
      setCategoryId(goal.category_id);
      setTargetAmount(goal.target_amount.toString());
      setTargetDate(goal.target_date);
      setDescription(goal.description || '');
      setStatus(goal.status);
    } else {
      setName('');
      setCategoryId('');
      setTargetAmount('');
      setTargetDate('');
      setDescription('');
      setStatus('active');
    }
  }, [goal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    try {
      const goalData = {
        user_id: user.id,
        category_id: categoryId,
        name,
        target_amount: parseFloat(targetAmount),
        target_date: targetDate,
        description: description || null,
        status,
      };

      if (goal) {
        await updateGoal(goal.id, goalData);
        toast.success('Goal updated successfully!');
      } else {
        await addGoal(goalData);
        toast.success('Goal added successfully!');
      }

      onOpenChange(false);
    } catch (error: any) {
      toast.error(goal ? 'Failed to update goal' : 'Failed to add goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{goal ? 'Edit Goal' : 'Add Goal'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Goal Name</Label>
            <Input
              id="name"
              placeholder="Car Purchase, Emergency Fund, etc."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name} ({category.type})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target Amount (₹)</Label>
            <Input
              id="targetAmount"
              type="number"
              step="0.01"
              placeholder="100000.00"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetDate">Target Date</Label>
            <Input
              id="targetDate"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              required
            />
          </div>

          {goal && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe your goal..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (goal ? 'Updating...' : 'Adding...') : (goal ? 'Update Goal' : 'Add Goal')}
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