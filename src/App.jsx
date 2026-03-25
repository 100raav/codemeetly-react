import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from './services/api';
import './index.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './components/Landing';
import RoomView from './components/RoomView';
import OAuth2Redirect from './components/OAuth2Redirect';

import AboutModal from './components/AboutModal';
import TeamModal from './components/TeamModal';
import PrivacyModal from './components/PrivacyModal';

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

function App() {

  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  const [isDark, setIsDark] = useState(false);

  const [modal, setModal] = useState({
    about: false,
    team: false,
    privacy: false
  });

  // 🌙 THEME
  useEffect(() => {
    document.body.classList.toggle('dark', isDark);
  }, [isDark]);

  // 👤 FETCH USER
  useEffect(() => {
    if (isLoggedIn) {
      api.get('/auth/me')
        .then(res => setUser(res.data.data || res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          navigate('/login');
        });
    }
  }, [isLoggedIn]);

  // 🚪 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
  };

  // 🏠 CREATE ROOM (FIXED)
  const createRoom = (name, pass) => {
    const id = name || Math.random().toString(36).substring(2, 8);

    // 👉 DIRECT ROUTING (NO BUG)
    navigate(`/room/${id}`);

    alert(`Room Created ✅\nRoom ID: ${id}`);
  };

  // 🔗 JOIN ROOM (FIXED)
  const joinRoom = (id, pass) => {
    if (!id) {
      alert("Enter Room ID ❌");
      return false;
    }

    navigate(`/room/${id}`);
    return true;
  };

  return (
    <Routes>

      {/* GOOGLE LOGIN */}
      <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />

      {/* LOGIN PAGE */}
      <Route path="/login" element={
        <div className="landing center">
          <div className="room-card glass-card">
            <h2>Welcome to CodeMeetly</h2>
            <p>Login to continue</p>

            <a
              href="http://localhost:8080/oauth2/authorization/google"
              className="btn-primary"
            >
              🔐 Login with Google
            </a>
          </div>
        </div>
      } />

      {/* ROOM ROUTE (🔥 IMPORTANT) */}
      <Route path="/room/:roomId" element={
        isLoggedIn ? (
          <>
            <Navbar
              isDark={isDark}
              toggleTheme={() => setIsDark(!isDark)}
              onLogout={handleLogout}
              user={user}

              openAbout={() => setModal({ ...modal, about: true })}
              openTeam={() => setModal({ ...modal, team: true })}
              openPrivacy={() => setModal({ ...modal, privacy: true })}
            />

            <RoomView user={user} />

            <Footer
              openAbout={() => setModal({ ...modal, about: true })}
              openTeam={() => setModal({ ...modal, team: true })}
              openPrivacy={() => setModal({ ...modal, privacy: true })}
            />

            <AboutModal isOpen={modal.about} onClose={() => setModal({ ...modal, about: false })} />
            <TeamModal isOpen={modal.team} onClose={() => setModal({ ...modal, team: false })} />
            <PrivacyModal isOpen={modal.privacy} onClose={() => setModal({ ...modal, privacy: false })} />
          </>
        ) : <Navigate to="/login" />
      } />

      {/* HOME */}
      <Route path="/" element={
        isLoggedIn ? (
          <>
            <Navbar
              isDark={isDark}
              toggleTheme={() => setIsDark(!isDark)}
              onLogout={handleLogout}
              user={user}

              openAbout={() => setModal({ ...modal, about: true })}
              openTeam={() => setModal({ ...modal, team: true })}
              openPrivacy={() => setModal({ ...modal, privacy: true })}
            />

            <Landing 
              onCreateRoom={createRoom}
              onJoinRoom={joinRoom}
            />

            <Footer
              openAbout={() => setModal({ ...modal, about: true })}
              openTeam={() => setModal({ ...modal, team: true })}
              openPrivacy={() => setModal({ ...modal, privacy: true })}
            />

            <AboutModal isOpen={modal.about} onClose={() => setModal({ ...modal, about: false })} />
            <TeamModal isOpen={modal.team} onClose={() => setModal({ ...modal, team: false })} />
            <PrivacyModal isOpen={modal.privacy} onClose={() => setModal({ ...modal, privacy: false })} />
          </>
        ) : <Navigate to="/login" />
      } />

    </Routes>
  );
}

export default AppWrapper;