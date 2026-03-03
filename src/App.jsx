import { useState, useEffect, useRef } from 'react';
import './index.css'; // our global styles
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './components/Landing';
import RoomView from './components/RoomView';
import AboutModal from './components/AboutModal';
import TeamModal from './components/TeamModal';
import PrivacyModal from './components/PrivacyModal';

// Maximum participants
const MAX_PARTICIPANTS = 4;

function App() {
  // ---------- Auth ----------
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ---------- View ----------
  const [currentView, setCurrentView] = useState('landing'); // 'landing' or 'room'

  // ---------- Room state ----------
  const [roomCreated, setRoomCreated] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomPass, setRoomPass] = useState('');
  const [participants, setParticipants] = useState([
    { name: 'You', role: 'interviewer', creator: true }
  ]);
  const [currentQuestion, setCurrentQuestion] = useState('');

  // ---------- Chat ----------
  const [chatMessages, setChatMessages] = useState([
    { type: 'system', text: 'Room created. You are interviewer.' }
  ]);
  const [chatMode, setChatMode] = useState('group'); // 'group' or 'private'
  const [privateRecipient, setPrivateRecipient] = useState('');

  // ---------- Media (refs because they don't need to trigger re-renders) ----------
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const localVideoRef = useRef(null);

  // ---------- Ace editor ----------
  const aceEditorRef = useRef(null);

  // ---------- Theme ----------
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    if (isDark) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [isDark]);

  // ---------- Mobile detection ----------
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
  }, []);

  // ---------- Mock login ----------
  const handleLogin = () => {
    const fakeToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
    localStorage.setItem('token', fakeToken);
    setIsLoggedIn(true);
    alert('Logged in with Google (mock)');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCurrentView('landing');
    setRoomCreated(false);
    // stop all streams
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(t => t.stop());
      screenStreamRef.current = null;
    }
  };

  // Check token on mount
  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
    }
  }, []);

  // ---------- Modal state ----------
  const [modal, setModal] = useState({ about: false, team: false, privacy: false });

  const openModal = (name) => setModal({ ...modal, [name]: true });
  const closeModal = (name) => setModal({ ...modal, [name]: false });
  const closeAllModals = () => setModal({ about: false, team: false, privacy: false });

  // ---------- Room actions (will be passed to children) ----------
  const createRoom = (name, pass) => {
    const newId = 'cm-' + Math.random().toString(36).substring(2, 8);
    setRoomName(name || 'Interview');
    setRoomPass(pass || '');
    setRoomId(newId);
    setRoomCreated(true);
    setParticipants([{ name: 'You', role: 'interviewer', creator: true }]);
    setCurrentQuestion('');
    setChatMessages([{ type: 'system', text: 'Room created. You are interviewer.' }]);
    setCurrentView('room');
  };

  const joinRoom = (joinId, joinPass) => {
    if (!roomCreated) {
      alert('No active room. Create one first.');
      return false;
    }
    if (joinId !== roomId) {
      alert('Room ID not found.');
      return false;
    }
    if (joinPass !== roomPass) {
      alert('Incorrect password.');
      return false;
    }
    if (participants.length >= MAX_PARTICIPANTS) {
      alert(`Room full (max ${MAX_PARTICIPANTS} participants).`);
      return false;
    }
    const newName = prompt('Enter your name:', 'Candidate') || 'Candidate';
    setParticipants([...participants, { name: newName, role: 'candidate', creator: false }]);
    setChatMessages(prev => [...prev, { type: 'system', text: `${newName} joined.` }]);
    return true;
  };

  const inviteParticipant = () => {
    if (participants.length >= MAX_PARTICIPANTS) {
      alert(`Maximum ${MAX_PARTICIPANTS} participants allowed.`);
      return;
    }
    const name = prompt('Enter participant name:', 'Alex');
    if (!name) return;
    setParticipants([...participants, { name, role: 'candidate', creator: false }]);
    setChatMessages(prev => [...prev, { type: 'system', text: `${name} joined.` }]);
  };

  const endSession = () => {
    if (confirm('End session?')) {
      setCurrentView('landing');
      setRoomCreated(false);
      // stop streams
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
        localStreamRef.current = null;
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(t => t.stop());
        screenStreamRef.current = null;
      }
      // reset participants
      setParticipants([{ name: 'You', role: 'interviewer', creator: true }]);
      setCurrentQuestion('');
      setChatMessages([{ type: 'system', text: 'Room created. You are interviewer.' }]);
    }
  };

  // ---------- Render ----------
  if (!isLoggedIn) {
    // Show only login page
    return (
      <>
        <div className="landing" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <div className="room-card" style={{ textAlign: 'center', maxWidth: '400px' }}>
            <h2><i className="fab fa-google" style={{ color: '#DB4437' }}></i> Login with Google</h2>
            <p style={{ margin: '1rem 0', color: 'var(--text-secondary)' }}>Sign in to start or join coding interviews</p>
            <button className="btn-primary" onClick={handleLogin}><i className="fab fa-google"></i> Sign in with Google</button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      {/* Overlay for modals */}
      <div className={`overlay ${modal.about || modal.team || modal.privacy ? 'show' : ''}`} onClick={closeAllModals}></div>

      <Navbar 
        isDark={isDark} 
        toggleTheme={() => setIsDark(!isDark)} 
        onLogout={handleLogout}
        openAbout={() => openModal('about')}
        openTeam={() => openModal('team')}
        openPrivacy={() => openModal('privacy')}
      />

      {/* Main content */}
      {currentView === 'landing' ? (
        <Landing 
          onCreateRoom={createRoom}
          onJoinRoom={joinRoom}
          roomCreated={roomCreated}
          roomId={roomId}
          roomPass={roomPass}
        />
      ) : (
        <RoomView 
          roomId={roomId}
          roomName={roomName}
          participants={participants}
          setParticipants={setParticipants}
          currentQuestion={currentQuestion}
          setCurrentQuestion={setCurrentQuestion}
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
          chatMode={chatMode}
          setChatMode={setChatMode}
          privateRecipient={privateRecipient}
          setPrivateRecipient={setPrivateRecipient}
          onInvite={inviteParticipant}
          onEnd={endSession}
          localStreamRef={localStreamRef}
          screenStreamRef={screenStreamRef}
          localVideoRef={localVideoRef}
          aceEditorRef={aceEditorRef}
          isMobile={isMobile}
        />
      )}

      <Footer 
        openAbout={() => openModal('about')}
        openTeam={() => openModal('team')}
        openPrivacy={() => openModal('privacy')}
      />

      {/* Modals */}
      <AboutModal isOpen={modal.about} onClose={() => closeModal('about')} />
      <TeamModal isOpen={modal.team} onClose={() => closeModal('team')} />
      <PrivacyModal isOpen={modal.privacy} onClose={() => closeModal('privacy')} />
    </>
  );
}

export default App;