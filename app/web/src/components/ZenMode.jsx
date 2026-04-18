import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  CheckCircle2,
  ChevronDown,
  Target,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

const ZenMode = ({ goals = [], onCompleteGoal, onClose }) => {
  // --- STATE ---
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
  const [initialTime, setInitialTime] = useState(25 * 60); // Track initial time for progress
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("focus"); // 'focus' | 'shortBreak' | 'custom'
  const [selectedGoal, setSelectedGoal] = useState(goals[0] || { title: "Deep Work Session" });
  const [showGoalSelector, setShowGoalSelector] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [editMinutes, setEditMinutes] = useState("");

  // --- REFS & AUDIO ---
  const timerRef = useRef(null);
  // Simple beep for demo purposes (in real app, use a nice chime file)
  const playSound = () => {
    if (!soundEnabled) return;
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    audio.volume = 0.5;
    audio.play().catch((e) => console.log("Audio play failed", e));
  };

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer Finished
      setIsActive(false);
      clearInterval(timerRef.current);
      playSound();
      if (mode === "focus") {
        setSessionComplete(true);
      }
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft, mode]);

  // --- HANDLERS ---
  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setSessionComplete(false);
    setTimeLeft(initialTime);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setSessionComplete(false);
    let newTime;
    if (newMode === "focus") newTime = 25 * 60;
    else if (newMode === "shortBreak") newTime = 5 * 60;
    else if (newMode === "custom") {
      setIsEditingTime(true);
      setEditMinutes(Math.floor(timeLeft / 60).toString());
      return;
    }
    setTimeLeft(newTime);
    setInitialTime(newTime);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const calculateProgress = () => {
    return ((initialTime - timeLeft) / initialTime) * 100;
  };

  // --- RENDER HELPERS ---
  const getGradient = () => {
    if (mode === "focus") return "from-violet-600 to-fuchsia-600";
    return "from-emerald-600 to-teal-600";
  };

  return (
    <div
      className={`fixed inset-0 z-[200] bg-black text-white flex flex-col items-center justify-center overflow-hidden transition-colors duration-1000 ${isActive ? "cursor-none" : ""}`}
    >
      {/* 1. AMBIENT BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        {/* The "Breathing" Glow */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vh] h-[80vh] rounded-full bg-gradient-to-r ${getGradient()} opacity-10 blur-[120px] transition-all duration-[4000ms] ease-in-out ${isActive ? "scale-110 opacity-20" : "scale-100 opacity-10"}`}
        ></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* 2. TOP BAR */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
        <div
          className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
          onClick={onClose}
        >
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <X size={16} />
          </div>
          <span className="text-sm font-medium">Exit Zen Mode</span>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 text-gray-500 hover:text-white transition-colors"
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <button
            onClick={handleFullscreen}
            className="p-2 text-gray-500 hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>
      </div>

      {/* 3. MAIN TIMER VISUAL */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Circular Progress */}
        <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] flex items-center justify-center">
          {/* SVG Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            {/* Background Track */}
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-white/5"
            />
            {/* Progress Line */}
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray="3015"
              strokeDashoffset={3015 - (3015 * calculateProgress()) / 100}
              strokeLinecap="round"
              className={`transition-all duration-1000 ease-linear ${mode === "focus" ? "text-fuchsia-500" : "text-emerald-500"}`}
              style={{
                filter: `drop-shadow(0 0 10px ${mode === "focus" ? "#d946ef" : "#10b981"})`,
              }}
            />
          </svg>

          {/* The Breathing Core */}
          <div
            className={`absolute inset-0 rounded-full border border-white/5 animate-ping opacity-10 pointer-events-none ${isActive ? "duration-[3000ms]" : "hidden"}`}
          ></div>

          {/* Time Display */}
          <div className="flex flex-col items-center">
            {isEditingTime && !isActive ? (
              <div className="flex flex-col items-center gap-4">
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={editMinutes}
                  onChange={(e) => setEditMinutes(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const mins = Math.max(1, Math.min(180, parseInt(editMinutes) || 1));
                      const newTime = mins * 60;
                      setTimeLeft(newTime);
                      setInitialTime(newTime);
                      setIsEditingTime(false);
                      setMode("custom");
                    } else if (e.key === "Escape") {
                      setIsEditingTime(false);
                    }
                  }}
                  className="w-48 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white text-center text-5xl font-bold font-mono focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  autoFocus
                  placeholder="25"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const mins = Math.max(1, Math.min(180, parseInt(editMinutes) || 1));
                      const newTime = mins * 60;
                      setTimeLeft(newTime);
                      setInitialTime(newTime);
                      setIsEditingTime(false);
                      setMode("custom");
                    }}
                    className="px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Set
                  </button>
                  <button
                    onClick={() => setIsEditingTime(false)}
                    className="px-4 py-2 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors text-sm border border-white/20"
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-gray-400 text-xs">Enter minutes (1-180) or press Enter</p>
              </div>
            ) : (
              <div
                className={`font-mono text-7xl md:text-9xl font-bold tracking-tighter tabular-nums text-white ${!isActive ? "cursor-pointer hover:text-fuchsia-400 transition-colors" : ""}`}
                onClick={() => {
                  if (!isActive) {
                    setIsEditingTime(true);
                    setEditMinutes(Math.floor(timeLeft / 60).toString());
                  }
                }}
                title={!isActive ? "Click to edit timer" : ""}
              >
                {formatTime(timeLeft)}
              </div>
            )}

            {/* Current Task Badge */}
            {!sessionComplete && (
              <div className="mt-8 relative group">
                <button
                  onClick={() => setShowGoalSelector(!showGoalSelector)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md transition-all ${
                    isActive
                      ? "bg-black/50 border-white/10 text-gray-400"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }`}
                >
                  <Target
                    size={16}
                    className={mode === "focus" ? "text-fuchsia-400" : "text-emerald-400"}
                  />
                  <span className="text-sm font-medium max-w-[200px] truncate">
                    {selectedGoal.title}
                  </span>
                  {!isActive && <ChevronDown size={14} className="text-gray-500" />}
                </button>

                {/* Goal Dropdown */}
                {showGoalSelector && !isActive && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 z-50">
                    {goals.length > 0 ? (
                      goals.map((g) => (
                        <button
                          key={g._id}
                          onClick={() => {
                            setSelectedGoal(g);
                            setShowGoalSelector(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5 last:border-0"
                        >
                          {g.title}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-xs text-gray-500 text-center">
                        No goals found
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 4. CONTROLS */}
        {!sessionComplete && (
          <div className="mt-12 flex items-center gap-8">
            {/* Reset */}
            <button
              onClick={resetTimer}
              className="p-4 rounded-full text-gray-500 hover:text-white hover:bg-white/5 transition-all"
              title="Reset Timer"
            >
              <RotateCcw size={24} />
            </button>

            {/* Play/Pause (The Big Button) */}
            <button
              onClick={toggleTimer}
              className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all transform active:scale-95 shadow-[0_0_40px_rgba(0,0,0,0.5)] ${
                isActive
                  ? "bg-white/10 text-white border border-white/10 hover:bg-white/20"
                  : `bg-white text-black hover:scale-105 hover:shadow-[0_0_30px_${mode === "focus" ? "#d946ef" : "#10b981"}]`
              }`}
            >
              {isActive ? (
                <Pause size={32} fill="currentColor" />
              ) : (
                <Play size={32} fill="currentColor" className="ml-1" />
              )}
            </button>

            {/* Mode Toggle */}
            <div className="flex bg-white/5 rounded-full p-1 border border-white/5">
              <button
                onClick={() => switchMode("focus")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${mode === "focus" ? "bg-fuchsia-600 text-white shadow-lg" : "text-gray-500 hover:text-white"}`}
              >
                Focus
              </button>
              <button
                onClick={() => switchMode("shortBreak")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${mode === "shortBreak" ? "bg-emerald-600 text-white shadow-lg" : "text-gray-500 hover:text-white"}`}
              >
                Break
              </button>
              <button
                onClick={() => {
                  if (!isActive) {
                    setIsEditingTime(true);
                    setEditMinutes(Math.floor(timeLeft / 60).toString());
                    setMode("custom");
                  }
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${mode === "custom" ? "bg-violet-600 text-white shadow-lg" : "text-gray-500 hover:text-white"}`}
                disabled={isActive}
              >
                Custom
              </button>
            </div>
          </div>
        )}

        {/* 5. SESSION COMPLETE MODAL */}
        {sessionComplete && (
          <div className="mt-12 animate-in slide-in-from-bottom-4 fade-in duration-500">
            <div className="bg-[#111] border border-white/10 p-8 rounded-3xl shadow-2xl text-center max-w-sm mx-auto backdrop-blur-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(217,70,239,0.4)]">
                <CheckCircle2 size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Session Complete</h3>
              <p className="text-gray-400 text-sm mb-6">
                Great focus! Did you complete your goal{" "}
                <span className="text-white font-semibold">"{selectedGoal.title}"</span>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (onCompleteGoal) onCompleteGoal(selectedGoal);
                    resetTimer();
                  }}
                  className="flex-1 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Yes, Complete it
                </button>
                <button
                  onClick={() => {
                    resetTimer();
                  }}
                  className="flex-1 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-colors border border-white/10"
                >
                  Not yet
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZenMode;
