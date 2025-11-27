import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar, BookOpen, Save } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const DailyNote = () => {
  const { isGuest } = useAuth();

  // Helper to get local date string in YYYY-MM-DD format
  const getLocalDateString = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [note, setNote] = useState({
    content: "",
    mood: "",
    date: getLocalDateString(),
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTodayNote();
  }, []);

  const fetchTodayNote = async () => {
    if (isGuest) {
      // Load from localStorage
      const storedNotes = localStorage.getItem("guestNotes");
      if (storedNotes) {
        const notes = JSON.parse(storedNotes);
        const todayNote = notes.find((n) => n.date === note.date);
        if (todayNote) {
          setNote(todayNote);
        }
      }
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/notes/${note.date}`);
      if (response.data.success && response.data.data) {
        setNote({
          content: response.data.data.content || "",
          mood: response.data.data.mood || "",
          date: note.date,
        });
      }
    } catch (error) {
      console.error("Error fetching note:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!note.content.trim()) {
      toast.error("Please write something first");
      return;
    }

    if (isGuest) {
      // Save to localStorage
      const storedNotes = localStorage.getItem("guestNotes");
      const notes = storedNotes ? JSON.parse(storedNotes) : [];
      const existingIndex = notes.findIndex((n) => n.date === note.date);

      if (existingIndex >= 0) {
        notes[existingIndex] = note;
      } else {
        notes.push(note);
      }

      localStorage.setItem("guestNotes", JSON.stringify(notes));
      toast.success("Note saved!");
      return;
    }

    setSaving(true);
    try {
      const response = await axios.post(`${API_URL}/notes`, note);
      if (response.data.success) {
        toast.success("Note saved!");
      }
    } catch (error) {
      toast.error("Failed to save note");
      console.error("Error saving note:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-400" />
            <h3 className="text-2xl font-bold text-white">Today's Journal</h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="h-4 w-4" />
            {format(new Date(), "MMM dd, yyyy")}
          </div>
        </div>
        <p className="text-sm text-gray-400">
          Write down what you accomplished today and how you're feeling
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mood">How are you feeling?</Label>
          <Select value={note.mood} onValueChange={(value) => setNote({ ...note, mood: value })}>
            <SelectTrigger id="mood">
              <SelectValue placeholder="Select your mood" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="great">Great</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="okay">Okay</SelectItem>
              <SelectItem value="bad">Bad</SelectItem>
              <SelectItem value="terrible">Terrible</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">What did you do today?</Label>
          <Textarea
            id="content"
            placeholder="Write about your day, what you accomplished, challenges you faced, or anything on your mind..."
            value={note.content}
            onChange={(e) => setNote({ ...note, content: e.target.value })}
            rows={6}
            className="resize-none"
          />
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Note"}
        </Button>
      </div>
    </div>
  );
};

export default DailyNote;
