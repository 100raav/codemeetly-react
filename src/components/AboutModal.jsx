function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        <button className="modal-close" onClick={onClose}>×</button>

        <h2>About CodeMeetly</h2>

        <p>
          CodeMeetly is a real-time coding interview platform with video,
          chat, and live coding.
        </p>

      </div>
    </div>
  );
}

export default AboutModal;