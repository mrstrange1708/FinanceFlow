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
import type { Database } from '@/lib/supabase';
type Account = Database['public']['Tables']['accounts']['Row'];

interface AccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: any;
}

const accountTypes = [
  { value: 'card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'cash', label: 'Cash' },
  { value: 'investment', label: 'Investment' },
  { value: 'savings', label: 'Savings' },
  { value: 'piggy_bank', label: 'Piggy Bank' },
  { value: 'shop', label: 'Shop' },
  { value: 'bitcoin', label: 'Bitcoin' },
  { value: 'store', label: 'Store' },
];

const accountColors = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

export function AccountModal({ open, onOpenChange, account }: AccountModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<string>('wallet');
  const [color, setColor] = useState('#3B82F6');
  const [initialAmount, setInitialAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const { addAccount, updateAccount } = useFinanceStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (account) {
      setName(account.name);
      setType(account.type);
      setColor(account.color);
      setInitialAmount(account.balance.toString());
    } else {
      setName('');
      setType('wallet');
      setColor('#3B82F6');
      setInitialAmount('');
    }
  }, [account]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    try {
      const accountData = {
        name,
        type: type as Account['type'],
        balance: parseFloat(initialAmount || '0'),
        color,
        icon: type, // Use type as icon for simplicity
      };

      if (account) {
        await updateAccount(account.id, accountData);
        toast.success('Account updated successfully!');
      } else {
        await addAccount({
          ...accountData,
          user_id: user.id,
        });
        toast.success('Account added successfully!');
      }

      onOpenChange(false);
    } catch (error) {
      toast.error(account ? 'Failed to update account' : 'Failed to add account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md mx-auto p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{account ? 'Edit Account' : 'Add Account'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm sm:text-base">Account Name</Label>
            <Input
              id="name"
              placeholder="My Wallet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-10 sm:h-11 text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm sm:text-base">Account Type</Label>
            <Select value={type} onValueChange={(value: any) => setType(value)} required>
              <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base">
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                {accountTypes.map((accountType) => (
                  <SelectItem key={accountType.value} value={accountType.value} className="text-sm sm:text-base">
                    {accountType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color" className="text-sm sm:text-base">Color</Label>
            <div className="flex gap-2 flex-wrap">
              {accountColors.map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    color === colorOption ? 'border-gray-400' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: colorOption }}
                  onClick={() => setColor(colorOption)}
                />
              ))}
            </div>
          </div>

          {/* Show Initial Amount for new, Amount for edit */}
          {account ? (
            <div className="space-y-2">
              <Label htmlFor="editAmount" className="text-sm sm:text-base">Amount</Label>
              <Input
                id="editAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
                required
                className="h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="initialAmount" className="text-sm sm:text-base">Initial Amount</Label>
              <Input
                id="initialAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
                required
                className="h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button 
              type="submit" 
              disabled={loading} 
              className="flex-1 h-10 sm:h-11 text-sm sm:text-base"
            >
              {loading ? (account ? 'Updating...' : 'Adding...') : (account ? 'Update Account' : 'Add Account')}
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