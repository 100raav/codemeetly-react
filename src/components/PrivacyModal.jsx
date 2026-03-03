function PrivacyModal({ isOpen, onClose }) {
    if (!isOpen) return null;
    return (
      <div id="privacyModal" className="modal show">
        <span className="close-modal" onClick={onClose}>&times;</span>
        <h2>Privacy Policy</h2>
        <div className="privacy-content">
          <p>Your privacy is important to us. CodeMeetly uses end‑to‑end encryption for all video, audio, and screen sharing. Chat messages are encrypted in transit. Room data is not stored permanently. We do not sell your personal information.</p>
          <p>By using CodeMeetly, you agree to our data handling practices as described. For full details, contact the development team.</p>
        </div>
      </div>
    );
  }
  
  export default PrivacyModal;