import { useState } from "react";
import { runCode } from "../services/code";

const RoomView = ({
  user,
  participants,
  chatMessages,
  chatInput,
  setChatInput,
  sendMessage,
  localVideoRef,
}) => {

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleRun = async () => {
    try {
      const res = await runCode(code, language, input);
      setOutput(res.output);
    } catch {
      setOutput("Error running code");
    }
  };

  return (
    <div className="room-container">

      {/* HEADER */}
      <div className="room-header">
        <h3>Interview Room</h3>
        <span>{user?.fullName}</span>
      </div>

      <div className="room-main">

        {/* LEFT SIDEBAR */}
        <div className="left-sidebar">

          <div className="participants-panel">
            <h3>Participants</h3>
            <ul>
              {participants.map((p, i) => (
                <li key={i}>
                  {p.name} ({p.role})
                </li>
              ))}
            </ul>
          </div>

          {/* CHAT */}
          <div className="chat-panel">
            <h3>Chat</h3>

            <div className="chat-messages">
              {chatMessages.map((msg, i) => (
                <div key={i} className="chat-msg">
                  <b>{msg.sender}:</b> {msg.text}
                </div>
              ))}
            </div>

            <div className="chat-control">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type message..."
              />
              <button onClick={sendMessage}>➤</button>
            </div>
          </div>

        </div>

        {/* RIGHT CONTENT */}
        <div className="right-content">

          {/* VIDEO */}
          <div className="video-panel">
  <h3>Video / Share</h3>

  <div className="video-grid">
    <div className="video-tile">
      <video ref={localVideoRef} autoPlay muted />
      <span className="label">You</span>
    </div>
  </div>

  <div className="control-bar">
  <button
  className="btn-camera"
  onClick={() => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    track.enabled = !track.enabled;
  }}
>
  📷 Camera
</button>

<button
  className="btn-mic"
  onClick={() => {
    if (!stream) return;
    const track = stream.getAudioTracks()[0];
    track.enabled = !track.enabled;
  }}
>
  🎤 Mic
</button>

<button
  className="btn-share"
  onClick={async () => {
    try {
      const screen = await navigator.mediaDevices.getDisplayMedia({ video: true });
      localVideoRef.current.srcObject = screen;
    } catch {
      alert("Screen share cancelled");
    }
  }}
>
  🖥 Share
</button>
  </div>
</div>

          {/* EDITOR */}
          <div className="editor-panel">
            <h3>Code Editor</h3>

            <select onChange={(e) => setLanguage(e.target.value)}>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>

            <textarea
              placeholder="Write code..."
              onChange={(e) => setCode(e.target.value)}
            />

            <textarea
              placeholder="Input"
              onChange={(e) => setInput(e.target.value)}
            />

            <button className="btn-primary" onClick={handleRun}>
              Run Code
            </button>

            <h4>Output:</h4>
            <pre>{output}</pre>
          </div>

        </div>

      </div>
    </div>
  );
};

export default RoomView;