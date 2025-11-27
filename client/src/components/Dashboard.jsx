import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Target,
  TrendingUp,
  AlertCircle,
  Award,
  LogOut,
  BookOpen,
  Calendar as CalendarIcon,
  User,
  Sparkles,
  LayoutDashboard,
  MoreVertical,
  X,
  Zap,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import GoalForm from "./GoalForm";
import GoalCard from "./GoalCard";
import DailyNote from "./DailyNote";
import NotesHistory from "./NotesHistory";
import ActivityHeatmap from "./ActivityHeatmap";
import Breadcrumbs from "./Breadcrumbs";
import ZenMode from "./ZenMode";
import { useAuth } from "../context/AuthContext";

// Guest Banner Component
const GuestBanner = ({ onSignUp }) => (
  <div className="bg-gradient-to-r from-violet-900/50 to-fuchsia-900/50 border border-fuchsia-500/30 rounded-xl p-4 flex items-center justify-between mb-6 backdrop-blur-md">
    <div className="flex items-center gap-3">
      <Sparkles className="text-fuchsia-400" size={20} />
      <div>
        <h3 className="font-bold text-white">You are in Guest Mode</h3>
        <p className="text-sm text-gray-300">
          Your data is saved locally. Sign in to sync across devices.
        </p>
      </div>
    </div>
    <button
      onClick={onSignUp}
      className="px-4 py-2 bg-white text-black rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors"
    >
      Create Account
    </button>
  </div>
);

