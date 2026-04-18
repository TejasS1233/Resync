import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, X, Settings, Coffee, Target } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Slider } from "./ui/slider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { toast } from "sonner";

const DEFAULT_SETTINGS = {
  workDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  sessionsUntilLongBreak: 4,
  autoStartBreaks: false,
  autoStartWork: false,
  notifications: true,
};

export function PomodoroTimer({ isOpen, onClose, onSessionComplete }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("work"); // 'work', 'shortBreak', 'longBreak'
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Initialize audio for notifications
  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
  }, []);

  // Get duration for current mode
  const getCurrentDuration = useCallback(() => {
    switch (mode) {
      case "work":
        return settings.workDuration * 60;
      case "shortBreak":
        return settings.shortBreak * 60;
      case "longBreak":
        return settings.longBreak * 60;
      default:
        return settings.workDuration * 60;
    }
  }, [mode, settings]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  // Handle timer completion
  const handleTimerComplete = () => {
    setIsRunning(false);

    // Play notification sound
    if (settings.notifications && audioRef.current) {
      audioRef.current.play().catch((err) => console.log("Audio play failed:", err));
    }

    // Show notification
    if (
      settings.notifications &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification("Pomodoro Complete!", {
        body: mode === "work" ? "Time for a break!" : "Ready to get back to work?",
        icon: "/icon-192x192.png",
      });
    }

    // Update mode and sessions
    if (mode === "work") {
      const newSessions = sessionsCompleted + 1;
      setSessionsCompleted(newSessions);
      onSessionComplete?.(mode, settings.workDuration);

      // Determine next break type
      const isLongBreak = newSessions % settings.sessionsUntilLongBreak === 0;
      const nextMode = isLongBreak ? "longBreak" : "shortBreak";
      setMode(nextMode);
      setTimeLeft(isLongBreak ? settings.longBreak * 60 : settings.shortBreak * 60);

      toast.success("Work session complete!", {
        description: `Time for a ${isLongBreak ? "long" : "short"} break.`,
      });

      // Auto-start break if enabled
      if (settings.autoStartBreaks) {
        setTimeout(() => setIsRunning(true), 1000);
      }
    } else {
      // Break completed
      setMode("work");
      setTimeLeft(settings.workDuration * 60);

      toast.success("Break complete!", {
        description: "Ready to focus again?",
      });

      // Auto-start work if enabled
      if (settings.autoStartWork) {
        setTimeout(() => setIsRunning(true), 1000);
      }
    }
  };

  // Request notification permission
  useEffect(() => {
    if (
      settings.notifications &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }
  }, [settings.notifications]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Control functions
  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getCurrentDuration());
  };

  const skipToBreak = () => {
    if (mode === "work") {
      const isLongBreak = (sessionsCompleted + 1) % settings.sessionsUntilLongBreak === 0;
      setMode(isLongBreak ? "longBreak" : "shortBreak");
      setTimeLeft(isLongBreak ? settings.longBreak * 60 : settings.shortBreak * 60);
      setSessionsCompleted((prev) => prev + 1);
      setIsRunning(false);
    }
  };

  const skipToWork = () => {
    setMode("work");
    setTimeLeft(settings.workDuration * 60);
    setIsRunning(false);
  };

  // Progress percentage
  const progress = ((getCurrentDuration() - timeLeft) / getCurrentDuration()) * 100;

  // Mode display config
  const modeConfig = {
    work: {
      label: "Focus Time",
      color: "fuchsia",
      icon: Target,
      gradient: "from-fuchsia-500 to-violet-500",
    },
    shortBreak: {
      label: "Short Break",
      color: "emerald",
      icon: Coffee,
      gradient: "from-emerald-500 to-teal-500",
    },
    longBreak: {
      label: "Long Break",
      color: "blue",
      icon: Coffee,
      gradient: "from-blue-500 to-cyan-500",
    },
  };

  const currentConfig = modeConfig[mode];
  const Icon = currentConfig.icon;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-black/95 border border-gray-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 -z-10"></div>
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Icon className="w-5 h-5" />
                Pomodoro Timer
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(true)}
                className="text-gray-400 hover:text-white"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Mode Indicator */}
            <div className="text-center">
              <div
                className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${currentConfig.gradient} bg-opacity-20 border border-${currentConfig.color}-500/30`}
              >
                <span className={`text-sm font-medium text-${currentConfig.color}-300`}>
                  {currentConfig.label}
                </span>
              </div>
            </div>

            {/* Timer Display */}
            <div className="relative">
              {/* Progress Ring */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-gray-800"
                />
                <motion.circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={565.48}
                  initial={{ strokeDashoffset: 565.48 }}
                  animate={{ strokeDashoffset: 565.48 - (565.48 * progress) / 100 }}
                  transition={{ duration: 0.5 }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" className={`stop-color-${currentConfig.color}-500`} />
                    <stop offset="100%" className={`stop-color-${currentConfig.color}-300`} />
                  </linearGradient>
                </defs>
              </svg>

              {/* Time Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-6xl font-bold text-white tabular-nums">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-sm text-gray-400 mt-2">Session {sessionsCompleted + 1}</div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={resetTimer}
                className="w-12 h-12 rounded-full border-gray-700"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>

              <Button
                size="icon"
                onClick={toggleTimer}
                className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentConfig.gradient} hover:opacity-90`}
              >
                {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={mode === "work" ? skipToBreak : skipToWork}
                className="w-12 h-12 rounded-full border-gray-700"
              >
                <span className="text-xs">Skip</span>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{sessionsCompleted}</div>
                <div className="text-xs text-gray-400">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {settings.sessionsUntilLongBreak -
                    (sessionsCompleted % settings.sessionsUntilLongBreak)}
                </div>
                <div className="text-xs text-gray-400">Until Long Break</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {Math.floor((sessionsCompleted * settings.workDuration) / 60)}h
                </div>
                <div className="text-xs text-gray-400">Total Time</div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md bg-black/95 border border-gray-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 -z-10"></div>
          <DialogHeader>
            <DialogTitle>Pomodoro Settings</DialogTitle>
            <DialogDescription>Customize your work and break durations</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Work Duration: {settings.workDuration} minutes
              </label>
              <Slider
                value={[settings.workDuration]}
                onValueChange={(value) => setSettings({ ...settings, workDuration: value[0] })}
                min={5}
                max={60}
                step={5}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Short Break: {settings.shortBreak} minutes
              </label>
              <Slider
                value={[settings.shortBreak]}
                onValueChange={(value) => setSettings({ ...settings, shortBreak: value[0] })}
                min={1}
                max={15}
                step={1}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Long Break: {settings.longBreak} minutes
              </label>
              <Slider
                value={[settings.longBreak]}
                onValueChange={(value) => setSettings({ ...settings, longBreak: value[0] })}
                min={10}
                max={30}
                step={5}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Sessions Until Long Break: {settings.sessionsUntilLongBreak}
              </label>
              <Slider
                value={[settings.sessionsUntilLongBreak]}
                onValueChange={(value) =>
                  setSettings({ ...settings, sessionsUntilLongBreak: value[0] })
                }
                min={2}
                max={8}
                step={1}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-300">Enable Notifications</span>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                className="w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-300">Auto-start Breaks</span>
              <input
                type="checkbox"
                checked={settings.autoStartBreaks}
                onChange={(e) => setSettings({ ...settings, autoStartBreaks: e.target.checked })}
                className="w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-300">Auto-start Work Sessions</span>
              <input
                type="checkbox"
                checked={settings.autoStartWork}
                onChange={(e) => setSettings({ ...settings, autoStartWork: e.target.checked })}
                className="w-4 h-4"
              />
            </div>

            <Button
              onClick={() => {
                setShowSettings(false);
                resetTimer();
                toast.success("Settings saved!");
              }}
              className="w-full bg-gradient-to-r from-fuchsia-500 to-violet-500"
            >
              Save Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
}

export default PomodoroTimer;
