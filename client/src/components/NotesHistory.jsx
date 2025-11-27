import { useState, useEffect } from "react";
import axios from "axios";
import { Badge } from "./ui/badge";
import { Calendar, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const NotesHistory = () => {
  const { isGuest } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    if (isGuest) {
      // Load from localStorage
      const storedNotes = localStorage.getItem("guestNotes");
      if (storedNotes) {
        const notes = JSON.parse(storedNotes);
        // Sort by date descending
        notes.sort((a, b) => new Date(b.date) - new Date(a.date));
        setNotes(notes);
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/notes`);
      if (response.data.success) {
        setNotes(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (isGuest) {
      // Delete from localStorage
      const updatedNotes = notes.filter((note) => note.date !== id);
      setNotes(updatedNotes);
      localStorage.setItem("guestNotes", JSON.stringify(updatedNotes));
      toast.success("Note deleted");
      return;
    }

    try {
      const response = await axios.delete(`${API_URL}/notes/${id}`);
      if (response.data.success) {
        setNotes(notes.filter((note) => note._id !== id));
        toast.success("Note deleted");
      }
    } catch (error) {
      toast.error("Failed to delete note");
      console.error("Error deleting note:", error);
    }
  };

  const getMoodColor = (mood) => {
    const colors = {
      great: "bg-green-500",
      good: "bg-blue-500",
      okay: "bg-yellow-500",
      bad: "bg-orange-500",
      terrible: "bg-red-500",
    };
    return colors[mood] || "bg-gray-500";
  };

  const getMoodLabel = (mood) => {
    return mood ? mood.charAt(0).toUpperCase() + mood.slice(1) : "";
  };

  if (loading) {
    return (
      <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8">
        <div className="text-center text-gray-400">Loading notes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Your Journal</h2>
        <p className="text-gray-400">Review your past entries</p>
      </div>

      {notes.length === 0 ? (
        <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl py-16 text-center">
          <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No notes yet</h3>
          <p className="text-gray-400">Start writing daily notes to track your journey</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => {
            const noteId = isGuest ? note.date : note._id;
            return (
              <div
                key={noteId}
                className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 hover:bg-white/10 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white">
                          {format(new Date(note.date), "EEEE, MMMM dd, yyyy")}
                        </h3>
                        {note.mood && (
                          <Badge className={`${getMoodColor(note.mood)} text-white`}>
                            {getMoodLabel(note.mood)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Note?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this journal entry. This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(noteId)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{note.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotesHistory;
