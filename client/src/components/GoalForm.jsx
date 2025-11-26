import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

const GoalForm = ({ goal, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    frequency: "daily",
    targetCount: 1,
    category: "",
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title || "",
        description: goal.description || "",
        frequency: goal.frequency || "daily",
        targetCount: goal.targetCount || 1,
        category: goal.category || "",
      });
    }
  }, [goal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{goal ? "Edit Goal" : "Create New Goal"}</DialogTitle>
          <DialogDescription>
            Set up your goal with a target and frequency to track your progress
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Solve LeetCode problems"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add details about your goal..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                placeholder="e.g., Fitness, Coding, Reading"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency *</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value) => handleChange("frequency", value)}
              >
                <SelectTrigger id="frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetCount">
              Target Count * (
              {formData.frequency === "daily"
                ? "per day"
                : formData.frequency === "weekly"
                  ? "per week"
                  : "per month"}
              )
            </Label>
            <Input
              id="targetCount"
              type="number"
              min="1"
              value={formData.targetCount}
              onChange={(e) => handleChange("targetCount", parseInt(e.target.value))}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{goal ? "Update Goal" : "Create Goal"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GoalForm;
