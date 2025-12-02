import { useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Keyboard } from "lucide-react";

const shortcuts = [
  {
    category: "General",
    items: [
      { keys: ["⌘", "K"], windows: ["Ctrl", "K"], description: "Open Command Palette" },
      { keys: ["⌘", "?"], windows: ["Ctrl", "?"], description: "Show Keyboard Shortcuts" },
      { keys: ["Esc"], description: "Close Dialog/Modal" },
    ],
  },
  {
    category: "Goals",
    items: [
      { keys: ["⌘", "N"], windows: ["Ctrl", "N"], description: "Create New Goal" },
      { keys: ["⌘", "/"], windows: ["Ctrl", "/"], description: "Search Goals" },
      { keys: ["Ctrl", "↵"], description: "Quick Complete" },
      { keys: ["⌘", "E"], windows: ["Ctrl", "E"], description: "Edit Selected Goal" },
    ],
  },
  {
    category: "Navigation",
    items: [
      { keys: ["G", "D"], description: "Go to Dashboard" },
      { keys: ["G", "C"], description: "Go to Calendar" },
      { keys: ["G", "N"], description: "Go to Notes" },
      { keys: ["G", "P"], description: "Go to Profile" },
    ],
  },
  {
    category: "Focus",
    items: [
      {
        keys: ["⌘", "Shift", "F"],
        windows: ["Ctrl", "Shift", "F"],
        description: "Toggle Focus Mode",
      },
      {
        keys: ["⌘", "Shift", "P"],
        windows: ["Ctrl", "Shift", "P"],
        description: "Open Zen Mode (Pomodoro)",
      },
    ],
  },
];

function KeyboardShortcuts({ isOpen, onOpenChange }) {
  const isMac =
    typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-black/95 border border-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <div className="relative z-10 max-h-[calc(80vh-4rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Keyboard className="w-6 h-6" />
              Keyboard Shortcuts
            </DialogTitle>
            <DialogDescription>Use these shortcuts to navigate Resync faster</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {shortcuts.map((section) => (
              <div key={section.category}>
                <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                  {section.category}
                </h3>
                <div className="space-y-2">
                  {section.items.map((shortcut, idx) => {
                    const keys = isMac ? shortcut.keys : shortcut.windows || shortcut.keys;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <span className="text-gray-300">{shortcut.description}</span>
                        <div className="flex gap-1">
                          {keys.map((key, keyIdx) => (
                            <kbd
                              key={keyIdx}
                              className="px-2 py-1 text-xs font-semibold text-white bg-gray-800 border border-gray-700 rounded shadow-sm"
                            >
                              {key}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800 text-xs text-gray-500 text-center">
            Press{" "}
            <kbd className="px-1.5 py-0.5 text-xs bg-gray-800 border border-gray-700 rounded">
              Esc
            </kbd>{" "}
            to close
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook to manage global keyboard shortcuts
export function useKeyboardShortcuts({
  onCommandPalette,
  onNewGoal,
  onSearch,
  onQuickComplete,
  onEditGoal,
  onFocusMode,
  onPomodoro,
  onShowHelp,
  onNavigate,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Command Palette (⌘K or Ctrl+K)
      if (e.key === "k" && modifier) {
        e.preventDefault();
        onCommandPalette?.();
        return;
      }

      // Help (⌘? or Ctrl+?)
      if (e.key === "?" && modifier) {
        e.preventDefault();
        onShowHelp?.();
        return;
      }

      // New Goal (⌘N or Ctrl+N)
      if (e.key === "n" && modifier && !e.shiftKey) {
        e.preventDefault();
        onNewGoal?.();
        return;
      }

      // Search (⌘/ or Ctrl+/)
      if (e.key === "/" && modifier) {
        e.preventDefault();
        onSearch?.();
        return;
      }

      // Quick Complete (Ctrl+Enter)
      if (e.key === "Enter" && e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        onQuickComplete?.();
        return;
      }

      // Edit Goal (⌘E or Ctrl+E)
      if (e.key === "e" && modifier) {
        e.preventDefault();
        onEditGoal?.();
        return;
      }

      // Focus Mode (⌘Shift+F or Ctrl+Shift+F)
      if (e.key === "f" && modifier && e.shiftKey) {
        e.preventDefault();
        onFocusMode?.();
        return;
      }

      // Pomodoro (⌘Shift+P or Ctrl+Shift+P)
      if (e.key === "p" && modifier && e.shiftKey) {
        e.preventDefault();
        onPomodoro?.();
        return;
      }

      // Navigation shortcuts (G + letter)
      if (e.key.toLowerCase() === "g" && !modifier && !e.shiftKey && !e.altKey) {
        const nextKey = () => {
          return new Promise((resolve) => {
            const handler = (event) => {
              document.removeEventListener("keydown", handler);
              resolve(event.key.toLowerCase());
            };
            document.addEventListener("keydown", handler, { once: true });
            setTimeout(() => resolve(null), 2000); // Timeout after 2 seconds
          });
        };

        nextKey().then((key) => {
          switch (key) {
            case "d":
              onNavigate?.("dashboard");
              break;
            case "c":
              onNavigate?.("calendar");
              break;
            case "n":
              onNavigate?.("notes");
              break;
            case "p":
              onNavigate?.("profile");
              break;
          }
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    onCommandPalette,
    onNewGoal,
    onSearch,
    onQuickComplete,
    onEditGoal,
    onFocusMode,
    onPomodoro,
    onShowHelp,
    onNavigate,
  ]);
}

export default KeyboardShortcuts;
