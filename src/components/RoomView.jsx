import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const RoomView = ({ user }) => {

  const { roomId } = useParams();

  const localRef = useRef(null);
  const [client, setClient] = useState(null);
  const [stream, setStream] = useState(null);

  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState("");

  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);

  const [participants, setParticipants] = useState([]);
  const [code, setCode] = useState("");

  // ================= SOCKET =================
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");

    const stomp = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {

        setParticipants([{ name: user?.fullName || "You", role: "Host" }]);

        stomp.subscribe("/topic/chat", msg => {
          const data = JSON.parse(msg.body);
        
          console.log("RECEIVED:", data); // DEBUG
        
          if (data.roomId === roomId) {
            setMessages(prev => [...prev, data]);
          }
        });

        stomp.subscribe(`/topic/code`, msg => {
          const data = JSON.parse(msg.body);
          if (data.roomId === roomId) {
            setCode(data.code);
          }
        });
      }
    });

    stomp.activate();
    setClient(stomp);

    return () => stomp.deactivate();
  }, [roomId]);

  // ================= CAMERA =================
  const startCamera = async () => {
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      setStream(media);
      localRef.current.srcObject = media;

      setCameraOn(true);
      setMicOn(true);
    } catch (err) {
      alert("Camera permission denied ❌");
    }
  };

  const toggleMic = () => {
    if (!stream) return;
    const track = stream.getAudioTracks()[0];
    track.enabled = !track.enabled;
    setMicOn(track.enabled);
  };

  const toggleCamera = () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    track.enabled = !track.enabled;
    setCameraOn(track.enabled);
  };

  const shareScreen = async () => {
    const screen = await navigator.mediaDevices.getDisplayMedia({ video: true });
    localRef.current.srcObject = screen;
  };

  // ================= CHAT =================
  const sendChat = () => {
    if (!chat.trim()) return;
  
    if (!client || !client.connected) {
      alert("Not connected to server ❌");
      return;
    }
  
    const msg = {
      roomId: roomId,
      sender: user?.fullName || "You",
      text: chat
    };
  
    client.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(msg)
    });
  
    setChat("");
  };

  // ================= CODE =================
  const syncCode = (val) => {
    setCode(val);

    if (!client?.connected) return;

    client.publish({
      destination: `/app/code.sync`,
      body: JSON.stringify({ roomId, code: val })
    });
  };

  // ================= INVITE =================
  const copyLink = () => {
    if (!roomId) return alert("Room invalid ❌");

    const link = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(link);

    alert("Invite link copied ✅");
  };

  // ================= MUTE =================
  const muteAll = () => {
    if (!stream) return alert("Start camera first");

    stream.getAudioTracks().forEach(t => t.enabled = false);
    setMicOn(false);

    alert("🔇 All muted");
  };

  const endMeeting = () => {
    window.location.href = "/";
  };

  return (
    <div className="room-container">

      {/* HEADER */}
      <div className="room-header">
        <h3 className="meeting-title">🎥 CodeMeetly Meeting</h3>

        <div>
          <button className="btn blue" onClick={copyLink}>Invite</button>
          <button className="btn red" onClick={endMeeting}>End</button>
        </div>
      </div>

      <div className="room-main">

        {/* LEFT */}
        <div className="left-sidebar">

          <div className="participants-panel">
            <h4>Participants ({participants.length})</h4>

            {participants.map((p, i) => (
              <div key={i}>{p.name} ({p.role})</div>
            ))}

            <button className="btn red" onClick={muteAll}>
              🔇 Mute All
            </button>
          </div>

          {/* CHAT */}
          <div className="chat-panel">

          <div className="chat-messages">
  {messages.map((m, i) => (
    <div key={i} className="chat-msg">
      <b>{m.sender}</b>: {m.text}
    </div>
  ))}
</div>

            <div className="chat-control">
              <input
                value={chat}
                onChange={e => setChat(e.target.value)}
                placeholder="Type message..."
              />
              <button onClick={sendChat}>➤</button>
            </div>

          </div>
        </div>

        {/* RIGHT */}
        <div className="right-content">

          {/* VIDEO */}
          <div className="video-wrapper">
  <video ref={localRef} autoPlay muted playsInline className="main-video" />

  <div className="video-controls">
    <button onClick={startCamera}>🎥</button>
    <button onClick={toggleMic}>{micOn ? "🎤" : "🔇"}</button>
    <button onClick={toggleCamera}>{cameraOn ? "📷" : "❌"}</button>
    <button onClick={shareScreen}>🖥</button>
  </div>
</div>

          {/* CODE */}
          <div className="editor-panel">
            <textarea
              value={code}
              onChange={(e) => syncCode(e.target.value)}
              placeholder="Write code..."
            />
          </div>

        </div>

      </div>

    </div>
  );
};

export default RoomView;