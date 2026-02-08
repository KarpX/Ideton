import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

const parseDate = (createdAt) => {
  if (!createdAt) return new Date();

  if (createdAt.seconds) {
    return new Date(createdAt.seconds * 1000);
  }

  const date = new Date(createdAt);

  return isNaN(date.getTime()) ? new Date() : date;
};

const NotesList = ({
  filtredNotes,
  popoverNote,
  selectNote,
  deleteNote,
  setPopoverNote,
}) => {
  return (
    <div className="note-list">
      {filtredNotes.map((note) => (
        <div
          key={note.id}
          className={`note ${popoverNote?.note.id === note.id ? "active-popover" : ""}`}
          onClick={() => selectNote(note)}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData("noteId", note.id);

            const dragIcon = document.createElement("div");
            dragIcon.innerText =
              note.title.substring(0, 10) +
              `${note.title.length > 10 ? "..." : ""}`;
            dragIcon.style.width = "100px";
            dragIcon.style.height = "150px";
            dragIcon.style.background = "var(--primary-color)";
            dragIcon.style.color = "var(--onPrimary-color)";
            dragIcon.style.borderRadius = "8px";
            dragIcon.style.display = "flex";
            dragIcon.style.alignItems = "center";
            dragIcon.style.justifyContent = "center";
            dragIcon.style.position = "absolute";
            dragIcon.style.top = "-1000px";
            dragIcon.style.textOverflow = "ellipsis";
            dragIcon.style.fontSize = "0.8rem";
            dragIcon.style.whiteSpace = "nowrap";

            document.body.appendChild(dragIcon);

            e.dataTransfer.setDragImage(dragIcon, 60, 20);
            setTimeout(() => document.body.removeChild(dragIcon), 0);
          }}
          onDragEnd={(e) => {
            e.currentTarget.classList.remove("dragging");
          }}
        >
          <button
            className="delete-btn on-note-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm("Delete note?")) deleteNote(note.id);
            }}
          >
            🗑
          </button>
          <button
            className="folder-btn on-note-btn"
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              setPopoverNote({
                note: note,
                x: rect.left,
                y: rect.bottom + window.scrollY,
              });
            }}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="folder-icon"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          <footer className="note-time">
            {formatDistanceToNow(parseDate(note.updatedAt), {
              addSuffix: true,
            })}
          </footer>
        </div>
      ))}
    </div>
  );
};

export default NotesList;
