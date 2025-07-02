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
import { Calculator } from '@/components/ui/calculator';

interface TransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: any;
}

export function TransactionModal({ open, onOpenChange, transaction }: TransactionModalProps) {
  const [type, setType] = useState<'income' | 'expense' | 'transfer'>('expense');
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [showCalculator, setShowCalculator] = useState(false);
  const [loading, setLoading] = useState(false);

  const { accounts, categories, addTransaction, updateTransaction } = useFinanceStore();
  const { user } = useAuthStore();

  const filteredCategories = categories.filter(category => 
    category.type === type && (category.is_default || category.user_id === user?.id)
  );

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAccountId(transaction.account_id);
      setCategoryId(transaction.category_id);
      setAmount(transaction.amount.toString());
      setDescription(transaction.description || '');
      
      const transactionDate = new Date(transaction.transaction_date);
      setDate(transactionDate.toISOString().split('T')[0]);
      setTime(transactionDate.toTimeString().slice(0, 5));
    } else {
      // Reset form for new transaction
      setType('expense');
      setAccountId('');
      setCategoryId('');
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setTime(new Date().toTimeString().slice(0, 5));
    }
  }, [transaction, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    try {
      const transactionDate = new Date(`${date}T${time}`);
      const transactionData = {
        user_id: user.id,
        account_id: accountId,
        category_id: categoryId,
        amount: parseFloat(amount),
        type,
        description: description || null,
        transaction_date: transactionDate.toISOString(),
        receipt_url: null,
      };

      if (transaction) {
        await updateTransaction(transaction.id, transactionData);
        toast.success('Transaction updated successfully!');
      } else {
        await addTransaction(transactionData);
        toast.success('Transaction added successfully!');
      }

      onOpenChange(false);
    } catch (error) {
      toast.error(transaction ? 'Failed to update transaction' : 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleCalculatorResult = (result: string) => {
    setAmount(result);
    setShowCalculator(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{transaction ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant={type === 'income' ? 'default' : 'outline'}
              className={type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'hover:bg-green-50'}
              onClick={() => setType('income')}
            >
              Income
            </Button>
            <Button
              type="button"
              variant={type === 'expense' ? 'default' : 'outline'}
              className={type === 'expense' ? 'bg-red-600 hover:bg-red-700' : 'hover:bg-red-50'}
              onClick={() => setType('expense')}
            >
              Expense
            </Button>
            <Button
              type="button"
              variant={type === 'transfer' ? 'default' : 'outline'}
              className={type === 'transfer' ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-blue-50'}
              onClick={() => setType('transfer')}
            >
              Transfer
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="account">Account</Label>
            <Select value={accountId} onValueChange={setAccountId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} (${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="flex gap-2">
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCalculator(true)}
              >
                Calc
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (transaction ? 'Updating...' : 'Adding...') : (transaction ? 'Update Transaction' : 'Add Transaction')}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>

        {showCalculator && (
          <Calculator
            onResult={handleCalculatorResult}
            onClose={() => setShowCalculator(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}