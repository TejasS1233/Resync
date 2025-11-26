import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { goalAPI } from "./api/api";
import Dashboard from "./components/Dashboard";
import AuthForm from "./components/AuthForm";
import LandingPage from "./components/LandingPage";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, isAuthenticated, isGuest, loading: authLoading } = useAuth();
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth to be determined before loading data
    if (authLoading) return;

    if (isAuthenticated) {
      fetchGoals();
      fetchStats();
    } else if (isGuest) {
      // Load from localStorage for guest mode
      loadGuestData();
      setLoading(false);
    }
  }, [isAuthenticated, isGuest, authLoading]);

  const loadGuestData = () => {
    const storedGoals = localStorage.getItem("guestGoals");
    const parsedGoals = storedGoals ? JSON.parse(storedGoals) : [];
    setGoals(parsedGoals);
    calculateGuestStats(parsedGoals);
  };

  const saveGuestData = (updatedGoals) => {
    localStorage.setItem("guestGoals", JSON.stringify(updatedGoals));
    calculateGuestStats(updatedGoals);
  };

  const calculateGuestStats = (goalsData) => {
    const stats = {
      totalGoals: goalsData.length || 0,
      completedToday: 0,
      onTrack: 0,
      needsAttention: 0,
      byCategory: {},
    };

    goalsData.forEach((goal) => {
      // Calculate progress percentage
      let percentage = 0;
      if (goal.progress && goal.progress.length > 0 && goal.targetCount) {
        const currentPeriod = getCurrentPeriod(goal.frequency);
        const periodProgress = goal.progress.filter((p) => new Date(p.date) >= currentPeriod.start);
        percentage = (periodProgress.length / goal.targetCount) * 100;
      }

      // Count by category
      if (goal.category) {
        stats.byCategory[goal.category] = (stats.byCategory[goal.category] || 0) + 1;
      }

      // Categorize by progress
      if (percentage >= 100) {
        stats.completedToday++;
      } else if (percentage >= 50) {
        stats.onTrack++;
      } else {
        stats.needsAttention++;
      }
    });

    setStats(stats);
  };

  const getCurrentPeriod = (frequency) => {
    const now = new Date();
    const start = new Date();

    switch (frequency) {
      case "daily":
        start.setHours(0, 0, 0, 0);
        break;
      case "weekly":
        start.setDate(now.getDate() - now.getDay());
        start.setHours(0, 0, 0, 0);
        break;
      case "monthly":
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        break;
    }

    return { start, end: now };
  };

  const fetchGoals = async () => {
    try {
      const response = await goalAPI.getAllGoals();
      if (response.success) {
        setGoals(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch goals");
      console.error("Error fetching goals:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await goalAPI.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleCreateGoal = async (goalData) => {
    if (isGuest) {
      // Handle guest mode
      const newGoal = {
        ...goalData,
        _id: Date.now().toString(),
        progress: [],
        createdAt: new Date().toISOString(),
      };
      const updatedGoals = [newGoal, ...goals];
      setGoals(updatedGoals);
      saveGuestData(updatedGoals);
      toast.success("Goal created successfully!");
      return;
    }

    try {
      const response = await goalAPI.createGoal(goalData);
      if (response.success) {
        setGoals([response.data, ...goals]);
        toast.success("Goal created successfully!");
        fetchStats();
      }
    } catch (error) {
      toast.error("Failed to create goal");
      console.error("Error creating goal:", error);
    }
  };

  const handleUpdateGoal = async (id, goalData) => {
    if (isGuest) {
      const updatedGoals = goals.map((g) => (g._id === id ? { ...g, ...goalData } : g));
      setGoals(updatedGoals);
      saveGuestData(updatedGoals);
      toast.success("Goal updated successfully!");
      return;
    }

    try {
      const response = await goalAPI.updateGoal(id, goalData);
      if (response.success) {
        setGoals(goals.map((g) => (g._id === id ? response.data : g)));
        toast.success("Goal updated successfully!");
        fetchStats();
      }
    } catch (error) {
      toast.error("Failed to update goal");
      console.error("Error updating goal:", error);
    }
  };

  const handleDeleteGoal = async (id) => {
    if (isGuest) {
      const updatedGoals = goals.filter((g) => g._id !== id);
      setGoals(updatedGoals);
      saveGuestData(updatedGoals);
      toast.success("Goal deleted successfully!");
      return;
    }

    try {
      const response = await goalAPI.deleteGoal(id);
      if (response.success) {
        setGoals(goals.filter((g) => g._id !== id));
        toast.success("Goal deleted successfully!");
        fetchStats();
      }
    } catch (error) {
      toast.error("Failed to delete goal");
      console.error("Error deleting goal:", error);
    }
  };

  const handleUpdateProgress = async (id, completed) => {
    if (isGuest) {
      const updatedGoals = goals.map((g) => {
        if (g._id === id) {
          const progress = g.progress || [];
          const today = new Date().toISOString().split("T")[0];
          const existingIndex = progress.findIndex((p) => p.date.startsWith(today));

          if (existingIndex >= 0) {
            // Increment or decrement count
            const currentCount = progress[existingIndex].completed || 0;
            progress[existingIndex] = {
              date: new Date().toISOString(),
              completed: completed ? currentCount + 1 : Math.max(currentCount - 1, 0),
            };
          } else {
            progress.push({ date: new Date().toISOString(), completed: completed ? 1 : 0 });
          }

          return { ...g, progress };
        }
        return g;
      });
      setGoals(updatedGoals);
      saveGuestData(updatedGoals);
      toast.success("Progress updated!");
      return;
    }

    try {
      const response = await goalAPI.updateProgress(id, completed);
      if (response.success) {
        setGoals(goals.map((g) => (g._id === id ? response.data : g)));
        toast.success("Progress updated!");
        fetchStats();
      }
    } catch (error) {
      toast.error("Failed to update progress");
      console.error("Error updating progress:", error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showAuthForm && !isAuthenticated && (
        <div className="fixed inset-0 z-50 bg-background">
          <AuthForm onClose={() => setShowAuthForm(false)} />
        </div>
      )}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <Dashboard
              goals={goals}
              stats={stats}
              loading={loading}
              onCreateGoal={handleCreateGoal}
              onUpdateGoal={handleUpdateGoal}
              onDeleteGoal={handleDeleteGoal}
              onUpdateProgress={handleUpdateProgress}
              onShowAuth={() => setShowAuthForm(true)}
            />
          }
        />
      </Routes>

      <Toaster position="top-right" />
    </>
  );
}

export default App;
