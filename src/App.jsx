import { useState } from "react";
import FolderList from "./components/FoldersList.jsx";
import NotesList from "./components/NotesList.jsx";
import EditorArea from "./components/EditorArea.jsx";
import EditingFolderModal from "./components/EditingFolderModal.jsx";
import "./App.css";
import "./components/CSS/Popover.css";
import "./components/CSS/Folder.css";
import "./components/CSS/Note.css";

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
            <FolderList
              folders={folders}
              selectedFolderId={selectedFolderId}
              setSelectedFolderId={setSelectedFolderId}
              longPressTimeout={longPressTimeout}
              setLongPressTimeout={setLongPressTimeout}
              onDropNote={moveNoteToFolderHandle}
              onEditFolder={(folder) => {
                setFolderToEdit(folder);
                setFolderName(folder.folderName);
                setIsEditingFolder(true);
              }}
            />
          </div>
          <div className="note-field">
            {isEditing ? (
              <EditorArea
                setTitle={setTitle}
                setContent={setContent}
                setIsEditing={setIsEditing}
                handleSave={handleSave}
                content={content}
                title={title}
              />
            ) : (
              <NotesList
                filtredNotes={filtredNotes}
                popoverNote={popoverNote}
                selectNote={selectNote}
                deleteNote={deleteNote}
                setPopoverNote={setPopoverNote}
              />
            )}
          </div>
        </div>
      </div>

      {isEditingFolder && (
        <EditingFolderModal
          setFolderName={setFolderName}
          folderName={folderName}
          folderToEdit={folderToEdit}
          folderIcons={folderIcons}
          selectedFolderIcon={selectedFolderIcon}
          setSelectedFolderIcon={setSelectedFolderIcon}
          deleteFolder={deleteFolder}
          setNoteToMoveAfterFolderCreate={setNoteToMoveAfterFolderCreate}
          setIsEditingFolder={setIsEditingFolder}
          saveFolder={saveFolder}
        />
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
