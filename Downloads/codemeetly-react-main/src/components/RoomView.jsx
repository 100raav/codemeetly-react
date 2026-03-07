import { useEffect, useRef, useState } from 'react';
import ace from 'ace-builds';

function RoomView({
  roomId,
  roomName,
  participants,
  setParticipants,
  currentQuestion,
  setCurrentQuestion,
  chatMessages,
  setChatMessages,
  chatMode,
  setChatMode,
  privateRecipient,
  setPrivateRecipient,
  onInvite,
  onEnd,
  localStreamRef,
  screenStreamRef,
  localVideoRef,
  aceEditorRef,
  isMobile
}) {
  const [micEnabled, setMicEnabled] = useState(true);
  const videoGridRef = useRef(null);
  const fileInputRef = useRef(null); // not used in original, but kept for future

  // Determine if current user is creator
  const isCreator = participants.find(p => p.name === 'You')?.creator || false;

  // Update video grid when participants change (add tiles for remote)
  useEffect(() => {
    // For simplicity, we only have local tile. Remote tiles are added manually via addVideoTile function.
    // In a real app, you'd map over participants and create VideoTile components.
    // Here we'll just keep the grid as is and manipulate via refs? Better to render dynamically.
    // Let's change approach: render video tiles based on participants.
  }, [participants]);

  // Ace editor initialization
  useEffect(() => {
    if (!aceEditorRef.current) {
      const editor = ace.edit('code-editor'); // we'll give this id to a div
      editor.setTheme('ace/theme/tomorrow_night');
      editor.session.setMode('ace/mode/javascript');
      editor.setOptions({ fontSize: '13px', showPrintMargin: false });
      aceEditorRef.current = editor;
    }
  }, []);

  // Update question area UI based on role
  useEffect(() => {
    // The question area is re-rendered conditionally below
  }, [isCreator, currentQuestion]);

  // ---------- Video/Audio functions ----------
  const toggleCamera = async () => {
    const btn = document.getElementById('cameraBtn');
    if (screenStreamRef.current) {
      alert('Stop screen sharing first to toggle camera.');
      return;
    }
    if (localStreamRef.current && localStreamRef.current.getVideoTracks().length > 0) {
      // stop video
      localStreamRef.current.getVideoTracks().forEach(t => t.stop());
      localStreamRef.current.getVideoTracks().forEach(t => localStreamRef.current.removeTrack(t));
      if (localVideoRef.current) {
        localVideoRef.current.style.display = 'none';
      }
      document.getElementById('localIcon').style.display = 'block';
      btn.classList.add('off');
      btn.innerHTML = '<i class="fas fa-video-slash"></i> Camera';
    } else {
      try {
        if (!localStreamRef.current) {
          localStreamRef.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: micEnabled });
        } else {
          const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
          const newTrack = newStream.getVideoTracks()[0];
          localStreamRef.current.addTrack(newTrack);
        }
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current;
          localVideoRef.current.style.display = 'block';
          document.getElementById('localIcon').style.display = 'none';
          localVideoRef.current.play();
        }
        btn.classList.remove('off');
        btn.innerHTML = '<i class="fas fa-video"></i> Camera';
      } catch (e) {
        alert('Camera access denied');
      }
    }
  };

  const toggleMic = async () => {
    const btn = document.getElementById('micBtn');
    if (!localStreamRef.current) {
      setMicEnabled(!micEnabled);
      if (micEnabled) {
        btn.classList.remove('off');
        btn.innerHTML = '<i class="fas fa-microphone"></i> Mic';
      } else {
        btn.classList.add('off');
        btn.innerHTML = '<i class="fas fa-microphone-slash"></i> Mic';
      }
      return;
    }
    const audioTrack = localStreamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      if (audioTrack.enabled) {
        btn.classList.remove('off');
        btn.innerHTML = '<i class="fas fa-microphone"></i> Mic';
      } else {
        btn.classList.add('off');
        btn.innerHTML = '<i class="fas fa-microphone-slash"></i> Mic';
      }
    } else {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const newTrack = newStream.getAudioTracks()[0];
        localStreamRef.current.addTrack(newTrack);
        btn.classList.remove('off');
        btn.innerHTML = '<i class="fas fa-microphone"></i> Mic';
      } catch {
        alert('Mic access denied');
      }
    }
  };

  const shareScreen = async () => {
    if (isMobile) {
      alert('Screen sharing is not supported on mobile devices.');
      return;
    }
    const btn = document.getElementById('shareBtn');
    if (screenStreamRef.current) {
      // stop sharing
      screenStreamRef.current.getTracks().forEach(t => t.stop());
      screenStreamRef.current = null;
      if (localStreamRef.current && localStreamRef.current.getVideoTracks().length > 0) {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current;
          localVideoRef.current.style.display = 'block';
          document.getElementById('localIcon').style.display = 'none';
        }
      } else {
        if (localVideoRef.current) localVideoRef.current.style.display = 'none';
        document.getElementById('localIcon').style.display = 'block';
      }
      document.getElementById('localLabel').innerText = 'You';
      btn.classList.remove('off');
      btn.innerHTML = '<i class="fas fa-desktop"></i> Share';
      return;
    }
    try {
      screenStreamRef.current = await navigator.mediaDevices.getDisplayMedia({ video: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStreamRef.current;
        localVideoRef.current.style.display = 'block';
        document.getElementById('localIcon').style.display = 'none';
        document.getElementById('localLabel').innerText = 'You (sharing)';
      }
      btn.classList.add('off');
      btn.innerHTML = '<i class="fas fa-stop"></i> Stop';
      screenStreamRef.current.getVideoTracks()[0].onended = () => {
        screenStreamRef.current = null;
        if (localStreamRef.current && localStreamRef.current.getVideoTracks().length > 0) {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current;
            localVideoRef.current.style.display = 'block';
            document.getElementById('localIcon').style.display = 'none';
          }
        } else {
          if (localVideoRef.current) localVideoRef.current.style.display = 'none';
          document.getElementById('localIcon').style.display = 'block';
        }
        document.getElementById('localLabel').innerText = 'You';
        btn.classList.remove('off');
        btn.innerHTML = '<i class="fas fa-desktop"></i> Share';
      };
    } catch {
      alert('Screen share cancelled');
    }
  };

  // ---------- Chat ----------
  const [chatInput, setChatInput] = useState('');

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    let target = '';
    if (chatMode === 'private') {
      if (!privateRecipient || privateRecipient === 'Select participant') {
        alert('Select a participant');
        return;
      }
      target = privateRecipient;
    }
    const displayMsg = chatMode === 'group' 
      ? `You (to everyone): ${chatInput}` 
      : `You (to ${target}): ${chatInput}`;
    setChatMessages([...chatMessages, { type: 'self', text: displayMsg }]);
    setChatInput('');
    // mock reply
    setTimeout(() => {
      const replier = target || (participants.find(p => p.name !== 'You')?.name || 'Alex');
      if (replier) {
        setChatMessages(prev => [...prev, { type: 'other', sender: replier, text: 'Thanks' }]);
      }
    }, 800);
  };

  // ---------- Invite link ----------
  const copyInviteLink = () => {
    const link = `https://codemeetly.com/room/${roomId} (pass: ${roomPass || 'none'})`;
    navigator.clipboard?.writeText(link).then(() => alert('Invite link copied!'));
  };

  // ---------- Mute all (mock) ----------
  const muteAll = () => alert('Mute all (mock)');

  // ---------- Send private (sets chat mode to private) ----------
  const sendPrivate = () => {
    setChatMode('private');
    // Also optionally focus on recipient select
  };

  return (
    <div className="room-container">
      <div className="room-header">
        <div>
          <i className="fas fa-door-open"></i> <span>{roomName}</span> (ID: <span>{roomId}</span>)
        </div>
        <div>
          <button className="btn-outline" onClick={copyInviteLink}>
            <i className="fas fa-link"></i> Copy invite
          </button>{' '}
          <button className="btn-danger" onClick={onEnd}>
            <i className="fas fa-phone-slash"></i> End
          </button>
        </div>
      </div>

      <div className="room-main">
        {/* left sidebar */}
        <div className="left-sidebar">
          {/* participants panel */}
          <div className="participants-panel">
            <h4><i className="fas fa-users"></i> Participants (<span>{participants.length}</span>/4)</h4>
            <ul id="participantList">
              {participants.map((p, idx) => (
                <li key={idx}>
                  <i className={`fas ${p.creator ? 'fa-crown' : 'fa-user'}`} style={{ color: p.creator ? 'gold' : 'var(--text-secondary)' }}></i>
                  {p.name} {p.role && `(${p.role})`} {p.creator && <span className="badge">creator</span>}
                </li>
              ))}
            </ul>
            <div className="admin-controls" id="adminControls">
              <button className="btn-outline" onClick={onInvite}><i className="fas fa-user-plus"></i> Invite</button>
              <button className="btn-outline" onClick={muteAll}><i className="fas fa-microphone-slash"></i> Mute all</button>
              <select 
                id="privateUserSelect" 
                style={{ background: 'var(--glass-bg)', borderRadius: '30px', padding: '0.5rem' }}
                value={privateRecipient}
                onChange={(e) => setPrivateRecipient(e.target.value)}
              >
                <option>Select participant</option>
                {participants.filter(p => p.name !== 'You').map(p => (
                  <option key={p.name}>{p.name}</option>
                ))}
              </select>
              <button className="btn-outline" onClick={sendPrivate}><i className="fas fa-comment"></i> Private msg</button>
            </div>
          </div>

          {/* chat panel */}
          <div className="chat-panel">
            <div className="chat-tabs">
              <span 
                className={`chat-tab ${chatMode === 'group' ? 'active' : ''}`} 
                onClick={() => setChatMode('group')}
              >
                Group
              </span>
              <span 
                className={`chat-tab ${chatMode === 'private' ? 'active' : ''}`} 
                onClick={() => setChatMode('private')}
              >
                Private
              </span>
            </div>
            <div className="chat-messages" id="chatMessages">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`chat-msg ${msg.type === 'self' ? 'self' : ''}`}>
                  <strong>{msg.sender ? msg.sender + ':' : 'System:'}</strong> {msg.text}
                </div>
              ))}
            </div>
            <div className="chat-control">
              <input 
                id="chatInput" 
                placeholder="Type message..." 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
              />
              <button onClick={sendChatMessage}><i className="fas fa-paper-plane"></i></button>
            </div>
          </div>
        </div>

        {/* right content */}
        <div className="right-content">
          {/* video panel */}
          <div className="video-panel">
            <h4><i className="fas fa-video"></i> Video / share</h4>
            <div className="video-grid" id="videoGrid">
              <div className="video-tile" id="localTile">
                <video 
                  id="localVideo" 
                  ref={localVideoRef}
                  autoPlay 
                  muted 
                  playsInline 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'none' }}
                ></video>
                <i className="fas fa-user-circle" id="localIcon" style={{ fontSize: '3rem', display: 'block' }}></i>
                <span className="label" id="localLabel">You</span>
              </div>
              {/* Remote tiles would be dynamically added here. For mock, we'll keep as is. */}
            </div>
            <div className="control-bar">
              <button className="btn-camera" id="cameraBtn" onClick={toggleCamera}>
                <i className="fas fa-video"></i> Camera
              </button>
              <button className="btn-mic" id="micBtn" onClick={toggleMic}>
                <i className="fas fa-microphone"></i> Mic
              </button>
              <button className="btn-share" id="shareBtn" onClick={shareScreen}>
                <i className="fas fa-desktop"></i> Share
              </button>
            </div>
            {isMobile && (
              <p id="mobileShareWarning" style={{ color: 'var(--warning)', marginTop: '0.5rem' }}>
                <i className="fas fa-exclamation-triangle"></i> Screen sharing not available on mobile.
              </p>
            )}
          </div>

          {/* code editor panel */}
          <div className="editor-panel">
            <div className="question-area" id="questionArea">
              {isCreator ? (
                <textarea 
                  id="questionInput" 
                  placeholder="Type your question here..." 
                  rows="3"
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                />
              ) : (
                <div style={{ whiteSpace: 'pre-wrap', background: 'var(--code-bg)', color: '#e2e8f0', padding: '0.8rem', borderRadius: '28px' }}>
                  {currentQuestion || 'Waiting for interviewer to type a question...'}
                </div>
              )}
            </div>
            <div id="code-editor" style={{ height: '300px', width: '100%', borderRadius: '28px', overflow: 'hidden', border: '1px solid var(--glass-border)', background: 'var(--code-bg)' }}></div>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
              <i className="fas fa-sync"></i> Live sync: interviewer & candidate see same
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomView;