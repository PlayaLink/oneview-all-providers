import React, { useState, useRef, useEffect } from "react";

interface Note {
  id: number;
  text: string;
  createdAt: string;
  author: string;
}

const initialNotes: Note[] = [
  {
    id: 1,
    text: "Follow-up updated to Fri Sep 29 by Becca Fuller (name@email.com) Giving Jasmine extra time to review and respond to updated itinerary.",
    createdAt: "10/16/2023 @ 10:30 AM",
    author: "Becca Fuller",
  },
  {
    id: 2,
    text: `Trip Planning - Adventure Tour Refinement sent to Jasmine Rose (j.rose@email.com), Becca Fuller (b.fuller@email.com)\n\nJasmine,\n\nMade changes to the adventure tour option per our last call. If this looks good please submit the agreement on our website with the deposit and we can officially begin booking.\n\nFor the next step, we will begin contacting accommodations with over estimated numbers, but we will need a final count of travelers as soon as possible. Thank you for your cooperation.\n\nBecca`,
    createdAt: "10/16/2023 @ 10:28 AM",
    author: "Becca Fuller",
  },
];

const MAX_LENGTH = 3000;

const Notes: React.FC<{ className?: string }> = ({ className }) => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  // When focused, scroll input into view
  useEffect(() => {
    if (focused && inputRef.current) {
      inputRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [focused]);

  const handleAddNote = () => {
    if (input.trim()) {
      setNotes([
        {
          id: Date.now(),
          text: input.trim(),
          createdAt: new Date().toLocaleString(),
          author: "Becca Fuller",
        },
        ...notes,
      ]);
      setInput("");
      setFocused(false);
    }
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <div className={`relative flex-1 min-h-0 ${className || ""}`}>  
      {/* Notes List */}
      <div className="absolute inset-0 pb-[120px] overflow-y-auto pr-1">
        {notes.length === 0 ? (
          <div className="text-gray-400 text-sm">No notes yet.</div>
        ) : (
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
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-lg font-bold focus:outline-none"
                  onClick={() => handleDeleteNote(note.id)}
                  aria-label="Delete note"
                  tabIndex={0}
                >
                  ×
                </button>
                <div className="text-sm font-bold mb-1 text-gray-700">
                  {note.author} - <span className="font-normal text-xs">{note.createdAt}</span>
                </div>
                <div className="text-sm text-gray-800 whitespace-pre-line">{note.text}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Add Note Input - absolutely positioned at bottom */}
      <div
        className={`absolute left-0 right-0 bottom-0 bg-white border-t border-gray-200 pt-4 z-20 transition-all duration-200`}
        style={{ minHeight: focused ? 170 : 40 }}
      >
        <div className="flex flex-col">
          {focused ? (
            <>
              <div className="relative">
                <textarea
                  ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                  className="w-full h-full border-2 border-blue-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[100px] resize-none placeholder-gray-400"
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
                    className="text-blue-600 text-base font-medium hover:underline"
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

export default Notes; 