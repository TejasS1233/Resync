import { useState } from "react";
import { Pencil, Trash2, Plus, Minus, Calendar, Target } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

const GoalCard = ({ goal, onEdit, onDelete, onUpdateProgress }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const progress = goal.currentProgress || {
    completed: 0,
    target: goal.targetCount,
    percentage: 0,
  };

  const handleIncrement = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    await onUpdateProgress(goal._id, true);
    setIsUpdating(false);
  };

  const handleDecrement = async () => {
    if (isUpdating || progress.completed <= 0) return;
    setIsUpdating(true);
    await onUpdateProgress(goal._id, false);
    setIsUpdating(false);
  };

  const getStatusColor = () => {
    if (progress.percentage >= 100) return "text-green-600";
    if (progress.percentage >= 50) return "text-blue-600";
    return "text-orange-600";
  };

  const getCategoryColor = () => {
    // Generate consistent color based on category name
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-green-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-cyan-500",
    ];

    // Simple hash function to get consistent color for same category
    const hash = goal.category.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const formatFrequency = (freq) => {
    return freq.charAt(0).toUpperCase() + freq.slice(1);
  };

  return (
    <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 hover:bg-white/10 transition-all">
      <div>
        <div className="flex items-start justify-between mb-2">
          <Badge className={getCategoryColor()}>{goal.category}</Badge>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(goal)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Goal?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your goal and all
                    associated progress data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(goal._id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-1">{goal.title}</h3>
        {goal.description && (
          <p className="text-sm text-gray-400 line-clamp-2">{goal.description}</p>
        )}
      </div>

      <div className="space-y-4 mt-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>{formatFrequency(goal.frequency)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Target className="h-4 w-4" />
            <span>Target: {goal.targetCount}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-2xl font-bold ${getStatusColor()}`}>
              {progress.completed} / {progress.target}
            </span>
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {Math.round(progress.percentage)}%
            </span>
          </div>
          <Progress value={progress.percentage} className="h-2" />
        </div>

        <div className="flex items-center justify-center gap-4 pt-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleDecrement}
            disabled={isUpdating || progress.completed <= 0}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[100px] text-center">
            Update Progress
          </span>
          <Button variant="outline" size="icon" onClick={handleIncrement} disabled={isUpdating}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
