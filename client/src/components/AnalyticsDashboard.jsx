import { useMemo } from "react";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, TrendingDown, Smile, Frown, Meh, Calendar, Target } from "lucide-react";
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";

const MOOD_COLORS = {
  great: "#10b981",
  good: "#22c55e",
  okay: "#fbbf24",
  bad: "#f97316",
  terrible: "#ef4444",
};

const MOOD_LABELS = {
  great: "Great 🌟",
  good: "Good 😊",
  okay: "Okay 😐",
  bad: "Bad ☹️",
  terrible: "Terrible 😢",
};

export function AnalyticsDashboard({ goals = [], notes = [] }) {
  // Calculate completion trends over time
  const completionTrends = useMemo(() => {
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date(),
    });

    return last30Days.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      const completions = goals.reduce((total, goal) => {
        const progress = goal.progress?.find(
          (p) => format(new Date(p.date), "yyyy-MM-dd") === dayStr
        );
        return total + (progress?.completed || 0);
      }, 0);

      return {
        date: format(day, "MMM dd"),
        completions,
        goals: goals.length,
      };
    });
  }, [goals]);

  // Calculate mood distribution
  const moodDistribution = useMemo(() => {
    const distribution = { great: 0, good: 0, okay: 0, bad: 0, terrible: 0 };
    notes.forEach((note) => {
      if (note.mood && distribution[note.mood] !== undefined) {
        distribution[note.mood]++;
      }
    });

    return Object.entries(distribution).map(([mood, count]) => ({
      name: MOOD_LABELS[mood],
      value: count,
      color: MOOD_COLORS[mood],
    }));
  }, [notes]);

  // Calculate mood vs productivity correlation
  const moodProductivity = useMemo(() => {
    const moodMap = {};

    notes.forEach((note) => {
      const dateStr = format(new Date(note.date), "yyyy-MM-dd");
      const completions = goals.reduce((total, goal) => {
        const progress = goal.progress?.find(
          (p) => format(new Date(p.date), "yyyy-MM-dd") === dateStr
        );
        return total + (progress?.completed || 0);
      }, 0);

      if (!moodMap[note.mood]) {
        moodMap[note.mood] = { total: 0, count: 0 };
      }
      moodMap[note.mood].total += completions;
      moodMap[note.mood].count++;
    });

    return Object.entries(moodMap)
      .map(([mood, data]) => ({
        mood: MOOD_LABELS[mood],
        avgCompletions: (data.total / data.count).toFixed(1),
        color: MOOD_COLORS[mood],
      }))
      .sort((a, b) => b.avgCompletions - a.avgCompletions);
  }, [goals, notes]);

  // Calculate weekly trends
  const weeklyTrends = useMemo(() => {
    const weeks = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = startOfWeek(subDays(new Date(), i * 7));
      const weekEnd = endOfWeek(weekStart);
      const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

      const completions = weekDays.reduce((total, day) => {
        const dayStr = format(day, "yyyy-MM-dd");
        return (
          total +
          goals.reduce((sum, goal) => {
            const progress = goal.progress?.find(
              (p) => format(new Date(p.date), "yyyy-MM-dd") === dayStr
            );
            return sum + (progress?.completed || 0);
          }, 0)
        );
      }, 0);

      weeks.push({
        week: `Week ${i === 0 ? "Current" : `-${i}`}`,
        completions,
        avg: (completions / 7).toFixed(1),
      });
    }
    return weeks;
  }, [goals]);

  // Category performance
  const categoryPerformance = useMemo(() => {
    const categories = {};

    goals.forEach((goal) => {
      if (!categories[goal.category]) {
        categories[goal.category] = { total: 0, completed: 0 };
      }

      const totalCompletions = goal.progress?.reduce((sum, p) => sum + p.completed, 0) || 0;
      categories[goal.category].total += goal.targetCount || 1;
      categories[goal.category].completed += totalCompletions;
    });

    return Object.entries(categories)
      .map(([category, data]) => ({
        category,
        completion: ((data.completed / data.total) * 100).toFixed(1),
        completions: data.completed,
      }))
      .sort((a, b) => b.completion - a.completion);
  }, [goals]);

  // Calculate overall statistics
  const stats = useMemo(() => {
    const totalCompletions = goals.reduce((sum, goal) => {
      return sum + (goal.progress?.reduce((s, p) => s + p.completed, 0) || 0);
    }, 0);

    const last7Days = completionTrends.slice(-7);
    const thisWeek = last7Days.reduce((sum, day) => sum + day.completions, 0);
    const lastWeek = completionTrends.slice(-14, -7).reduce((sum, day) => sum + day.completions, 0);
    const weekChange = lastWeek > 0 ? (((thisWeek - lastWeek) / lastWeek) * 100).toFixed(1) : 0;

    const avgMood =
      notes.length > 0
        ? (
            notes.reduce((sum, note) => {
              const moodScore = { great: 5, good: 4, okay: 3, bad: 2, terrible: 1 };
              return sum + (moodScore[note.mood] || 3);
            }, 0) / notes.length
          ).toFixed(1)
        : 0;

    return {
      totalCompletions,
      thisWeek,
      weekChange,
      avgMood,
      totalNotes: notes.length,
    };
  }, [goals, notes, completionTrends]);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white/5 border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Completions</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.totalCompletions}</p>
            </div>
            <Target className="w-8 h-8 text-fuchsia-400" />
          </div>
        </Card>

        <Card className="p-4 bg-white/5 border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">This Week</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.thisWeek}</p>
              <div className="flex items-center gap-1 mt-1">
                {stats.weekChange > 0 ? (
                  <>
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs text-emerald-400">+{stats.weekChange}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-3 h-3 text-red-400" />
                    <span className="text-xs text-red-400">{stats.weekChange}%</span>
                  </>
                )}
              </div>
            </div>
            <Calendar className="w-8 h-8 text-violet-400" />
          </div>
        </Card>

        <Card className="p-4 bg-white/5 border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Average Mood</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.avgMood}/5</p>
            </div>
            <Smile className="w-8 h-8 text-yellow-400" />
          </div>
        </Card>

        <Card className="p-4 bg-white/5 border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Journal Entries</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.totalNotes}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-400" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/5">
          <TabsTrigger value="trends">Completion Trends</TabsTrigger>
          <TabsTrigger value="mood">Mood Analysis</TabsTrigger>
          <TabsTrigger value="correlation">Mood vs Productivity</TabsTrigger>
          <TabsTrigger value="categories">Category Performance</TabsTrigger>
        </TabsList>

        {/* Completion Trends */}
        <TabsContent value="trends" className="space-y-4">
          <Card className="p-6 bg-white/5 border-gray-800">
            <h3 className="text-lg font-semibold mb-4">30-Day Completion Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={completionTrends}>
                <defs>
                  <linearGradient id="colorCompletions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e879f9" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#e879f9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Area
                  type="monotone"
                  dataKey="completions"
                  stroke="#e879f9"
                  fillOpacity={1}
                  fill="url(#colorCompletions)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 bg-white/5 border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Weekly Comparison</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="week" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="completions" fill="#a78bfa" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* Mood Analysis */}
        <TabsContent value="mood" className="space-y-4">
          <Card className="p-6 bg-white/5 border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Mood Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={moodDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {moodDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* Mood vs Productivity */}
        <TabsContent value="correlation" className="space-y-4">
          <Card className="p-6 bg-white/5 border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Average Completions by Mood</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={moodProductivity} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis dataKey="mood" type="category" stroke="#9ca3af" width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="avgCompletions" radius={[0, 8, 8, 0]}>
                  {moodProductivity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-400 mt-4">
              This chart shows the correlation between your mood and productivity. Higher bars
              indicate more goal completions on days with that mood.
            </p>
          </Card>
        </TabsContent>

        {/* Category Performance */}
        <TabsContent value="categories" className="space-y-4">
          <Card className="p-6 bg-white/5 border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Performance by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="category" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="completion" fill="#e879f9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryPerformance.map((cat, idx) => (
              <Card key={idx} className="p-4 bg-white/5 border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{cat.category}</span>
                  <span className="text-sm text-fuchsia-400">{cat.completion}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-fuchsia-500 to-violet-500 h-2 rounded-full transition-all"
                    style={{ width: `${cat.completion}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">{cat.completions} completions</p>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AnalyticsDashboard;