const Dashboard = ({
  goals,
  stats,
  loading,
  onCreateGoal,
  onUpdateGoal,
  onDeleteGoal,
  onUpdateProgress,
  onShowAuth,
}) => {
  // Always call hooks at the top level - before any early returns
  const { user, logout, isGuest } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [showZenMode, setShowZenMode] = useState(false);

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleFormSubmit = async (goalData) => {
    if (editingGoal) {
      await onUpdateGoal(editingGoal._id, goalData);
    } else {
      await onCreateGoal(goalData);
    }
    setShowForm(false);
    setEditingGoal(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingGoal(null);
  };

  const filteredGoals =
    filterCategory === "all" ? goals : goals.filter((g) => g.category === filterCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center relative">
          <div className="absolute inset-0 bg-fuchsia-500 blur-2xl opacity-20"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-fuchsia-500 mx-auto mb-6 relative z-10"></div>
          <p className="text-gray-400 font-mono animate-pulse">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-fuchsia-500/30 relative overflow-x-hidden font-sans">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/5 supports-[backdrop-filter]:bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-0.5 cursor-pointer group">
              <img
                src="/image.png"
                alt="Resync Logo"
                className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
              />
              <span className="text-white font-bold text-xl tracking-tight group-hover:text-fuchsia-100 transition-colors hidden sm:block">
                Resync
              </span>
            </Link>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowZenMode(true)}
                className="group relative px-5 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-full font-bold text-sm overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(217,70,239,0.4)]"
                title="Zen Mode - Focus Timer"
              >
                <span className="relative flex items-center gap-2">
                  <Zap className="h-4 w-4" strokeWidth={3} />
                  <span className="hidden sm:inline">Zen</span>
                </span>
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="group relative px-5 py-2.5 bg-white text-black rounded-full font-bold text-sm overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center gap-2">
                  <Plus className="h-4 w-4" strokeWidth={3} />
                  <span className="hidden sm:inline">New Goal</span>
                </span>
              </button>
              <Link
                to="/profile"
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                title="Profile"
              >
                <User className="h-5 w-5" />
              </Link>
              {!isGuest ? (
                <button
                  onClick={logout}
                  className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={onShowAuth}
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Sign In
                </button>
              )}{" "}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-12 max-w-7xl">
        <Breadcrumbs />

        {/* Guest Mode Banner */}
        {isGuest && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4">
            <GuestBanner onSignUp={onShowAuth} />
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                {isGuest ? "Guest" : user?.name}
              </span>
              .
            </h1>
            <p className="text-gray-400 text-lg">
              You're on a roll. Let's keep the momentum going.
            </p>
          </div>

          {/* Filter Tabs (Pill Shape) */}
          <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md overflow-x-auto no-scrollbar">
            <button
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                filterCategory === "all"
                  ? "bg-white/10 text-white shadow-sm border border-white/5"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
              onClick={() => setFilterCategory("all")}
            >
              All Goals
            </button>
            {[...new Set(goals.map((g) => g.category))].sort().map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                  filterCategory === category
                    ? "bg-white/10 text-white shadow-sm border border-white/5"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => setFilterCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid - Glass Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {/* Card 1 */}
            <div className="group relative p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md hover:border-white/20 transition-all hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div>
                  <div className="text-sm font-medium text-gray-400 mb-1">Total Goals</div>
                  <div className="text-3xl font-mono font-bold text-white">{stats.totalGoals}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-white group-hover:scale-110 transition-transform">
                  <Target size={20} />
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md hover:border-emerald-500/30 transition-all hover:-translate-y-1">
              <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div>
                  <div className="text-sm font-medium text-gray-400 mb-1">Completed</div>
                  <div className="text-3xl font-mono font-bold text-emerald-400">
                    {stats.completedToday}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Award size={20} />
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md hover:border-blue-500/30 transition-all hover:-translate-y-1">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div>
                  <div className="text-sm font-medium text-gray-400 mb-1">On Track</div>
                  <div className="text-3xl font-mono font-bold text-blue-400">{stats.onTrack}</div>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                  <TrendingUp size={20} />
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="group relative p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md hover:border-orange-500/30 transition-all hover:-translate-y-1">
              <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div>
                  <div className="text-sm font-medium text-gray-400 mb-1">Needs Focus</div>
                  <div className="text-3xl font-mono font-bold text-orange-400">
                    {stats.needsAttention}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 group-hover:scale-110 transition-transform">
                  <AlertCircle size={20} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="goals" className="space-y-8">
          {/* Custom Glass Tab List */}
          <div className="flex justify-center">
            <TabsList className="inline-flex h-auto p-1.5 bg-black/40 border border-white/10 backdrop-blur-xl rounded-full gap-1">
              <TabsTrigger
                value="goals"
                className="px-6 py-2.5 rounded-full text-sm font-medium text-gray-400 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all flex items-center gap-2"
              >
                <LayoutDashboard size={16} /> Goals
              </TabsTrigger>
              <TabsTrigger
                value="calendar"
                className="px-6 py-2.5 rounded-full text-sm font-medium text-gray-400 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all flex items-center gap-2"
              >
                <CalendarIcon size={16} /> Calendar
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="px-6 py-2.5 rounded-full text-sm font-medium text-gray-400 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all flex items-center gap-2"
              >
                <BookOpen size={16} /> Notes
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="goals" className="space-y-6">
            {/* Goals Grid */}
            {filteredGoals.length === 0 ? (
              <div className="text-center py-24">
                <div className="max-w-md mx-auto p-12 rounded-3xl border-2 border-dashed border-white/10 bg-white/5 backdrop-blur-sm">
                  <div className="mb-6 inline-block p-6 rounded-2xl bg-white/5 border border-white/10">
                    <Target className="h-12 w-12 text-gray-500 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {filterCategory === "all" ? "No goals yet" : "No matching goals"}
                  </h3>
                  <p className="text-gray-400 mb-6 text-base leading-relaxed">
                    {filterCategory === "all"
                      ? "Create your first goal to get started on your journey!"
                      : `No goals found in "${filterCategory}" category`}
                  </p>
                  {filterCategory === "all" && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-transform font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                      <Plus className="h-5 w-5" strokeWidth={3} />
                      Create Your First Goal
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGoals.map((goal, index) => (
                  <div
                    key={goal._id}
                    className="animate-in fade-in zoom-in"
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}
                  >
                    <GoalCard
                      goal={goal}
                      onEdit={handleEdit}
                      onDelete={onDeleteGoal}
                      onUpdateProgress={onUpdateProgress}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <ActivityHeatmap goals={goals} />
          </TabsContent>

          <TabsContent value="notes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <NotesHistory />
              </div>
              <div className="lg:col-span-1">
                <DailyNote />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Goal Form Modal with Overlay */}
        {showForm && (
          <>
            {/* Dark overlay backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in"
              onClick={handleFormClose}
            ></div>
            {/* Modal container */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div className="pointer-events-auto animate-in zoom-in slide-in-from-bottom-4">
                <GoalForm
                  goal={editingGoal}
                  onSubmit={handleFormSubmit}
                  onClose={handleFormClose}
                />
              </div>
            </div>
          </>
        )}

        {/* Zen Mode */}
        {showZenMode && (
          <ZenMode
            goals={goals}
            onCompleteGoal={(goal) => {
              onUpdateProgress(goal._id, 1);
            }}
            onClose={() => setShowZenMode(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
