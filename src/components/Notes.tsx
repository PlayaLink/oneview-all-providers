import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import { fetchNotes, addNote, updateNote, deleteNote } from "@/lib/supabaseClient";
import dayjs from 'dayjs';

interface Note {
  id: number;
  text: string;
  created_at: string;
  author: string;
}

interface NotesProps {
  recordId: string;
  recordType: string;
  user: any; // Supabase user object
  className?: string;
}

const MAX_LENGTH = 3000;

function getDisplayName(author: string) {
  // If it's an email, show the part before the @ as a fallback
  if (author && author.includes('@')) {
    return author.split('@')[0];
  }
  return author;
}

function formatNoteDate(dateString: string) {
  // Format as MM/DD/YYYY @ HH:MM AM/PM
  const d = dayjs(dateString);
  return d.isValid() ? d.format('MM/DD/YYYY @ hh:mm A') : dateString;
}

const Notes: React.FC<NotesProps> = ({ recordId, recordType, user, className }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  // Fetch notes from Supabase
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    fetchNotes(recordId, recordType)
      .then((data) => {
        if (mounted) setNotes(data || []);
      })
      .catch((err) => {
        if (mounted) setError("Failed to load notes");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [recordId, recordType]);

  // When focused, scroll input into view
  useEffect(() => {
    if (focused && inputRef.current) {
      inputRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [focused]);

  const handleAddNote = async () => {
    if (input.trim()) {
      setLoading(true);
      setError(null);
      try {
        const author = user?.user_metadata?.full_name || user?.email || "Unknown";
        const newNote = await addNote({
          recordId,
          recordType,
          text: input.trim(),
          author,
        });
        setNotes([newNote, ...notes]);
        setInput("");
        setFocused(false);
      } catch (err) {
        setError("Failed to add note");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteNote = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteNote(String(id));
      setNotes(notes.filter((note) => note.id !== id));
      setMenuOpenId(null);
    } catch (err) {
      setError("Failed to delete note");
    } finally {
      setLoading(false);
    }
  };

  const handleEditNote = (id: number) => {
    setMenuOpenId(null);
    const note = notes.find(n => n.id === id);
    if (note) {
      setEditingId(id);
      setEditValue(note.text);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    setLoading(true);
    setError(null);
    try {
      const updated = await updateNote(String(editingId), { text: editValue });
      setNotes(notes.map(n => n.id === editingId ? { ...n, text: updated.text } : n));
      setEditingId(null);
      setEditValue("");
    } catch (err) {
      setError("Failed to update note");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  // Close menu on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.note-menu')) {
        setMenuOpenId(null);
      }
    };
    if (menuOpenId !== null) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [menuOpenId]);

  return (
    <div className={`relative flex-1 min-h-0 ${className || ""}`}>  
      {/* Notes List */}
      <div className="absolute inset-0 pb-[120px] overflow-y-auto pr-1">
        {loading && <div className="text-center py-8">Loading notes...</div>}
        {error && <div className="text-center py-8 text-red-500">{error}</div>}
        {!loading && !error && notes.length === 0 && (
          <div className="text-gray-400 text-sm">No notes yet.</div>
        )}
        {!loading && !error && notes.length > 0 && (
          <ul className="space-y-3">
            {notes.map((note, idx) => (
              <li
                key={note.id}
                className={`relative rounded p-3 border flex flex-col ${
                  idx % 2 === 0
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                {/* Ellipsis menu */}
                <div className="absolute top-2 right-2 note-menu">
                  <button
                    className="text-gray-400 hover:text-gray-600 text-lg font-bold focus:outline-none"
                    onClick={() => setMenuOpenId(note.id)}
                    aria-label="Open note menu"
                    tabIndex={0}
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  {menuOpenId === note.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-30">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => handleEditNote(note.id)}
                      >
                        Edit Note
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        Delete Note
                      </button>
                    </div>
                  )}
                </div>
                <div className="text-sm font-bold mb-1 text-gray-700">
                  {getDisplayName(typeof note.author === 'string' ? note.author : String(note.author))} - <span className="font-normal text-xs">{formatNoteDate(String(note.created_at))}</span>
                </div>
                {editingId === note.id ? (
                  <div className="flex flex-col gap-2 mt-1">
                    <textarea
                      className="w-full border-2 border-blue-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[80px] resize-none placeholder-gray-400"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      maxLength={MAX_LENGTH}
                      autoFocus
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        className="text-gray-500 text-base font-medium hover:text-gray-700"
                        onClick={handleCancelEdit}
                        type="button"
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-[#79AC48] hover:bg-[#6B9A3F] text-white px-4 py-2 rounded text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSaveEdit}
                        disabled={!editValue.trim()}
                        type="button"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-800 whitespace-pre-line">{String(note.text)}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Add Note Input - absolutely positioned at bottom */}
      <div
        className={`absolute left-0 right-0 bottom-0 bg-white border-t border-gray-200 p-4 z-20 transition-all duration-200`}
        style={{ minHeight: focused ? 170 : 40 }}
      >
        <div className="flex flex-col gap-2">
          {focused ? (
            <>
              <div className="relative">
                <textarea
                  ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                  className="w-full border-2 border-blue-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[100px] resize-none placeholder-gray-400"
                  placeholder="Add a note"
                  value={input}
                  onChange={e => {
                    if (e.target.value.length <= MAX_LENGTH) setInput(e.target.value);
                  }}
                  onBlur={() => setFocused(input.length > 0)}
                  autoFocus
                  maxLength={MAX_LENGTH}
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-600 select-none ml-1">{input.length} of {MAX_LENGTH}</span>
                <div className="flex gap-4">
                  <button
                    className="text-gray-500 text-base font-medium hover:text-gray-700"
                    onClick={() => { setInput(""); setFocused(false); }}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-[#79AC48] hover:bg-[#6B9A3F] text-white px-6 py-2 rounded text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleAddNote}
                    disabled={!input.trim()}
                    type="button"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </>
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder-gray-400"
              placeholder="Add a note"
              value={input}
              onFocus={() => setFocused(true)}
              readOnly
            />
          )}
        </div>
      </div>
    </div>
  );
};

export const notesTab = {
  id: 'notes',
  label: 'Notes',
  icon: 'file-medical',
  enabled: true,
  Component: Notes,
}; 