function TeamModal({ isOpen, onClose }) {
    if (!isOpen) return null;
    return (
      <div id="teamModal" className="modal show" style={{ maxWidth: '800px' }}>
        <span className="close-modal" onClick={onClose}>&times;</span>
        <h2 style={{ textAlign: 'center' }}>👥 The Developers</h2>
        <div className="team-grid">
          <div className="team-card">
            <div className="avatar">SY</div>
            <h3>Shivam Yadav</h3>
            <p>Full Stack</p>
            <div>
              <a href="#"><i className="fab fa-linkedin"></i></a>{' '}
              <a href="#"><i className="fab fa-github"></i></a>
            </div>
          </div>
          <div className="team-card">
            <div className="avatar">AK</div>
            <h3>Anurag Kushwaha</h3>
            <p>Backend</p>
            <div>
              <a href="#"><i className="fab fa-linkedin"></i></a>{' '}
              <a href="#"><i className="fab fa-github"></i></a>
            </div>
          </div>
          <div className="team-card">
            <div className="avatar">SP</div>
            <h3>Subhanshu Pratap Singh</h3>
            <p>Frontend</p>
            <div>
              <a href="#"><i className="fab fa-linkedin"></i></a>{' '}
              <a href="#"><i className="fab fa-github"></i></a>
            </div>
          </div>
          <div className="team-card">
            <div className="avatar">SB</div>
            <h3>Saurav Kumar Bichha</h3>
            <p>DevOps</p>
            <div>
              <a href="#"><i className="fab fa-linkedin"></i></a>{' '}
              <a href="#"><i className="fab fa-github"></i></a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default TeamModal;