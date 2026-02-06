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

  const [popoverNote, setPopoverNote] = useState(null);

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

  const [noteToMoveAfterFolderCreate, setNoteToMoveAfterFolderCreate] =
    useState(null);

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
      setIsEditingFolder(false);
      setNoteToMoveAfterFolderCreate(null);
      return;
    }

    const newFolderId = Date.now();

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
        id: newFolderId,
        folderName: folderName.trim(),
        folderColor: selectedFolderIcon,
      };

      setFolders([...folders, newFolder]);
    }

    setIsEditingFolder(false);
    setFolderToEdit(null);
    setFolderName("");
    setSelectedFolderIcon("currentColor");
    setNoteToMoveAfterFolderCreate(null);
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

  const moveNoteToFolder = (noteId, newFolderId) => {
    setNotes(
      notes.map((n) =>
        n.id === noteId
          ? { ...n, folderId: n.folderId === newFolderId ? 1 : newFolderId }
          : n,
      ),
    );
    setPopoverNote(null);
  };

  const moveNoteToFolderHandle = (noteId, newFolderId) => {
    setNotes(
      notes.map((n) =>
        n.id === noteId ? { ...n, folderId: (n.folderId = newFolderId) } : n,
      ),
    );
    setPopoverNote(null);
  };

  const createNewFolderAndMove = (noteId) => {
    setNoteToMoveAfterFolderCreate(noteId);
    setIsEditingFolder(true);
    setFolderName("");
    setFolderToEdit(null);
  };

  return (
    <>
      <div className="main">
        <h1>IDETON</h1>
        <div className="field">
          <div className="menu-panel">
            <button
              className="add-note-btn"
              onClick={createNewNote}
              aria-label="Create New Note"
            >
              <svg
                width="35"
                height="35"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="add-note-icon"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>

                <polyline points="14 2 14 8 20 8"></polyline>

                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
            </button>
            <button className="create-folder-btn" onClick={createNewFolder}>
              <svg
                width="35"
                height="35"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="add-folder-icon"
              >
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                <line x1="12" y1="11" x2="12" y2="17"></line>
                <line x1="9" y1="14" x2="15" y2="14"></line>
              </svg>
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
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={(e) =>
                    e.currentTarget.classList.add("drag-over")
                  }
                  onDragLeave={(e) =>
                    e.currentTarget.classList.remove("drag-over")
                  }
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove("drag-over");

                    const noteId = Number(e.dataTransfer.getData("noteId"));

                    moveNoteToFolderHandle(noteId, folder.id);
                  }}
                  onMouseEnter={(e) => {
                    const p = e.currentTarget.querySelector("p");
                    if (p && p.scrollWidth > p.clientWidth) {
                      p.setAttribute("title", folder.folderName);
                    } else if (p) {
                      p.removeAttribute("title");
                    }
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
            <h3>{folderToEdit ? "Edit Folder" : "New Folder"}</h3>
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
                  onClick={() => {
                    setNoteToMoveAfterFolderCreate(null);
                    setIsEditingFolder(false);
                  }}
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

      {popoverNote && (
        <div className="popover-overlay" onClick={() => setPopoverNote(null)}>
          <div
            className="popover-menu"
            onClick={(e) => e.stopPropagation()}
            style={{ top: `${popoverNote.y}px`, left: `${popoverNote.x}px` }}
          >
            <h4>Move to...</h4>
            <div className="popover-list">
              <button
                className="popover-item-btn"
                onClick={() => createNewFolderAndMove(popoverNote.note.id)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="plus-square-icon"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                Create Folder
              </button>
              {folders
                .filter((f) => f.id != 1)
                .map((folder) => (
                  <button
                    key={folder.id}
                    className={`popover-item-btn ${popoverNote.note.folderId === folder.id ? "popover-item-selected" : ""}`}
                    onClick={() =>
                      moveNoteToFolder(popoverNote.note.id, folder.id)
                    }
                  >
                    <svg
                      width="20"
                      height="20"
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
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
