function AboutModal({ isOpen, onClose }) {
    if (!isOpen) return null;
    return (
      <div id="aboutModal" className="modal show">
        <span className="close-modal" onClick={onClose}>&times;</span>
        <h2>About CodeMeetly</h2>
        <p>CodeMeetly is a Java Full Stack live coding interview platform that combines real‑time code editor, video/voice calls, screen sharing, and chat. Designed for seamless technical interviews and pair programming.</p>
        <p><strong>Features:</strong> One‑click rooms, Google login, practice mode, mobile ready, and end‑to‑end encryption.</p>
        <p>Built by Shivam Yadav, Anurag Kushwaha, Subhanshu Pratap Singh, Saurav Kumar Bichha.</p>
      </div>
    );
  }
  
  export default AboutModal;