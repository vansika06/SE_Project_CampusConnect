import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
const socket = io(SOCKET_URL);

export default function GroupDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState("");
  const [files, setFiles] = useState([]);
  const [sessions, setSessions] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  let typingTimer = useRef(null);

  useEffect(() => {
    api.get("/groups").then(r => {
      const g = r.data.find(x => x._id === id);
      if (!g) { navigate("/groups"); return; }
      setGroup(g);
    });

    // Load persisted message history
    api.get(`/messages/group/${id}`).then(r => {
      setMessages(r.data.map(m => ({
        ...m,
        own: m.sender === user?.id || m.sender?._id === user?.id,
        time: m.createdAt,
      })));
    });

    api.get(`/files/group/${id}`).then(r => setFiles(r.data));
    api.get(`/sessions/group/${id}`).then(r => setSessions(r.data));

    socket.emit("join_group", id);

    socket.on("receive_message", (data) => {
      setMessages(prev => [...prev, data]);
    });

    socket.on("user_typing", (data) => {
      setTyping(`${data.name} is typing...`);
      clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => setTyping(""), 2000);
    });

    return () => {
      socket.off("receive_message");
      socket.off("user_typing");
    };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg = { groupId: id, senderId: user.id, senderName: user.name, content: input, time: new Date().toISOString() };
    socket.emit("send_message", msg);
    setMessages(prev => [...prev, { ...msg, own: true }]);
    setInput("");
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    socket.emit("typing", { groupId: id, name: user.name });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("groupId", id);
    try {
      const { data } = await api.post("/files/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const msg = { groupId: id, senderId: user.id, senderName: user.name, content: data.fileName, isFile: true, fileUrl: `http://localhost:5000${data.fileUrl}`, time: new Date().toISOString() };
      socket.emit("send_message", msg);
      setMessages(prev => [...prev, { ...msg, own: true }]);
      setFiles(prev => [...prev, { name: data.fileName, url: data.fileUrl, uploadedBy: user.name }]);
    } catch { alert("File upload failed"); }
  };

  const formatTime = (t) => new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="page" style={{ paddingBottom: 0 }}>
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate("/groups")}>← Back</button>
        <div>
          <h2 style={{ fontWeight: 700 }}>{group?.name}</h2>
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{group?.subject} · {group?.members?.length || 0} members</span>
        </div>
      </div>

      <div className="chat-layout">
        {/* LEFT: Members */}
        <div className="card chat-panel" style={{ overflowY: "auto" }}>
          <div className="section-title" style={{ marginBottom: 12 }}>Members</div>
          {group?.members?.map(m => (
            <div key={m._id || m} className="member-item">
              <div className="member-avatar">{(m.name || "U")[0].toUpperCase()}</div>
              <span className="member-name">{m.name || "Unknown"}</span>
            </div>
          ))}
        </div>

        {/* CENTER: Chat */}
        <div className="card chat-panel">
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="empty-state" style={{ padding: 30 }}>
                <div className="empty-icon">💬</div>
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}
            {messages.map((m, i) => {
              const isOwn = m.own || m.senderId === user?.id;
              return (
                <div key={i} className={`msg ${isOwn ? "own" : ""}`}>
                  <div className="msg-avatar">{(m.senderName || "U")[0].toUpperCase()}</div>
                  <div className="msg-bubble">
                    {!isOwn && <div className="msg-sender">{m.senderName}</div>}
                    {m.isFile ? (
                      <a className="msg-file-link" href={m.fileUrl} target="_blank" rel="noreferrer">📎 {m.content}</a>
                    ) : (
                      <div className="msg-text">{m.content}</div>
                    )}
                    <div className="msg-time">{formatTime(m.time || m.createdAt)}</div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          <div className="typing-indicator">{typing}</div>
          <div className="chat-input-bar">
            <input className="input" placeholder="Type a message..." value={input}
              onChange={handleTyping} onKeyDown={handleKeyDown} />
            <button className="btn btn-secondary btn-sm" onClick={() => fileInputRef.current?.click()} title="Attach file">📎</button>
            <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleFileUpload} />
            <button className="btn btn-primary btn-sm" onClick={sendMessage}>Send</button>
          </div>
        </div>

        {/* RIGHT: Files + Sessions */}
        <div className="card chat-panel" style={{ overflowY: "auto" }}>
          <div className="section-title" style={{ marginBottom: 12 }}>📁 Shared Files</div>
          {files.length === 0
            ? <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>No files yet</p>
            : files.map((f, i) => (
              <div key={i} className="file-item">
                <span className="file-icon">📄</span>
                <div className="file-info">
                  <a className="file-name" href={`http://localhost:5000${f.url}`} target="_blank" rel="noreferrer">{f.name}</a>
                  <div className="file-meta">by {f.uploadedBy}</div>
                </div>
              </div>
            ))}

          <div className="section-title" style={{ margin: "20px 0 12px" }}>📅 Sessions</div>
          {sessions.length === 0
            ? <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>No sessions yet</p>
            : sessions.map(s => (
              <div key={s._id} style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{s.title}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{s.date} {s.time} · {s.location || "TBD"}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
