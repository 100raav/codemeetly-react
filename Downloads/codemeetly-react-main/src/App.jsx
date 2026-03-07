import API from "./services/api";
import { useState, useEffect, useRef } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './components/Landing';
import RoomView from './components/RoomView';
import AboutModal from './components/AboutModal';
import TeamModal from './components/TeamModal';
import PrivacyModal from './components/PrivacyModal';

const MAX_PARTICIPANTS = 4;

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('landing');

  const [roomCreated, setRoomCreated] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomPass, setRoomPass] = useState('');

  const [participants, setParticipants] = useState([
    { name: 'You', role: 'interviewer', creator: true }
  ]);

  const [currentQuestion, setCurrentQuestion] = useState('');

  const [chatMessages, setChatMessages] = useState([
    { type: 'system', text: 'Room created. You are interviewer.' }
  ]);

  const [chatMode, setChatMode] = useState('group');
  const [privateRecipient, setPrivateRecipient] = useState('');

  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const aceEditorRef = useRef(null);

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [isDark]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
  }, []);

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
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
    }
  }, []);

  const [modal, setModal] = useState({ about: false, team: false, privacy: false });

  const openModal = (name) => setModal({ ...modal, [name]: true });
  const closeModal = (name) => setModal({ ...modal, [name]: false });
  const closeAllModals = () => setModal({ about: false, team: false, privacy: false });

  /*
  ===============================
  CREATE ROOM (CALL BACKEND)
  ===============================
  */

  const createRoom = async (name, pass) => {

    try {

      const response = await API.post("/rooms/create", {
        name: name,
        password: pass
      });

      const data = response.data;

      setRoomId(data.id);
      setRoomName(data.name);
      setRoomPass(data.password);

      setRoomCreated(true);

      setParticipants([
        { name: 'You', role: 'interviewer', creator: true }
      ]);

      setChatMessages([
        { type: 'system', text: 'Room created. You are interviewer.' }
      ]);

      setCurrentView('room');

    } catch (error) {

      console.error(error);
      alert("Failed to create room");

    }

  };

  /*
  ===============================
  JOIN ROOM (CALL BACKEND)
  ===============================
  */

  const joinRoom = async (joinId, joinPass) => {

    try {

      const response = await API.post("/rooms/join", {
        roomId: joinId,
        password: joinPass
      });

      if (response.data.success) {

        const newName = prompt('Enter your name:', 'Candidate') || 'Candidate';

        setParticipants(prev => [
          ...prev,
          { name: newName, role: 'candidate', creator: false }
        ]);

        setChatMessages(prev => [
          ...prev,
          { type: 'system', text: `${newName} joined.` }
        ]);

        setCurrentView('room');

        return true;

      } else {

        alert("Room not found or wrong password");
        return false;

      }

    } catch (error) {

      console.error(error);
      alert("Failed to join room");

      return false;

    }

  };

  const inviteParticipant = () => {

    if (participants.length >= MAX_PARTICIPANTS) {
      alert(`Maximum ${MAX_PARTICIPANTS} participants allowed.`);
      return;
    }

    const name = prompt('Enter participant name:', 'Alex');
    if (!name) return;

    setParticipants([...participants, { name, role: 'candidate', creator: false }]);

  };

  const endSession = () => {

    if (confirm('End session?')) {

      setCurrentView('landing');
      setRoomCreated(false);

      setParticipants([
        { name: 'You', role: 'interviewer', creator: true }
      ]);

    }

  };

  if (!isLoggedIn) {

    return (

      <>
        <div className="landing" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>

          <div className="room-card" style={{ textAlign: 'center', maxWidth: '400px' }}>

            <h2>Login with Google</h2>

            <button className="btn-primary" onClick={handleLogin}>
              Sign in
            </button>

          </div>

        </div>

        <Footer />

      </>

    );

  }

  return (

    <>

      <div className={`overlay ${modal.about || modal.team || modal.privacy ? 'show' : ''}`} onClick={closeAllModals}></div>

      <Navbar 
        isDark={isDark} 
        toggleTheme={() => setIsDark(!isDark)} 
        onLogout={handleLogout}
        openAbout={() => openModal('about')}
        openTeam={() => openModal('team')}
        openPrivacy={() => openModal('privacy')}
      />

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

      <AboutModal isOpen={modal.about} onClose={() => closeModal('about')} />
      <TeamModal isOpen={modal.team} onClose={() => closeModal('team')} />
      <PrivacyModal isOpen={modal.privacy} onClose={() => closeModal('privacy')} />

    </>

  );

}

export default App;