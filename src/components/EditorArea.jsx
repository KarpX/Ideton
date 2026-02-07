const EditorArea = ({
  setTitle,
  setContent,
  setIsEditing,
  handleSave,
  title,
  content,
}) => {
  return (
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
  );
};

export default EditorArea;
