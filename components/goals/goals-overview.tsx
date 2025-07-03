'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useFinanceStore } from '@/store/finance-store';
import { Plus, MoreHorizontal, Edit, Trash2, Target, Calendar, TrendingUp } from 'lucide-react';
import { GoalModal } from '@/components/goals/goal-modal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { format, differenceInDays, parseISO } from 'date-fns';

export function GoalsOverview() {
  const { goals, categories, deleteGoal } = useFinanceStore();
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');
  const pausedGoals = goals.filter(goal => goal.status === 'paused');

  const handleEdit = (goal: any) => {
    setEditingGoal(goal);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGoal(id);
      toast.success('Goal deleted successfully');
    } catch (error) {
      toast.error('Failed to delete goal');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingGoal(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const GoalCard = ({ goal }: { goal: any }) => {
    const category = categories.find(c => c.id === goal.category_id);
    const progress = (goal.current_amount / goal.target_amount) * 100;
    const daysLeft = differenceInDays(parseISO(goal.target_date), new Date());
    const isOverdue = daysLeft < 0;

    return (
      <Card className="bg-white/80 dark:bg-gray-800/80 border-0 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-full text-white"
              style={{ backgroundColor: category?.color || '#6B7280' }}
            >
              <Target className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-lg">{goal.name}</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {category?.name || 'Unknown Category'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(goal.status)}>
              {goal.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(goal)}>
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
                      <AlertDialogTitle>Delete Goal</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this goal? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDelete(goal.id)}
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
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Progress
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress 
              value={Math.min(progress, 100)} 
              className="h-2"
              indicatorClassName={progress >= 100 ? 'bg-green-500' : 'bg-blue-500'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Current</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                ₹{goal.current_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Target</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                ₹{goal.target_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className={`${isOverdue ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>
              {isOverdue 
                ? `Overdue by ${Math.abs(daysLeft)} days`
                : `${daysLeft} days left`
              }
            </span>
          </div>

          {goal.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded">
              {goal.description}
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  const GoalSection = ({ title, goals, icon }: { title: string; goals: any[]; icon: React.ReactNode }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <Badge variant="secondary">{goals.length}</Badge>
      </div>
      {goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No {title.toLowerCase()} found
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Goals</h2>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </div>

      <GoalSection 
        title="Active Goals" 
        goals={activeGoals} 
        icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
      />

      <GoalSection 
        title="Completed Goals" 
        goals={completedGoals} 
        icon={<Target className="w-5 h-5 text-green-600" />}
      />

      {pausedGoals.length > 0 && (
        <GoalSection 
          title="Paused Goals" 
          goals={pausedGoals} 
          icon={<Calendar className="w-5 h-5 text-yellow-600" />}
        />
      )}

      <GoalModal
        open={showModal}
        onOpenChange={handleModalClose}
        goal={editingGoal}
      />
    </div>
  );
}