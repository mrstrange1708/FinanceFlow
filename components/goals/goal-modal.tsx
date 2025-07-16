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
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'completed' | 'paused'>('active');
  const [loading, setLoading] = useState(false);

  const { categories, addGoal, updateGoal, fetchGoals } = useFinanceStore();
  const { user } = useAuthStore();

  const availableCategories = categories.filter(category => 
    category.is_default || category.user_id === user?.id
  );

  useEffect(() => {
    if (goal) {
      setName(goal.name);
      setTargetAmount(goal.target_amount.toString());
      setTargetDate(goal.target_date);
      setDescription(goal.description || '');
      setStatus(goal.status);
    } else {
      setName('');
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

      // Refresh goals after add/update
      await fetchGoals();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(goal ? 'Failed to update goal' : 'Failed to add goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md mx-auto p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{goal ? 'Edit Goal' : 'Add Goal'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm sm:text-base">Goal Name</Label>
            <Input
              id="name"
              placeholder="Car Purchase, Emergency Fund, etc."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-10 sm:h-11 text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAmount" className="text-sm sm:text-base">Target Amount (₹)</Label>
            <Input
              id="targetAmount"
              type="number"
              step="0.01"
              placeholder="100000.00"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
              className="h-10 sm:h-11 text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetDate" className="text-sm sm:text-base">Target Date</Label>
            <Input
              id="targetDate"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              required
              className="h-10 sm:h-11 text-sm sm:text-base"
            />
          </div>

          {goal && (
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm sm:text-base">Status</Label>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active" className="text-sm sm:text-base">Active</SelectItem>
                  <SelectItem value="paused" className="text-sm sm:text-base">Paused</SelectItem>
                  <SelectItem value="completed" className="text-sm sm:text-base">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm sm:text-base">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe your goal..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="text-sm sm:text-base resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button 
              type="submit" 
              disabled={loading} 
              className="flex-1 h-10 sm:h-11 text-sm sm:text-base"
            >
              {loading ? (goal ? 'Updating...' : 'Adding...') : (goal ? 'Update Goal' : 'Add Goal')}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="h-10 sm:h-11 text-sm sm:text-base"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}