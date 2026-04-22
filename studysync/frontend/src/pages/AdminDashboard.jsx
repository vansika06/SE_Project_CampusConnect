import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [groups, setGroups] = useState([]);
  const [messages, setMessages] = useState([]);
  const [tab, setTab] = useState("groups");

  const load = () => {
    api.get("/admin/stats").then(r => setStats(r.data));
    api.get("/admin/groups").then(r => setGroups(r.data));
    api.get("/admin/messages").then(r => setMessages(r.data));
  };
  useEffect(() => { load(); }, []);

  const delGroup = async (id) => {
    if (!confirm("Delete this group?")) return;
    await api.delete(`/admin/group/${id}`);
    load();
  };

  const delMsg = async (id) => {
    await api.delete(`/admin/message/${id}`);
    load();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>⚙ Admin Dashboard</h1>
        <p>Monitor and moderate platform activity</p>
      </div>

      <div className="stats-grid">
        {[
          { icon: "👤", value: stats.users,    label: "Total Users"    },
          { icon: "👥", value: stats.groups,   label: "Total Groups"   },
          { icon: "💬", value: stats.messages, label: "Total Messages" },
          { icon: "📅", value: stats.sessions, label: "Total Sessions" },
        ].map(s => (
          <div key={s.label} className="card stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value ?? "—"}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button className={`btn ${tab === "groups" ? "btn-primary" : "btn-secondary"}`} onClick={() => setTab("groups")}>Groups</button>
        <button className={`btn ${tab === "messages" ? "btn-primary" : "btn-secondary"}`} onClick={() => setTab("messages")}>Messages</button>
      </div>

      {tab === "groups" && (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Group Name</th><th>Subject</th><th>Admin</th><th>Members</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {groups.map(g => (
                  <tr key={g._id}>
                    <td style={{ fontWeight: 600 }}>{g.name}</td>
                    <td><span className="badge badge-purple">{g.subject}</span></td>
                    <td>{g.admin?.name || "—"}</td>
                    <td>{g.members?.length || 0}</td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => delGroup(g._id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "messages" && (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Sender</th><th>Group</th><th>Content</th><th>Time</th><th>Action</th></tr>
              </thead>
              <tbody>
                {messages.map(m => (
                  <tr key={m._id}>
                    <td style={{ fontWeight: 600 }}>{m.senderName || "—"}</td>
                    <td>{m.group?.name || "—"}</td>
                    <td style={{ maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {m.isFile ? <span>📎 {m.fileName}</span> : m.content}
                    </td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{new Date(m.createdAt).toLocaleString()}</td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => delMsg(m._id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
