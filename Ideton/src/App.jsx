import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [notes, setNotes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  const [folderName, setFolderName] = useState("");
  const [folders, setFolders] = useState([
    {
      id: 1,
      folderName: "All",
      color: 1,
    },
  ]);
  const [isEditingFolder, setIsEditingFolder] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(1);

  const [longPressTimeout, setLongPressTimeout] = useState(null);
  const [folderToEdit, setFolderToEdit] = useState(null);

  const [folderIcons, setFolderIcons] = useState([
    { id: 1, color: "currentColor" },
    { id: 2, color: "red" },
    { id: 3, color: "blue" },
    { id: 4, color: "green" },
    { id: 5, color: "purple" },
    { id: 6, color: "pink" },
    { id: 7, color: "gray" },
    { id: 8, color: "orange" },
  ]);
  const [selectedFolderIcon, setSelectedFolderIcon] = useState("currentColor");

  const deleteFolder = (folderId) => {
    if (folderId === 1) return;

    if (window.confirm("Delete folder and all it's notes?")) {
      setFolders(folders.filter((f) => f.id !== folderId));
      setNotes(notes.filter((n) => n.folderId !== folderId));
      setSelectedFolderId(1);
      setIsEditingFolder(false);
      setFolderToEdit(null);
      setSelectedFolderIcon("currentColor");
    }
  };

  const createNewFolder = () => {
    setIsEditingFolder(true);
    setFolderName("");
  };

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

  const saveFolder = () => {
    if (!folderName.trim()) {
      console.log(folderName.trim());
      setIsEditingFolder(false);
      return;
    }

    if (folderToEdit) {
      setFolders(
        folders.map((f) =>
          f.id === folderToEdit.id
            ? { ...f, folderName: folderName.trim() }
            : f,
        ),
      );
    } else {
      const newFolder = {
        id: Date.now(),
        folderName: folderName.trim(),
        folderColor: selectedFolderIcon,
      };

      setFolders([...folders, newFolder]);
    }

    setIsEditingFolder(false);
    setFolderToEdit(null);
    setFolderName("");
    setSelectedFolderIcon("currentColor");
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
        folderId: selectedFolderId,
      };
      setNotes([newNote, ...notes]);

      setIsEditing(false);
    }
  };

  const filtredNotes =
    selectedFolderId === 1
      ? notes
      : notes.filter((n) => n.folderId === selectedFolderId);

  return (
    <>
      <div className="main">
        <h1>IDETON</h1>
        <div className="field">
          <div className="menu-panel">
            <button className="add-note-btn" onClick={createNewNote}>
              <span>+</span>
            </button>
            <button className="create-folder-btn" onClick={createNewFolder}>
              <span>New folder</span>
            </button>
            <div className="folders-list">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className={`folder ${selectedFolderId === folder.id ? "selected" : ""}`}
                  onClick={() => setSelectedFolderId(folder.id)}
                  onMouseDown={() => {
                    const timeout = setTimeout(() => {
                      if (folder.id !== 1) {
                        setFolderToEdit(folder);
                        setFolderName(folder.folderName);
                        setIsEditingFolder(true);
                      }
                    }, 600);
                    setLongPressTimeout(timeout);
                  }}
                  onMouseUp={() => {
                    clearTimeout(longPressTimeout);
                  }}
                  onMouseLeave={() => {
                    clearTimeout(longPressTimeout);
                  }}
                >
                  <svg
                    width="35"
                    height="35"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={folder.folderColor || "currentColor"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="folder-icon"
                  >
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <p>{folder.folderName}</p>
                </div>
              ))}
            </div>
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
                {filtredNotes.map((note) => (
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

      {isEditingFolder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>New Folder</h3>
            <input
              type="text"
              name="folder-name-input"
              placeholder="Enter a folder's name..."
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              autoFocus
              aria-label="Enter folder's name"
            ></input>
            <div className="folder-icons">
              {folderIcons.map((color) => (
                <div
                  key={color.id}
                  className={`icon-circle ${selectedFolderIcon === color.color ? "selected" : ""}`}
                  onClick={() => setSelectedFolderIcon(color.color)}
                >
                  <svg
                    width="50"
                    height="50"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={color.color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="folder-icon"
                  >
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
              ))}
            </div>
            {folderToEdit ? (
              <div className="modal-buttons">
                <button
                  onClick={() => deleteFolder(folderToEdit.id)}
                  className="cancel-btn"
                >
                  Delete
                </button>
                <button onClick={saveFolder} className="save-btn">
                  Rename
                </button>
              </div>
            ) : (
              <div className="modal-buttons">
                <button
                  onClick={() => setIsEditingFolder(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button onClick={saveFolder} className="save-btn">
                  Create
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
