function TeamModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const team = [
    {
      name: "Shivam Yadav",
      role: "Full Stack",
      initials: "SY",
      github: "#",
      linkedin: "#"
    },
    {
      name: "Anurag Kushwaha",
      role: "Backend",
      initials: "AK",
      github: "#",
      linkedin: "#"
    },
    {
      name: "Subhanshu",
      role: "Frontend",
      initials: "SP",
      github: "#",
      linkedin: "#"
    },
    {
        name: "Saurav",
        role: "DevOps",
        initials: "SB",
        github: "https://github.com/100raav",
        linkedin: "https://www.linkedin.com/in/saurav-bixa/"
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        <button className="modal-close" onClick={onClose}>×</button>

        <h2>👥 Developers</h2>

        <div className="team-grid">
          {team.map((dev, i) => (
            <div key={i} className="team-card">

              <div className="avatar">{dev.initials}</div>
              <h3>{dev.name}</h3>
              <p>{dev.role}</p>

              <div style={{ marginTop: "10px" }}>
              <div className="team-links">
  <a href={dev.github} target="_blank">🐙</a>
  <a href={dev.linkedin} target="_blank">💼</a>
</div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default TeamModal;