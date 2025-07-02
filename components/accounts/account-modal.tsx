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
  const [loading, setLoading] = useState(false);

  const { addAccount, updateAccount } = useFinanceStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (account) {
      setName(account.name);
      setType(account.type);
      setColor(account.color);
    } else {
      setName('');
      setType('wallet');
      setColor('#3B82F6');
    }
  }, [account]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    try {
      const accountData = {
        name,
        type,
        balance: 0,
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{account ? 'Edit Account' : 'Add Account'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Account Name</Label>
            <Input
              id="name"
              placeholder="My Wallet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Account Type</Label>
            <Select value={type} onValueChange={(value: any) => setType(value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                {accountTypes.map((accountType) => (
                  <SelectItem key={accountType.value} value={accountType.value}>
                    {accountType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
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

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (account ? 'Updating...' : 'Adding...') : (account ? 'Update Account' : 'Add Account')}
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