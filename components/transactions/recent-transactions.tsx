'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinanceStore } from '@/store/finance-store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, ArrowRightLeft, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { TransactionModal } from '@/components/transactions/transaction-modal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface RecentTransactionsProps {
  showAll?: boolean;
}

export function RecentTransactions({ showAll = false }: RecentTransactionsProps) {
  const { transactions, categories, accounts, deleteTransaction } = useFinanceStore();
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const displayTransactions = showAll ? transactions : transactions.slice(0, 10);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'expense':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'transfer':
        return <ArrowRightLeft className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'text-green-600';
      case 'expense':
        return 'text-red-600';
      case 'transfer':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction);
    setShowEditModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      toast.success('Transaction deleted successfully');
    } catch (error) {
      toast.error('Failed to delete transaction');
    }
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditingTransaction(null);
  };

  return (
    <>
      <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            {showAll ? 'All Transactions' : 'Recent Transactions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {displayTransactions.length > 0 ? (
            <div className="space-y-4">
              {displayTransactions.map((transaction) => {
                const category = categories.find(c => c.id === transaction.category_id);
                const account = accounts.find(a => a.id === transaction.account_id);
                
                return (
                  <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {transaction.description || category?.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {account?.name} • {format(new Date(transaction.transaction_date), 'MMM d, yyyy')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                          {transaction.type === 'expense' ? '-' : '+'}
                          ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {category?.name || 'Unknown'}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(transaction)}>
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
                                <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this transaction? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(transaction.id)}
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
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No transactions found
            </div>
          )}
        </CardContent>
      </Card>

      <TransactionModal
        open={showEditModal}
        onOpenChange={handleEditModalClose}
        transaction={editingTransaction}
      />
    </>
  );
}