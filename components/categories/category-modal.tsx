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

interface CategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: any;
}

const categoryColors = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
  '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
  '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
  '#EC4899', '#F43F5E'
];

export function CategoryModal({ open, onOpenChange, category }: CategoryModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [color, setColor] = useState('#EF4444');
  const [loading, setLoading] = useState(false);

  const { addCategory, updateCategory } = useFinanceStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (category) {
      setName(category.name);
      setType(category.type);
      setColor(category.color);
    } else {
      setName('');
      setType('expense');
      setColor('#EF4444');
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    try {
      const categoryData = {
        user_id: user.id,
        name,
        type,
        icon: 'tag',
        color,
        is_default: false,
      };

      if (category) {
        await updateCategory(category.id, categoryData);
        toast.success('Category updated successfully!');
      } else {
        await addCategory(categoryData);
        toast.success('Category added successfully!');
      }

      onOpenChange(false);
    } catch (error) {
      toast.error(category ? 'Failed to update category' : 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md mx-auto p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{category ? 'Edit Category' : 'Add Category'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm sm:text-base">Category Name</Label>
            <Input
              id="name"
              placeholder="Food & Dining"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-10 sm:h-11 text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm sm:text-base">Type</Label>
            <Select value={type} onValueChange={(value: any) => setType(value)} required>
              <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income" className="text-sm sm:text-base">Income</SelectItem>
                <SelectItem value="expense" className="text-sm sm:text-base">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color" className="text-sm sm:text-base">Color</Label>
            <div className="flex gap-2 flex-wrap">
              {categoryColors.map((colorOption) => (
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

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button 
              type="submit" 
              disabled={loading} 
              className="flex-1 h-10 sm:h-11 text-sm sm:text-base"
            >
              {loading ? (category ? 'Updating...' : 'Adding...') : (category ? 'Update Category' : 'Add Category')}
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