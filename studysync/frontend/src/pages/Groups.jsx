import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Computer Science", "Biology", "History", "Literature", "Economics", "General"];

export default function Groups() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", subject: "General", description: "", tags: "", maxMembers: 20 });
  const [loading, setLoading] = useState(false);

  const load = () => api.get("/groups").then(r => setGroups(r.data));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await api.post("/groups", { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) });
      setShowModal(false);
      setForm({ name: "", subject: "General", description: "", tags: "", maxMembers: 20 });
      load();
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.error || err.message || "Network error";
      alert(`Error ${status || ""}: ${msg}`);
      console.error("Create group error:", err.response?.data || err.message);
    }
    finally { setLoading(false); }
  };

  const join = async (e, id) => {
    e.stopPropagation();
    try { await api.post(`/groups/${id}/join`); load(); }
    catch (err) { alert(err.response?.data?.error || "Failed to join"); }
  };

  const leave = async (e, id) => {
    e.stopPropagation();
    try { await api.post(`/groups/${id}/leave`); load(); }
    catch (err) { alert(err.response?.data?.error || "Failed to leave"); }
  };

  const isMember = (g) => g.members?.some(m => (m._id || m) === user?.id);

  const filtered = groups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1>Study Groups</h1>
            <p>Find and join groups to collaborate with peers</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Create Group</button>
        </div>
        <input className="input" style={{ marginTop: 20, maxWidth: 400 }} placeholder="🔍 Search groups..." value={search}
          onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">👥</div><p>No groups found. Create one!</p></div>
      ) : (
        <div className="grid-3">
          {filtered.map(g => (
            <div key={g._id} className="card group-card" onClick={() => navigate(`/groups/${g._id}`)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <span className="badge badge-purple">{g.subject}</span>
                <span className="member-count">👤 {g.members?.length || 0}/{g.maxMembers}</span>
              </div>
              <h3>{g.name}</h3>
              <p>{g.description || "No description provided."}</p>
              {g.tags?.length > 0 && (
                <div className="tag-list">{g.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
              )}
              <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                {isMember(g) ? (
                  <>
                    <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); navigate(`/groups/${g._id}`); }}>Open Chat</button>
                    <button className="btn btn-danger btn-sm" onClick={e => leave(e, g._id)}>Leave</button>
                  </>
                ) : (
                  <button className="btn btn-primary btn-sm" onClick={e => join(e, g._id)}>Join Group</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Create Study Group</h2>
            <form onSubmit={create}>
              <div className="form-group"><label>Group Name</label>
                <input className="input" placeholder="e.g. Calculus Study Squad" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="form-group"><label>Subject</label>
                <select className="input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select></div>
              <div className="form-group"><label>Description</label>
                <input className="input" placeholder="What will you study?" value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              <div className="form-group"><label>Tags (comma-separated)</label>
                <input className="input" placeholder="e.g. math, exam, online" value={form.tags}
                  onChange={e => setForm({ ...form, tags: e.target.value })} /></div>
              <div className="form-group"><label>Max Members</label>
                <input className="input" type="number" min={2} max={100} value={form.maxMembers}
                  onChange={e => setForm({ ...form, maxMembers: e.target.value })} /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Creating..." : "Create Group"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
