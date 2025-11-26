import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useAuth } from "../context/AuthContext";
import { User, Target, TrendingUp, Award, Calendar } from "lucide-react";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const ProfilePage = ({ goals }) => {
  const { user, isGuest } = useAuth();

  const heatmapData = useMemo(() => {
    const data = {};
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364); // Last 365 days

    // Initialize all dates with 0
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = new Date(d).toISOString().split("T")[0];
      data[dateStr] = 0;
    }

    // Count completions per day
    goals.forEach((goal) => {
      if (!goal.progress) return;

      goal.progress.forEach((p) => {
        const dateStr = p.date.split("T")[0];
        if (data.hasOwnProperty(dateStr)) {
          data[dateStr] += p.completed || 0;
        }
      });
    });

    return data;
  }, [goals]);

  const stats = useMemo(() => {
    const totalDays = Object.keys(heatmapData).length;
    const activeDays = Object.values(heatmapData).filter((v) => v > 0).length;
    const totalCompletions = Object.values(heatmapData).reduce((sum, v) => sum + v, 0);
    const currentStreak = calculateStreak(heatmapData);
    const longestStreak = calculateLongestStreak(heatmapData);

    return {
      activeDays,
      totalCompletions,
      currentStreak,
      longestStreak,
      totalDays,
    };
  }, [heatmapData]);

  const calculateStreak = (data) => {
    const dates = Object.keys(data).sort().reverse();
    let streak = 0;

    for (const date of dates) {
      if (data[date] > 0) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const calculateLongestStreak = (data) => {
    const dates = Object.keys(data).sort();
    let maxStreak = 0;
    let currentStreak = 0;

    for (const date of dates) {
      if (data[date] > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return maxStreak;
  };

  const getContributionColor = (count) => {
    if (count === 0) return "bg-muted";
    if (count <= 2) return "bg-green-200 dark:bg-green-900";
    if (count <= 5) return "bg-green-400 dark:bg-green-700";
    if (count <= 10) return "bg-green-600 dark:bg-green-600";
    return "bg-green-700 dark:bg-green-500";
  };

  const renderHeatmap = () => {
    const weeks = [];
    const dates = Object.keys(heatmapData).sort();

    for (let i = 0; i < dates.length; i += 7) {
      weeks.push(dates.slice(i, i + 7));
    }

    return (
      <div className="flex gap-[2px] overflow-x-auto pb-4">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-[2px]">
            {week.map((date) => {
              const count = heatmapData[date];
              const dateObj = new Date(date);

              return (
                <TooltipProvider key={date}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`w-3 h-3 rounded-sm cursor-pointer transition-all hover:ring-1 hover:ring-primary ${getContributionColor(count)}`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">
                        <p className="font-semibold">
                          {dateObj.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-muted-foreground">
                          {count} {count === 1 ? "completion" : "completions"}
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-6">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {isGuest ? "G" : user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl mb-1">
                {isGuest ? "Guest User" : user?.name || "User"}
              </CardTitle>
              <CardDescription className="mb-4">
                {isGuest ? "Using guest mode" : user?.email}
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Target className="h-3 w-3" />
                  {goals.length} Goals
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  {stats.activeDays} Active Days
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {stats.currentStreak} Day Streak
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Completions</CardDescription>
            <CardTitle className="text-3xl">{stats.totalCompletions}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Days</CardDescription>
            <CardTitle className="text-3xl">{stats.activeDays}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Current Streak</CardDescription>
            <CardTitle className="text-3xl text-orange-600">{stats.currentStreak}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Longest Streak</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.longestStreak}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Contribution Graph */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Heatmap</CardTitle>
          <CardDescription>Your progress over the last year</CardDescription>
        </CardHeader>
        <CardContent>
          {renderHeatmap()}
          <div className="flex items-center justify-end gap-2 mt-4 text-sm text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-muted" />
              <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900" />
              <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700" />
              <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-600" />
              <div className="w-3 h-3 rounded-sm bg-green-700 dark:bg-green-500" />
            </div>
            <span>More</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
