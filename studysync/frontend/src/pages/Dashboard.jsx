import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    api.get("/groups").then(r => setGroups(r.data.slice(0, 6)));
    api.get("/sessions").then(r => setSessions(r.data.slice(0, 4)));
  }, []);

  const myGroups = groups.filter(g => g.members?.some(m => (m._id || m) === user?.id));

  return (
    <div className="page">
      <div className="welcome-card card" style={{ marginBottom: 28 }}>
        <h2>Welcome back, {user?.name} 👋</h2>
        <p>Ready to study smarter? Here's your overview.</p>
      </div>

      <div className="stats-grid">
        {[
          { icon: "👥", value: myGroups.length, label: "My Groups" },
          { icon: "📅", value: sessions.length,  label: "Upcoming Sessions" },
          { icon: "🎓", value: groups.length,    label: "Total Groups" },
          { icon: "⭐", value: user?.role === "admin" ? "Admin" : "Student", label: "Role" },
        ].map(s => (
          <div key={s.label} className="card stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <div className="section-title">My Groups</div>
          {myGroups.length === 0 ? (
            <div className="card" style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>
              <p>You haven't joined any groups yet.</p>
              <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => navigate("/groups")}>
                Browse Groups
              </button>
            </div>
          ) : (
            myGroups.map(g => (
              <div key={g._id} className="card" style={{ padding: "16px 20px", marginBottom: 10, cursor: "pointer" }}
                onClick={() => navigate(`/groups/${g._id}`)}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{g.name}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{g.subject} · {g.members?.length || 0} members</div>
              </div>
            ))
          )}
        </div>
        <div>
          <div className="section-title">Upcoming Sessions</div>
          {sessions.length === 0 ? (
            <div className="card" style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>
              <p>No sessions scheduled.</p>
              <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => navigate("/sessions")}>
                Schedule One
              </button>
            </div>
          ) : (
            sessions.map(s => (
              <div key={s._id} className="card session-card" style={{ marginBottom: 10 }}>
                <div className="session-date-box">
                  <div className="day">{s.date?.split("-")[2] || "—"}</div>
                  <div className="month">{s.date ? new Date(s.date).toLocaleString("default", { month: "short" }) : "—"}</div>
                </div>
                <div className="session-info">
                  <h3>{s.title}</h3>
                  <p>{s.time} · {s.location || "TBD"}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
