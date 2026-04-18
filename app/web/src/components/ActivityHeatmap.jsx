import { useMemo, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Flame, X, Target, TrendingUp } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const ActivityHeatmap = ({ goals }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  // Generate last 365 days of activity data
  const heatmapData = useMemo(() => {
    const data = [];
    const today = new Date();

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      // Count total completions for this date and collect goal details
      let count = 0;
      const goalDetails = [];
      goals.forEach((goal) => {
        if (goal.progress) {
          const progressEntry = goal.progress.find((p) => p.date.startsWith(dateStr));
          if (progressEntry && progressEntry.completed > 0) {
            count += progressEntry.completed;
            goalDetails.push({
              title: goal.title,
              category: goal.category,
              completed: progressEntry.completed,
              target: goal.targetCount,
            });
          }
        }
      });

      data.push({
        date: dateStr,
        displayDate: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        count,
        level: count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 9 ? 3 : 4,
        goals: goalDetails,
      });
    }

    return data;
  }, [goals]);

  // Group by weeks and months (GitHub style)
  const { weeks, months } = useMemo(() => {
    const result = [];
    const monthLabels = [];
    let currentMonth = null;
    let weekIndex = 0;

    for (let i = 0; i < heatmapData.length; i += 7) {
      const week = heatmapData.slice(i, i + 7);
      result.push(week);

      // Track month changes for labels
      if (week[0]) {
        const date = new Date(week[0].date);
        const monthYear = `${date.getMonth()}-${date.getFullYear()}`;

        if (currentMonth !== monthYear) {
          monthLabels.push({
            index: weekIndex,
            label: date.toLocaleDateString("en-US", { month: "short" }),
          });
          currentMonth = monthYear;
        }
      }
      weekIndex++;
    }

    return { weeks: result, months: monthLabels };
  }, [heatmapData]);

  const getColorClass = (level) => {
    switch (level) {
      case 0:
        return "bg-white/5 border border-transparent";
      case 1:
        return "bg-violet-900/40 border border-violet-500/20";
      case 2:
        return "bg-violet-600/60 border border-violet-500/40 shadow-[0_0_10px_rgba(124,58,237,0.2)]";
      case 3:
        return "bg-fuchsia-500 border border-fuchsia-400/50 shadow-[0_0_15px_rgba(217,70,239,0.4)]";
      case 4:
        return "bg-fuchsia-500 border border-fuchsia-400/50 shadow-[0_0_15px_rgba(217,70,239,0.4)]";
      default:
        return "bg-white/5 border border-transparent";
    }
  };

  const totalActivity = heatmapData.reduce((sum, day) => sum + day.count, 0);
  const activeStreak = useMemo(() => {
    let streak = 0;
    for (let i = heatmapData.length - 1; i >= 0; i--) {
      if (heatmapData[i].count > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [heatmapData]);

  return (
    <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-400" />
            <h3 className="text-2xl font-bold text-white">Activity Heatmap</h3>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-gray-400">Current Streak</p>
              <p className="text-2xl font-bold text-orange-400">{activeStreak} days</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Total Activity</p>
              <p className="text-2xl font-bold text-green-400">{totalActivity}</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-400">Your activity over the last year</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 overflow-x-auto">
          {/* Month labels */}
          <div className="flex gap-1 mb-2 ml-6">
            {months.map((month, idx) => (
              <div
                key={idx}
                style={{
                  marginLeft:
                    idx === 0 ? "0" : `${(month.index - (months[idx - 1]?.index || 0)) * 16}px`,
                }}
                className="text-xs text-gray-400"
              >
                {month.label}
              </div>
            ))}
          </div>

          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => {
              const isMonthStart = months.some((m) => m.index === weekIndex);
              return (
                <div
                  key={weekIndex}
                  className={`flex flex-col gap-1 ${isMonthStart && weekIndex > 0 ? "ml-2" : ""}`}
                >
                  {week.map((day, dayIndex) => (
                    <TooltipProvider key={dayIndex}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            onClick={() => day.count > 0 && setSelectedDate(day)}
                            className={`w-3 h-3 rounded-sm cursor-pointer transition-all hover:scale-125 ${getColorClass(day.level)} ${selectedDate?.date === day.date ? "ring-2 ring-white ring-offset-2 ring-offset-black" : ""}`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            <p className="font-semibold">{day.displayDate}</p>
                            <p className="text-gray-400">
                              {day.count === 0 ? "No activity" : `${day.count} completions`}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 justify-end">
            <span className="text-xs text-gray-400">Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div key={level} className={`w-3 h-3 rounded-sm ${getColorClass(level)}`} />
              ))}
            </div>
            <span className="text-xs text-gray-400">More</span>
          </div>
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-1">
          {selectedDate ? (
            <div className="rounded-2xl bg-white/10 border border-white/20 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white">{selectedDate.displayDate}</h4>
                  <p className="text-sm text-gray-400">{selectedDate.count} completions</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setSelectedDate(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {selectedDate.goals.map((goal, idx) => (
                  <div key={idx} className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-500">
                        {goal.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Target className="h-3 w-3" />
                        <span>
                          {goal.completed}/{goal.target}
                        </span>
                      </div>
                    </div>
                    <h5 className="text-sm font-semibold text-white">{goal.title}</h5>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all"
                          style={{
                            width: `${Math.min((goal.completed / goal.target) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium text-green-400">
                        {Math.round((goal.completed / goal.target) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 h-full flex flex-col items-center justify-center text-center">
              <TrendingUp className="h-12 w-12 text-gray-600 mb-3" />
              <p className="text-sm text-gray-400">Click on a square to view activity details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
