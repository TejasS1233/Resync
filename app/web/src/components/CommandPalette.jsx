import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import {
  Target,
  Plus,
  Calendar,
  BookOpen,
  User,
  Search,
  Check,
  TrendingUp,
  Moon,
  Sun,
  LogOut,
  Home,
  Sparkles,
} from "lucide-react";

export function CommandPalette({
  goals = [],
  notes = [],
  onCreateGoal,
  onCompleteGoal,
  onWriteNote,
  onEnterZenMode,
  onLogout,
  isOpen,
  onOpenChange,
}) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Handle keyboard shortcuts
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!isOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, onOpenChange]);

  // Navigation actions
  const navigationItems = [
    {
      icon: Home,
      label: "Go to Landing",
      action: () => navigate("/"),
      keywords: ["home", "landing", "start"],
    },
    {
      icon: Target,
      label: "Go to Dashboard",
      action: () => navigate("/dashboard"),
      keywords: ["dashboard", "goals", "main"],
    },
    {
      icon: Calendar,
      label: "View Calendar",
      action: () => {
        navigate("/dashboard");
        // Switch to calendar tab (you'll need to implement tab switching)
      },
      keywords: ["calendar", "date", "month"],
    },
    {
      icon: BookOpen,
      label: "View Notes",
      action: () => {
        navigate("/dashboard");
        // Switch to notes tab
      },
      keywords: ["notes", "journal", "diary"],
    },
    {
      icon: User,
      label: "View Profile",
      action: () => {
        navigate("/dashboard");
        // Switch to profile tab
      },
      keywords: ["profile", "stats", "account"],
    },
  ];

  // Quick actions
  const quickActions = [
    {
      icon: Plus,
      label: "Create New Goal",
      action: () => {
        onOpenChange(false);
        onCreateGoal?.();
      },
      keywords: ["create", "new", "add", "goal"],
    },
    {
      icon: BookOpen,
      label: "Write Daily Note",
      action: () => {
        onOpenChange(false);
        onWriteNote?.();
      },
      keywords: ["write", "note", "journal", "diary", "daily"],
    },
    {
      icon: Sparkles,
      label: "Enter Zen Mode",
      action: () => {
        onOpenChange(false);
        onEnterZenMode?.();
      },
      keywords: ["zen", "focus", "pomodoro", "timer", "concentrate"],
    },
    {
      icon: Check,
      label: "Quick Complete",
      action: () => {
        // Show goals to complete
      },
      keywords: ["complete", "done", "finish", "mark"],
    },
    {
      icon: LogOut,
      label: "Logout",
      action: () => {
        onOpenChange(false);
        onLogout?.();
      },
      keywords: ["logout", "sign out", "exit"],
    },
  ];

  // Filter goals based on search
  const filteredGoals = useMemo(() => {
    if (!search) return [];
    const searchLower = search.toLowerCase();
    return goals
      .filter(
        (goal) =>
          goal.title?.toLowerCase().includes(searchLower) ||
          goal.description?.toLowerCase().includes(searchLower) ||
          goal.category?.toLowerCase().includes(searchLower)
      )
      .slice(0, 5);
  }, [goals, search]);

  // Filter notes based on search
  const filteredNotes = useMemo(() => {
    if (!search) return [];
    const searchLower = search.toLowerCase();
    return notes
      .filter(
        (note) =>
          note.content?.toLowerCase().includes(searchLower) ||
          note.mood?.toLowerCase().includes(searchLower)
      )
      .slice(0, 5);
  }, [notes, search]);

  const handleSelect = useCallback(
    (callback) => {
      // Execute callback immediately
      if (typeof callback === "function") {
        callback();
      }
      // Close dialog after callback
      setTimeout(() => {
        onOpenChange(false);
      }, 50);
    },
    [onOpenChange]
  );

  return (
    <CommandDialog open={isOpen} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Type a command or search..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Quick Actions */}
        <CommandGroup heading="Quick Actions">
          {quickActions.map((item, index) => (
            <CommandItem
              key={index}
              onSelect={() => handleSelect(item.action)}
              className="cursor-pointer"
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Navigation */}
        <CommandGroup heading="Navigation">
          {navigationItems.map((item, index) => (
            <CommandItem
              key={index}
              onSelect={() => handleSelect(item.action)}
              className="cursor-pointer"
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        {/* Goals Search Results */}
        {filteredGoals.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Goals">
              {filteredGoals.map((goal) => (
                <CommandItem
                  key={goal._id || goal.id}
                  onSelect={() =>
                    handleSelect(() => {
                      navigate("/dashboard");
                      // You can scroll to the goal or highlight it
                    })
                  }
                  className="cursor-pointer"
                >
                  <Target className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{goal.title}</span>
                    <span className="text-xs text-gray-400">{goal.category}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Notes Search Results */}
        {filteredNotes.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Notes">
              {filteredNotes.map((note) => (
                <CommandItem
                  key={note._id || note.id}
                  onSelect={() =>
                    handleSelect(() => {
                      navigate("/dashboard");
                      // Switch to notes tab
                    })
                  }
                  className="cursor-pointer"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="truncate max-w-md">{note.content.slice(0, 60)}...</span>
                    <span className="text-xs text-gray-400">
                      {note.mood} • {new Date(note.date).toLocaleDateString()}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}

export default CommandPalette;
