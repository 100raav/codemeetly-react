import { useState } from 'react';

function Navbar({ isDark, toggleTheme, onLogout, openAbout, openTeam, openPrivacy }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <nav className="navbar glass-nav">
      <div className="logo"><h2>CodeMeetly</h2></div>
      <div className="nav-links">
        <a onClick={() => { /* home shows landing, but we need to change view - we'll handle via App state */ }}>Home</a>
        <a onClick={openAbout}>About</a>
        <a onClick={openTeam}>Team</a>
      </div>
      <div className="nav-actions">
        <div className="theme-toggle" id="themeToggle" onClick={toggleTheme}>
          <i className={`fas fa-sun ${!isDark ? 'active' : ''}`}></i>
          <i className={`fas fa-moon ${isDark ? 'active' : ''}`}></i>
        </div>
        <button className="logout-btn" id="logoutBtn" onClick={onLogout}>
          <i className="fas fa-sign-out-alt"></i> <span>Logout</span>
        </button>
        <div className="menu-icon" id="menuIcon" onClick={toggleDropdown}>
          <i className="fas fa-bars"></i>
        </div>
      </div>
      {/* mobile dropdown */}
      {dropdownOpen && (
        <div className="mobile-dropdown show" id="mobileDropdown">
          <a onClick={() => { /* Home action */ setDropdownOpen(false); }}>Home</a>
          <a onClick={() => { openAbout(); setDropdownOpen(false); }}>About</a>
          <a onClick={() => { openTeam(); setDropdownOpen(false); }}>Team</a>
        </div>
      )}
    </nav>
  );
}

export default Navbar;