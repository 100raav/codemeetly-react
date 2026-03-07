import { useState } from 'react';

function Landing({ onCreateRoom, onJoinRoom, roomCreated, roomId, roomPass }) {
  const [createName, setCreateName] = useState('Interview room');
  const [createPass, setCreatePass] = useState('');
  const [joinId, setJoinId] = useState('');
  const [joinPass, setJoinPass] = useState('');
  const [joinError, setJoinError] = useState('');

  const handleCreate = () => {
    onCreateRoom(createName, createPass);
  };

  const handleJoin = () => {
    const success = onJoinRoom(joinId, joinPass);
    if (!success) {
      setJoinError('Unable to join room');
    } else {
      setJoinError('');
    }
  };

  return (
    <div className="landing">
      <div className="hero">
        <h1>CodeMeetly</h1>
        <p>Real‑time coding interviews · live editor · video/voice · screen share</p>
      </div>
      <div className="room-forms">
        {/* create room */}
        <div className="room-card">
          <h3><i className="fas fa-plus-circle" style={{color: 'var(--success)'}}></i> Create room</h3>
          <input 
            type="text" 
            placeholder="Room name" 
            value={createName} 
            onChange={(e) => setCreateName(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password (optional)" 
            value={createPass} 
            onChange={(e) => setCreatePass(e.target.value)} 
          />
          <button className="btn-success" onClick={handleCreate}>
            <i className="fas fa-door-open"></i> Create & start
          </button>
        </div>
        {/* join room */}
        <div className="room-card">
          <h3><i className="fas fa-sign-in-alt" style={{color: 'var(--accent)'}}></i> Join room</h3>
          <input 
            type="text" 
            placeholder="Room ID or link" 
            value={joinId} 
            onChange={(e) => setJoinId(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={joinPass} 
            onChange={(e) => setJoinPass(e.target.value)} 
          />
          <button className="btn-primary" onClick={handleJoin}>
            <i className="fas fa-sign-in-alt"></i> Join
          </button>
          {joinError && <p style={{color:'var(--danger)', fontSize:'0.9rem', marginTop:'0.5rem'}}>{joinError}</p>}
        </div>
      </div>
    </div>
  );
}

export default Landing;