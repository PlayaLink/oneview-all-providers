import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Note {
  id: string;
  author: string;
  date: string;
  content: string;
  type: "yellow" | "blue";
}

interface NotesProps {
  className?: string;
}

const mockNotes: Note[] = [
  {
    id: "1",
    author: "Becca Fuller",
    date: "10/16/2023 @ 10:30 AM",
    content:
      "Follow-up updated to Fri Sep 29 by Becca Fuller (name@email.com) Giving Jasmine extra time to review and respond to updated itinerary.",
    type: "yellow",
  },
  {
    id: "2",
    author: "Becca Fuller",
    date: "10/16/2023 @ 10:28 AM",
    content:
      "Trip Planning - Adventure Tour Refinement sent to Jasmine Rose (j.rose@email.com), Becca Fuller (b.fuller@email.com)\n\nJasmine, \n\nMade changes to the adventure tour option per our last call. If this looks good please submit the agreement on our website with the deposit and we can officially begin booking.\n\nFor the next step, we will begin contacting accommodations with over estimated numbers, but we will need a final count of travelers as soon as possible. Thank you for your cooperation.\n\nBecca",
    type: "blue",
  },
  {
    id: "3",
    author: "Becca Fuller",
    date: "10/12/2021 @ 3:42 PM",
    content:
      "On Call with Jasmine — Would like to reduce travel time and stay longer at less locations. Liked the adventure option best and wants more information on recommended skill levels and safety precautions used at the cave site. To get more time at Ha Long Bay, but will need aid to try and reduce price on boat.",
    type: "yellow",
  },
];

export const Notes: React.FC<NotesProps> = ({ className }) => {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        author: "Current User",
        date:
          new Date().toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          }) +
          " @ " +
          new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        content: newNoteContent.trim(),
        type: "blue",
      };
      setNotes([newNote, ...notes]);
      setNewNoteContent("");
      setIsAddingNote(false);
    }
  };

  const handleCancelAdd = () => {
    setNewNoteContent("");
    setIsAddingNote(false);
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-[13px] border-b border-gray-200">
        <h3 className="text-[#545454] font-poppins text-base font-bold tracking-[0.5px]">
          Notes
        </h3>
        <div className="flex items-center">
          <button className="flex items-center justify-center w-6 h-6">
            <FontAwesomeIcon
              icon={faArrowDownArrowUp}
              className="w-4 h-4 text-[#212529] opacity-40"
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Notes List */}
        <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
          {notes.map((note) => (
            <div
              key={note.id}
              className={cn(
                "flex flex-col rounded border border-[#EAECEF]",
                note.type === "yellow" ? "bg-[#FBF8E5]" : "bg-[#E8F3FF]",
              )}
            >
              <div className="flex items-start gap-2 p-2">
                <div className="flex-1 flex flex-col gap-[2px]">
                  {/* Header with author and date */}
                  <div className="flex items-start gap-[2px]">
                    <span
                      className={cn(
                        "font-poppins text-[10.5px] font-bold tracking-[0.429px]",
                        note.type === "yellow"
                          ? "text-[#846D42]"
                          : "text-[#44708C]",
                      )}
                    >
                      {note.author}
                    </span>
                    <span className="text-[#212529] font-poppins text-[10.5px] font-medium tracking-[0.429px]">
                      -
                    </span>
                    <span
                      className={cn(
                        "font-poppins text-[10.5px] font-medium tracking-[0.429px]",
                        note.type === "yellow"
                          ? "text-[#846D42]"
                          : "text-[#44708C]",
                      )}
                    >
                      {note.date}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="pt-2 pb-1">
                    <div
                      className={cn(
                        "font-poppins text-xs font-medium tracking-[0.429px] whitespace-pre-wrap",
                        note.type === "yellow"
                          ? "text-[#846D42]"
                          : "text-[#44708C]",
                      )}
                    >
                      {note.content}
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                <div className="flex justify-end items-center">
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="flex items-center justify-center w-[17px] h-[17px] rounded-sm hover:bg-black hover:bg-opacity-5 transition-colors"
                  >
                    <X
                      className={cn(
                        "w-3 h-3",
                        note.type === "yellow"
                          ? "text-[#846D42]"
                          : "text-[#44708C]",
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Note Section */}
        <div className="px-4 pt-3 pb-4 bg-white border-t">
          {!isAddingNote ? (
            <button
              onClick={() => setIsAddingNote(true)}
              className="w-full text-left text-[#BABABA] font-poppins text-xs font-normal tracking-[0.429px] py-2 px-2 border border-gray-300 rounded bg-white hover:border-[#008BC9] transition-colors"
            >
              Add a note...
            </button>
          ) : (
            <div className="space-y-3">
              {/* Textarea */}
              <div className="relative">
                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Leave a note"
                  maxLength={3000}
                  className="w-full h-[136px] p-2 text-xs font-poppins border border-[#008BC9] rounded bg-white outline-none resize-none placeholder:text-[#BABABA] focus:ring-2 focus:ring-blue-200"
                  autoFocus
                />
                {/* Resize indicator */}
                <div className="absolute bottom-1 right-1 w-[6px] h-[6px]">
                  <div className="absolute w-[5px] h-0 border-t border-[#545454] top-[2px] left-[2px]"></div>
                  <div className="absolute w-[8px] h-0 border-t border-[#545454] top-0 left-0"></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <span className="text-[#545454] font-poppins text-xs tracking-[0.429px]">
                  {newNoteContent.length} of 3000
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleCancelAdd}
                    className="px-[14px] py-[6px] text-[#006CAB] font-poppins text-xs font-bold tracking-[0.429px] hover:bg-gray-50 rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddNote}
                    disabled={!newNoteContent.trim()}
                    className="px-[14px] py-[6px] bg-[#79AC48] text-white font-poppins text-xs font-bold tracking-[0.429px] rounded hover:bg-[#6B9A3E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
