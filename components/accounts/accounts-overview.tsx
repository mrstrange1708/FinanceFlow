'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFinanceStore } from '@/store/finance-store';
import { Plus, Wallet, CreditCard, Banknote, TrendingUp, PiggyBank, MoreHorizontal } from 'lucide-react';
import { AccountModal } from '@/components/accounts/account-modal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export function AccountsOverview() {
  const { accounts, deleteAccount } = useFinanceStore();
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCard className="w-6 h-6" />;
      case 'wallet':
        return <Wallet className="w-6 h-6" />;
      case 'cash':
        return <Banknote className="w-6 h-6" />;
      case 'investment':
        return <TrendingUp className="w-6 h-6" />;
      case 'savings':
        return <PiggyBank className="w-6 h-6" />;
      default:
        return <Wallet className="w-6 h-6" />;
    }
  };

  const handleEdit = (account: any) => {
    setEditingAccount(account);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAccount(id);
      toast.success('Account deleted successfully');
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingAccount(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Accounts</h2>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Account
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <Card key={account.id} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-full text-white"
                  style={{ backgroundColor: account.color }}
                >
                  {getAccountIcon(account.type)}
                </div>
                <div>
                  <CardTitle className="text-lg">{account.name}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {account.type}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(account)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDelete(account.id)}
                    className="text-red-600"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{account.balance.toLocaleString('en-IN', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AccountModal
        open={showModal}
        onOpenChange={handleModalClose}
        account={editingAccount}
      />
    </div>
  );
}