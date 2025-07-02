'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFinanceStore } from '@/store/finance-store';
import { useAuthStore } from '@/store/auth-store';
import { Plus, MoreHorizontal, Edit, Trash2, Tag } from 'lucide-react';
import { CategoryModal } from '@/components/categories/category-modal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export function CategoriesOverview() {
  const { categories, deleteCategory } = useFinanceStore();
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const userCategories = categories.filter(category => 
    category.is_default || category.user_id === user?.id
  );

  const incomeCategories = userCategories.filter(category => category.type === 'income');
  const expenseCategories = userCategories.filter(category => category.type === 'expense');

  const handleEdit = (category: any) => {
    if (category.is_default) {
      toast.error('Cannot edit default categories');
      return;
    }
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleDelete = async (id: string, isDefault: boolean) => {
    if (isDefault) {
      toast.error('Cannot delete default categories');
      return;
    }
    
    try {
      await deleteCategory(id);
      toast.success('Category deleted successfully');
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  const CategorySection = ({ title, categories, type }: { title: string; categories: any[]; type: 'income' | 'expense' }) => (
    <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Tag className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </div>
                    {category.is_default && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        Default
                      </Badge>
                    )}
                  </div>
                </div>
                {!category.is_default && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(category)}>
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
                            <AlertDialogTitle>Delete Category</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this category? This action cannot be undone and will affect all related transactions.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(category.id, category.is_default)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No {type} categories found
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h2>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="space-y-6">
        <CategorySection 
          title="Income Categories" 
          categories={incomeCategories} 
          type="income"
        />
        <CategorySection 
          title="Expense Categories" 
          categories={expenseCategories} 
          type="expense"
        />
      </div>

      <CategoryModal
        open={showModal}
        onOpenChange={handleModalClose}
        category={editingCategory}
      />
    </div>
  );
}