import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
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

  const [currentView, setCurrentView] = useState('landing');

  const [participants, setParticipants] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const [isDark, setIsDark] = useState(false);

  // ✅ MODAL STATE (NEW)
  const [modal, setModal] = useState({
    about: false,
    team: false,
    privacy: false
  });

  const localStreamRef = useRef(null);
  const localVideoRef = useRef(null);

  // THEME
  useEffect(() => {
    document.body.classList.toggle('dark', isDark);
  }, [isDark]);

  // FETCH USER
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

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
  };

  // CREATE ROOM
  const createRoom = () => {
    setParticipants([
      { name: user?.fullName || "You", role: "interviewer" }
    ]);
    setCurrentView('room');
  };

  // CHAT
  const sendMessage = () => {
    if (!chatInput.trim()) return;

    setChatMessages(prev => [
      ...prev,
      { sender: user?.fullName || "You", text: chatInput }
    ]);

    setChatInput('');
  };

  return (
    <Routes>

      {/* GOOGLE REDIRECT */}
      <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />

      {/* LOGIN */}
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

      {/* MAIN */}
      <Route path="/" element={
        isLoggedIn ? (
          <>
            <Navbar
              isDark={isDark}
              toggleTheme={() => setIsDark(!isDark)}
              onLogout={handleLogout}
              user={user}
              onHome={() => setCurrentView('landing')}

              openAbout={() => setModal({ ...modal, about: true })}
              openTeam={() => setModal({ ...modal, team: true })}
              openPrivacy={() => setModal({ ...modal, privacy: true })}
            />

            {currentView === 'landing' ? (
              <Landing onCreateRoom={createRoom} />
            ) : (
              <RoomView
                user={user}
                participants={participants}
                chatMessages={chatMessages}
                chatInput={chatInput}
                setChatInput={setChatInput}
                sendMessage={sendMessage}
                localVideoRef={localVideoRef}
              />
            )}

            <Footer
              openAbout={() => setModal({ ...modal, about: true })}
              openTeam={() => setModal({ ...modal, team: true })}
              openPrivacy={() => setModal({ ...modal, privacy: true })}
            />

            {/* MODALS */}
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