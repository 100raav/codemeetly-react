import { useState } from "react";

function Navbar({
  isDark,
  toggleTheme,
  openAbout,
  openTeam,
  openPrivacy,
  onHome,
  user,
  onLogout
}) {

  const [menu, setMenu] = useState(false);

  return (
    <nav className="navbar">

<div className="logo" onClick={onHome}>
  <h2>CodeMeetly</h2>
</div>

      <div className={`nav-links ${menu ? "active" : ""}`}>
        <a onClick={onHome}>Home</a>
        <a onClick={openAbout}>About</a>
        <a onClick={openTeam}>Team</a>
        <a onClick={openPrivacy}>Privacy</a>
      </div>

      <div className="nav-right">

        {user && <span className="user">Hi, {user.fullName}</span>}

        <button className="theme-btn" onClick={toggleTheme}>
          {isDark ? "🌙" : "☀️"}
        </button>

        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>

        <div className="menu" onClick={() => setMenu(!menu)}>☰</div>

      </div>

    </nav>
  );
}

export default Navbar;