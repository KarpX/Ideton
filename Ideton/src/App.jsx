import { useState } from "react";
import { formatDistanceToNow, set } from "date-fns";
import { ru } from "date-fns/locale";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [notes, setNotes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  const createNewNote = () => {
    setIsEditing(true);
    setSelectedNoteId(null);
    setTitle("");
    setContent("");
  };

  const selectNote = (note) => {
    setIsEditing(true);
    setSelectedNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  const deleteNote = (noteId) => {
    setNotes(notes.filter((n) => n.id !== noteId));

    if (selectedNoteId === noteId) {
      setIsEditing(false);
      setSelectedNoteId(null);
      setTitle("");
      setContent("");
    }
  };

  const handleSave = () => {
    if (!content.trim()) {
      setIsEditing(false);
      return;
    }

    if (selectedNoteId) {
      setNotes(
        notes.map((n) =>
          n.id === selectedNoteId
            ? {
                ...n,
                title: title.trim() === "" ? n.title : title,
                content: content.trim(),
                id: Date.now(),
              }
            : n,
        ),
      );
      setIsEditing(false);
    } else {
      const newNote = {
        id: Date.now(),
        title: title.trim() === "" ? "New note" : title,
        content: content.trim(),
      };
      setNotes([newNote, ...notes]);

      setIsEditing(false);
    }
  };

  return (
    <>
      <div className="main">
        <h1>IDETON</h1>
        <div className="field">
          <div className="menu-panel">
            <button className="add-note-btn" onClick={createNewNote}>
              <span>+</span>
            </button>
          </div>
          <div className="note-field">
            {isEditing ? (
              <div className="editor-area">
                <input
                  className="title-input"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                ></input>
                <textarea
                  className="note-text"
                  placeholder="Type here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <div className="button-container">
                  <button
                    className="cancel-button"
                    onClick={() => {
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button className="save-button" onClick={handleSave}>
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="note-list">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="note"
                    onClick={() => selectNote(note)}
                  >
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm("Delete note?")) deleteNote(note.id);
                      }}
                    >
                      🗑
                    </button>
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                    <footer className="note-time">
                      {formatDistanceToNow(new Date(note.id), {
                        addSuffix: true,
                        locale: ru,
                      })}
                    </footer>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
