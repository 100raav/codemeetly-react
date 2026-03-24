function Footer({ openAbout, openTeam, openPrivacy }) {
  return (
    <footer className="footer">
      <div>© 2026 CodeMeetly</div>

      <div>
        <a onClick={openAbout}>About</a> · 
        <a onClick={openTeam}>Team</a> · 
        <a onClick={openPrivacy}>Privacy</a>
      </div>

      <div><i className="fas fa-code"></i> Built with 💙 by Team CodeMeetly</div>
    </footer>
  );
}

export default Footer;