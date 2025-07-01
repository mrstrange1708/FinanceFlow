'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinanceStore } from '@/store/finance-store';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, ArrowRightLeft } from 'lucide-react';

interface RecentTransactionsProps {
  showAll?: boolean;
}

export function RecentTransactions({ showAll = false }: RecentTransactionsProps) {
  const { transactions, categories, accounts } = useFinanceStore();

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

  return (
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
                  <div className="text-right">
                    <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === 'expense' ? '-' : '+'}
                      ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category?.name || 'Unknown'}
                    </Badge>
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
  );
}