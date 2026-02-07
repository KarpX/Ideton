const EditingFolderModal = ({
  setFolderName,
  folderName,
  folderToEdit,
  folderIcons,
  selectedFolderIcon,
  setSelectedFolderIcon,
  deleteFolder,
  setNoteToMoveAfterFolderCreate,
  setIsEditingFolder,
  saveFolder,
}) => {
  return (
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
          autoComplete="off"
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
  );
};

export default EditingFolderModal;
