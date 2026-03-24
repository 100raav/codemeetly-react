function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        <button className="modal-close" onClick={onClose}>×</button>

        <h2>Privacy Policy</h2>

        <p>
          Your data is secure. We do not store messages permanently.
          All communication is encrypted.
        </p>

      </div>
    </div>
  );
}

export default PrivacyModal;