import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX, Coffee, Target } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";

export function FocusMode({ isActive, onClose, goals = [] }) {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [ambientSound, setAmbientSound] = useState(false);
  const [soundVolume, setSoundVolume] = useState(50);
  const [showBreathingCircle, setShowBreathingCircle] = useState(true);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Prevent scrolling when focus mode is active
  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isActive]);

  // Request fullscreen when Focus Mode is activated
  useEffect(() => {
    if (isActive && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log("Fullscreen request failed:", err);
      });
    }

    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => console.log("Exit fullscreen failed:", err));
      }
    };
  }, [isActive]);

  // Detect when user exits fullscreen manually (ESC key on fullscreen)
  useEffect(() => {
    if (!isActive) return;

    const handleFullscreenChange = () => {
      // If no longer in fullscreen and Focus Mode is still active
      if (!document.fullscreenElement && isActive && !showExitConfirm) {
        setShowExitConfirm(true);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [isActive, showExitConfirm]);

  // Detect and warn about tab switching
  useEffect(() => {
    if (!isActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched tabs - show notification
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Focus Mode Active", {
            body: "Stay focused! You switched away from your work.",
            icon: "/icon-192x192.png",
          });
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isActive]);

  const handleClose = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = async () => {
    setShowExitConfirm(false);
    // Exit fullscreen first if still in fullscreen
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch((err) => console.log("Exit fullscreen failed:", err));
    }
    onClose();
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
    // Re-enter fullscreen if user wants to stay
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log("Fullscreen request failed:", err);
      });
    }
  };

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl"
      >
        {/* Background ambient effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-fuchsia-600/10 rounded-full blur-[120px] animate-pulse" />
          <div
            className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-violet-600/10 rounded-full blur-[120px] animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-8">
          {/* Header Controls */}
          <div className="absolute top-8 left-0 right-0 flex justify-between items-center px-8 max-w-6xl mx-auto w-full">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-fuchsia-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                Focus Mode
              </h1>
              {document.fullscreenElement && (
                <span className="text-xs px-2 py-1 bg-fuchsia-500/20 border border-fuchsia-500/30 rounded text-fuchsia-300">
                  Fullscreen
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Ambient Sound Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setAmbientSound(!ambientSound)}
                className="text-gray-400 hover:text-white"
              >
                {ambientSound ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </Button>

              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Main Focus Area */}
          <div className="flex flex-col items-center justify-center gap-8 max-w-2xl w-full">
            {/* Breathing Circle Animation */}
            {showBreathingCircle && (
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-32 h-32 rounded-full bg-gradient-to-r from-fuchsia-500/30 to-violet-500/30 blur-xl"
              />
            )}

            {/* Selected Goal Display */}
            {selectedGoal ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <h2 className="text-4xl font-bold text-white">{selectedGoal.title}</h2>
                {selectedGoal.description && (
                  <p className="text-xl text-gray-400">{selectedGoal.description}</p>
                )}
                <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-fuchsia-500/20 to-violet-500/20 border border-fuchsia-500/30">
                  <span className="text-sm text-fuchsia-300">{selectedGoal.category}</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-4"
              >
                <h2 className="text-4xl font-bold text-white">Focus on your goals</h2>
                <p className="text-xl text-gray-400">
                  Select a goal to begin your focused work session
                </p>
              </motion.div>
            )}

            {/* Goal Selection */}
            {goals.length > 0 && (
              <div className="w-full max-w-md">
                <label className="block text-sm font-medium text-gray-400 mb-2">Working on</label>
                <select
                  value={selectedGoal?._id || ""}
                  onChange={(e) => {
                    const goal = goals.find(
                      (g) => g._id === e.target.value || g.id === e.target.value
                    );
                    setSelectedGoal(goal);
                  }}
                  className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                >
                  <option value="">Select a goal</option>
                  {goals.map((goal) => (
                    <option
                      key={goal._id || goal.id}
                      value={goal._id || goal.id}
                      className="bg-gray-900"
                    >
                      {goal.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Ambient Sound Volume Control */}
            {ambientSound && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full max-w-md"
              >
                <label className="block text-sm font-medium text-gray-400 mb-2">Volume</label>
                <Slider
                  value={[soundVolume]}
                  onValueChange={(value) => setSoundVolume(value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </motion.div>
            )}
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-8 text-center text-gray-500 text-sm">
            <p>
              Press <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700">Esc</kbd>{" "}
              or click the X to exit Focus Mode
            </p>
          </div>
        </div>

        {/* Exit Confirmation Dialog */}
        {showExitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[110]"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111] border border-white/10 p-8 rounded-3xl shadow-2xl text-center max-w-md mx-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <X size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Exit Focus Mode?</h3>
              <p className="text-gray-400 text-sm mb-6">
                You're making progress! Are you sure you want to leave Focus Mode?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelExit}
                  className="flex-1 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Stay Focused
                </button>
                <button
                  onClick={confirmExit}
                  className="flex-1 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-colors border border-white/10"
                >
                  Exit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default FocusMode;
