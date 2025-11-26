import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { toast } from "sonner";
import {
  Sparkles,
  Target,
  TrendingUp,
  Calendar,
  Dumbbell,
  BookOpen,
  Briefcase,
  CheckCircle,
  Palette,
  Star,
  Code,
  Grid3x3,
  Blocks,
  Book,
  Activity,
  Brain,
  PenTool,
  Languages,
} from "lucide-react";
import { Card } from "./ui/card";

const OnboardingDialog = ({ open, onComplete }) => {
  const { completeOnboarding, isGuest } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    purpose: "",
    goals: [],
    frequency: "",
  });

  const handleSkip = () => {
    onComplete();
  };

  const handleSubmit = async () => {
    if (isGuest) {
      // For guest users, just complete without API call
      localStorage.setItem("guestOnboardingComplete", "true");
      toast.success("Welcome! Let's start tracking your goals");
      onComplete();
      return;
    }

    try {
      await completeOnboarding({
        purpose: formData.purpose,
        mainGoals: formData.goals,
        preferredFrequency: formData.frequency,
      });
      toast.success("Welcome aboard! Let's start tracking your goals");
      onComplete();
    } catch (error) {
      toast.error("Failed to complete onboarding");
    }
  };

  const purposeOptions = [
    { id: "fitness", label: "Fitness & Health", Icon: Dumbbell },
    { id: "learning", label: "Learning & Education", Icon: BookOpen },
    { id: "career", label: "Career & Skills", Icon: Briefcase },
    { id: "habits", label: "Habit Building", Icon: CheckCircle },
    { id: "creative", label: "Creative Projects", Icon: Palette },
    { id: "other", label: "Other", Icon: Star },
  ];

  const goalOptions = [
    { id: "coding", label: "Coding Practice", Icon: Code },
    { id: "leetcode", label: "LeetCode/DSA", Icon: Grid3x3 },
    { id: "systemdesign", label: "System Design", Icon: Blocks },
    { id: "reading", label: "Reading", Icon: Book },
    { id: "exercise", label: "Exercise", Icon: Activity },
    { id: "meditation", label: "Meditation", Icon: Brain },
    { id: "writing", label: "Writing", Icon: PenTool },
    { id: "language", label: "Language Learning", Icon: Languages },
  ];

  const frequencyOptions = [
    { id: "daily", label: "Daily", Icon: Calendar, description: "Track progress every day" },
    { id: "weekly", label: "Weekly", Icon: Calendar, description: "Track progress weekly" },
    { id: "monthly", label: "Monthly", Icon: Calendar, description: "Track progress monthly" },
  ];

  const toggleSelection = (field, value) => {
    const current = formData[field];
    if (current.includes(value)) {
      setFormData({ ...formData, [field]: current.filter((v) => v !== value) });
    } else {
      setFormData({ ...formData, [field]: [...current, value] });
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[700px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <div className="absolute right-4 top-4">
          <Button variant="ghost" size="sm" onClick={handleSkip}>
            Skip
          </Button>
        </div>

        {step === 1 && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-6 w-6 text-purple-600" />
                <DialogTitle className="text-2xl">What brings you here?</DialogTitle>
              </div>
              <DialogDescription>Select all that apply</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-3 py-4">
              {purposeOptions.map((option) => {
                const IconComponent = option.Icon;
                return (
                  <Card
                    key={option.id}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                      formData.purpose.includes(option.id)
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => toggleSelection("purpose", option.id)}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-6 w-6 text-primary" />
                      <span className="font-medium">{option.label}</span>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-between gap-3">
              <div className="text-sm text-muted-foreground">Step 1 of 3</div>
              <Button onClick={() => setStep(2)} disabled={formData.purpose.length === 0}>
                Next
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-6 w-6 text-green-600" />
                <DialogTitle className="text-2xl">What do you want to track?</DialogTitle>
              </div>
              <DialogDescription>Select your main goals (choose multiple)</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-3 py-4">
              {goalOptions.map((option) => {
                const IconComponent = option.Icon;
                return (
                  <Card
                    key={option.id}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                      formData.goals.includes(option.id)
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => toggleSelection("goals", option.id)}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-6 w-6 text-primary" />
                      <span className="font-medium">{option.label}</span>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-between gap-3">
              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  Back
                </Button>
                <div className="text-sm text-muted-foreground">Step 2 of 3</div>
              </div>
              <Button onClick={() => setStep(3)} disabled={formData.goals.length === 0}>
                Next
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                <DialogTitle className="text-2xl">How often will you track?</DialogTitle>
              </div>
              <DialogDescription>Choose your preferred tracking frequency</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-3 py-4">
              {frequencyOptions.map((option) => {
                const IconComponent = option.Icon;
                return (
                  <Card
                    key={option.id}
                    className={`p-5 cursor-pointer transition-all hover:shadow-md ${
                      formData.frequency === option.id
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => setFormData({ ...formData, frequency: option.id })}
                  >
                    <div className="flex items-start gap-4">
                      <IconComponent className="h-8 w-8 text-primary" />
                      <div className="flex-1">
                        <div className="font-semibold text-lg mb-1">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-between gap-3">
              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  Back
                </Button>
                <div className="text-sm text-muted-foreground">Step 3 of 3</div>
              </div>
              <Button onClick={handleSubmit} disabled={!formData.frequency}>
                Get Started
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingDialog;
