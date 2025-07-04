import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="h-[200px] flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-lg shadow-md">
      <div className="text-center">
        <div className="mb-4">
          <Loader2 className="w-12 h-12 animate-spin text-amber-600 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          FinanceFlow
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Loading your financial dashboard...
        </p>
      </div>
    </div>
  );
}