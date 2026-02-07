const FolderList = ({
  folders,
  selectedFolderId,
  setSelectedFolderId,
  longPressTimeout,
  setLongPressTimeout,
  onDropNote,
  onEditFolder,
}) => {
  return (
    <div className="folders-list">
      {folders.map((folder) => (
        <div
          key={folder.id}
          className={`folder ${selectedFolderId === folder.id ? "selected" : ""}`}
          onClick={() => setSelectedFolderId(folder.id)}
          onMouseDown={() => {
            const timeout = setTimeout(() => {
              if (folder.id !== 1) {
                onEditFolder(folder);
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
          onDragEnter={(e) => e.currentTarget.classList.add("drag-over")}
          onDragLeave={(e) => e.currentTarget.classList.remove("drag-over")}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove("drag-over");

            const noteId = Number(e.dataTransfer.getData("noteId"));

            onDropNote(noteId, folder.id);
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
  );
};

export default FolderList;
