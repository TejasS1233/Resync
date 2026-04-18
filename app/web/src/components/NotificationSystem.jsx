import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell, BellOff, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

// Notification types
export const NOTIFICATION_TYPES = {
  GOAL_REMINDER: "goal_reminder",
  DAILY_JOURNAL: "daily_journal",
  STREAK_MILESTONE: "streak_milestone",
  GOAL_COMPLETED: "goal_completed",
  WEEKLY_SUMMARY: "weekly_summary",
};

// Default notification settings
const DEFAULT_SETTINGS = {
  enabled: true,
  goalReminders: true,
  dailyJournal: true,
  streakMilestones: true,
  goalCompleted: true,
  weeklySummary: true,
  reminderTime: "09:00",
  journalReminderTime: "20:00",
  sound: true,
};

export function useNotifications() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("notificationSettings");
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [permission, setPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );

  // Re-check permission periodically to update UI
  useEffect(() => {
    const checkPermission = () => {
      if (typeof Notification !== "undefined") {
        setPermission(Notification.permission);
      }
    };

    checkPermission();
    const interval = setInterval(checkPermission, 1000);

    return () => clearInterval(interval);
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("notificationSettings", JSON.stringify(settings));
  }, [settings]);

  // Request notification permission
  const requestPermission = async () => {
    if (typeof Notification === "undefined") {
      toast.error("Notifications not supported in this browser");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === "granted";
    }

    return false;
  };

  // Show browser notification
  const showNotification = (title, options = {}) => {
    if (!settings.enabled || permission !== "granted") {
      toast.error("Notifications are not enabled");
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: "/icon-192x192.png",
        badge: "/icon-192x192.png",
        vibrate: [200, 100, 200],
        requireInteraction: false,
        silent: false,
        ...options,
      });

      // Log for debugging
      console.log("Notification created:", notification);

      // Play sound if enabled
      if (settings.sound) {
        const audio = new Audio("/notification.mp3");
        audio.play().catch((err) => console.log("Audio play failed:", err));
      }

      // Auto-close after 5 seconds if not requiring interaction
      if (!options.requireInteraction) {
        setTimeout(() => notification.close(), 5000);
      }

      return notification;
    } catch (err) {
      console.error("Notification error:", err);
      toast.error("Failed to show notification");
    }
  };

  // Schedule daily reminders
  useEffect(() => {
    if (!settings.enabled) return;

    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

      // Goal reminder
      if (settings.goalReminders && currentTime === settings.reminderTime) {
        showNotification("Time to check your goals!", {
          body: "Review your progress and complete today's goals.",
          tag: "goal-reminder",
        });
      }

      // Journal reminder
      if (settings.dailyJournal && currentTime === settings.journalReminderTime) {
        showNotification("Daily Journal Reminder", {
          body: "Take a moment to reflect on your day.",
          tag: "journal-reminder",
        });
      }
    };

    // Check every minute
    const interval = setInterval(checkReminders, 60000);
    checkReminders(); // Check immediately

    return () => clearInterval(interval);
  }, [settings]);

  return {
    settings,
    setSettings,
    permission,
    requestPermission,
    showNotification,
  };
}

// Notification Settings Component
export function NotificationSettings({ isOpen, onClose }) {
  const { settings, setSettings, permission, requestPermission, showNotification } =
    useNotifications();

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      setSettings({ ...settings, enabled: true });
      toast.success("Notifications enabled!");
    } else {
      toast.error("Notification permission denied");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-black/95 border border-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 -z-10"></div>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Settings
          </DialogTitle>
          <DialogDescription>Manage your notification preferences</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Permission Status */}
          {permission !== "granted" && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-sm text-yellow-300 mb-3">
                Notifications are not enabled. Click below to enable browser notifications.
              </p>
              <Button
                onClick={handleEnableNotifications}
                className="w-full bg-gradient-to-r from-fuchsia-500 to-violet-500"
              >
                Enable Notifications
              </Button>
            </div>
          )}

          {/* Main Toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium text-white">Enable Notifications</div>
              <div className="text-sm text-gray-400">Turn all notifications on/off</div>
            </div>
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
              disabled={permission !== "granted"}
              className="w-4 h-4"
            />
          </div>

          {/* Individual Settings */}
          {settings.enabled && permission === "granted" && (
            <>
              <div className="space-y-4 pt-4 border-t border-gray-800">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-sm font-medium text-white">Goal Reminders</div>
                    <div className="text-xs text-gray-400">Daily reminder to check goals</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.goalReminders}
                    onChange={(e) => setSettings({ ...settings, goalReminders: e.target.checked })}
                    className="w-4 h-4"
                  />
                </div>

                {settings.goalReminders && (
                  <div className="ml-4">
                    <label className="text-xs text-gray-400 mb-1 block">Reminder Time</label>
                    <input
                      type="time"
                      value={settings.reminderTime}
                      onChange={(e) => setSettings({ ...settings, reminderTime: e.target.value })}
                      className="px-3 py-2 bg-white/5 border border-gray-700 rounded text-white text-sm"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-sm font-medium text-white">Daily Journal</div>
                    <div className="text-xs text-gray-400">Evening reminder to journal</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.dailyJournal}
                    onChange={(e) => setSettings({ ...settings, dailyJournal: e.target.checked })}
                    className="w-4 h-4"
                  />
                </div>

                {settings.dailyJournal && (
                  <div className="ml-4">
                    <label className="text-xs text-gray-400 mb-1 block">
                      Journal Reminder Time
                    </label>
                    <input
                      type="time"
                      value={settings.journalReminderTime}
                      onChange={(e) =>
                        setSettings({ ...settings, journalReminderTime: e.target.value })
                      }
                      className="px-3 py-2 bg-white/5 border border-gray-700 rounded text-white text-sm"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-sm font-medium text-white">Streak Milestones</div>
                    <div className="text-xs text-gray-400">Celebrate streak achievements</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.streakMilestones}
                    onChange={(e) =>
                      setSettings({ ...settings, streakMilestones: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-sm font-medium text-white">Goal Completed</div>
                    <div className="text-xs text-gray-400">Notify when goals are completed</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.goalCompleted}
                    onChange={(e) => setSettings({ ...settings, goalCompleted: e.target.checked })}
                    className="w-4 h-4"
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-sm font-medium text-white">Weekly Summary</div>
                    <div className="text-xs text-gray-400">Sunday evening progress recap</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.weeklySummary}
                    onChange={(e) => setSettings({ ...settings, weeklySummary: e.target.checked })}
                    className="w-4 h-4"
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-sm font-medium text-white">Notification Sound</div>
                    <div className="text-xs text-gray-400">Play sound with notifications</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.sound}
                    onChange={(e) => setSettings({ ...settings, sound: e.target.checked })}
                    className="w-4 h-4"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2 pt-4 border-t border-gray-800">
          <Button onClick={onClose} variant="outline" className="flex-1 border-gray-700">
            Close
          </Button>
          <Button
            onClick={() => {
              toast.success("Notification settings saved!");
              onClose();
            }}
            className="flex-1 bg-gradient-to-r from-fuchsia-500 to-violet-500"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Notification Button Component for Navbar
export function NotificationButton({ onClick }) {
  const { permission, settings } = useNotifications();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="relative text-gray-400 hover:text-white"
    >
      {settings.enabled && permission === "granted" ? (
        <Bell className="w-5 h-5" />
      ) : (
        <BellOff className="w-5 h-5" />
      )}
      {permission !== "granted" && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      )}
    </Button>
  );
}

export default NotificationSettings;
