import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", group: "", date: "", time: "", location: "", duration: "1 hour" });
  const [loading, setLoading] = useState(false);

  const load = () => {
    api.get("/sessions").then(r => setSessions(r.data));
    api.get("/groups").then(r => setGroups(r.data));
  };
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await api.post("/sessions", form);
      setShowModal(false);
      setForm({ title: "", group: "", date: "", time: "", location: "", duration: "1 hour" });
      load();
    } catch (err) { alert(err.response?.data?.error || "Failed"); }
    finally { setLoading(false); }
  };

  const del = async (id) => {
    if (!confirm("Delete this session?")) return;
    await api.delete(`/sessions/${id}`);
    load();
  };

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div><h1>Study Sessions</h1><p>Schedule and manage your group study sessions</p></div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Schedule Session</button>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">📅</div><p>No sessions scheduled yet.</p></div>
      ) : (
        sessions.map(s => (
          <div key={s._id} className="card session-card">
            <div className="session-date-box">
              <div className="day">{s.date?.split("-")[2] || "—"}</div>
              <div className="month">{s.date ? new Date(s.date + "T00:00:00").toLocaleString("default", { month: "short" }) : "—"}</div>
            </div>
            <div className="session-info" style={{ flex: 1 }}>
              <h3>{s.title}</h3>
              <p>
                {s.time && <span>🕐 {s.time} &nbsp;</span>}
                {s.duration && <span>⏱ {s.duration} &nbsp;</span>}
                {s.location && <span>📍 {s.location} &nbsp;</span>}
                {s.group?.name && <span>👥 {s.group.name}</span>}
              </p>
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => del(s._id)}>Delete</button>
          </div>
        ))
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Schedule a Session</h2>
            <form onSubmit={create}>
              <div className="form-group"><label>Session Title</label>
                <input className="input" placeholder="e.g. Midterm Review" value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
              <div className="form-group"><label>Group</label>
                <select className="input" value={form.group} onChange={e => setForm({ ...form, group: e.target.value })} required>
                  <option value="">— Select Group —</option>
                  {groups.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
                </select></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group"><label>Date</label>
                  <input className="input" type="date" value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })} required /></div>
                <div className="form-group"><label>Time</label>
                  <input className="input" type="time" value={form.time}
                    onChange={e => setForm({ ...form, time: e.target.value })} required /></div>
              </div>
              <div className="form-group"><label>Location</label>
                <input className="input" placeholder="Library Room 2B / Zoom" value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })} /></div>
              <div className="form-group"><label>Duration</label>
                <select className="input" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}>
                  {["30 min", "1 hour", "1.5 hours", "2 hours", "3 hours"].map(d => <option key={d}>{d}</option>)}
                </select></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Schedule"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
