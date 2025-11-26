import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const CalendarView = ({ goals }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getProgressForDate = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = date.toISOString().split("T")[0];

    const dayProgress = [];
    goals.forEach((goal) => {
      if (!goal.progress) return;

      const progressEntry = goal.progress.find((p) => p.date.startsWith(dateStr));

      if (progressEntry && progressEntry.completed > 0) {
        dayProgress.push({
          goal: goal.title,
          category: goal.category,
          completed: progressEntry.completed,
          target: goal.targetCount,
        });
      }
    });

    return dayProgress;
  };

  const getDayColor = (day) => {
    const progress = getProgressForDate(day);
    if (progress.length === 0) return "bg-muted text-muted-foreground";

    const totalProgress = progress.reduce((sum, p) => sum + p.completed / p.target, 0);
    const avgProgress = totalProgress / progress.length;

    if (avgProgress >= 1) return "bg-green-500 text-white";
    if (avgProgress >= 0.5) return "bg-blue-500 text-white";
    return "bg-orange-500 text-white";
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendar View
            </CardTitle>
            <CardDescription>Track your daily progress</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[120px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <Button variant="ghost" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}

          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const progress = getProgressForDate(day);

            return (
              <TooltipProvider key={day}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all hover:scale-105 ${getDayColor(day)} ${
                        isToday(day) ? "ring-2 ring-primary ring-offset-2" : ""
                      }`}
                    >
                      <span className="text-sm font-medium">{day}</span>
                      {progress.length > 0 && (
                        <span className="text-[10px] opacity-80">
                          {progress.reduce((sum, p) => sum + p.completed, 0)}
                        </span>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      <p className="font-semibold">
                        {monthNames[currentDate.getMonth()]} {day}, {currentDate.getFullYear()}
                      </p>
                      {progress.length > 0 ? (
                        progress.map((p, idx) => (
                          <div key={idx} className="text-sm">
                            <Badge variant="outline" className="mr-2">
                              {p.category}
                            </Badge>
                            {p.goal}: {p.completed}/{p.target}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No activity</p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarView;
