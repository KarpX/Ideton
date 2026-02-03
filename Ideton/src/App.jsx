import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [notes, setNotes] = useState([]);

  const handleSave = () => {
    if (!content.trim()) return;

    const newNote = {
      id: Date.now(),
      title: title.trim() === "" ? "New note" : title,
      content: content.trim(),
    };

    setNotes([newNote, ...notes]);
    setTitle("");
    setContent("");
  };

  return (
    <>
      <div className="main">
        <h1>IDETON</h1>
        <div className="field">
          <div className="menu-panel">
            <p>menu panel</p>
          </div>
          <div className="note-field">
            {notes.map((note) => (
              <div key={note.id} className="note">
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
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
