import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  const isAdmin = user?.role === "admin";

  return (
    <nav className="navbar">
      <NavLink to={isAdmin ? "/admin" : "/dashboard"} className="nav-logo">
        📚 StudySync
      </NavLink>

      <div className="nav-links">
        {isAdmin ? (
          /* ── ADMIN LINKS ── */
          <>
            <NavLink to="/admin" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
              📊 Overview
            </NavLink>
          </>
        ) : (
          /* ── STUDENT LINKS ── */
          <>
            <NavLink to="/dashboard" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>Dashboard</NavLink>
            <NavLink to="/groups"   className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>Groups</NavLink>
            <NavLink to="/sessions" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>Sessions</NavLink>
          </>
        )}
      </div>

      <div className="nav-right">
        {isAdmin && (
          <span className="badge badge-purple" style={{ fontSize: "0.75rem", padding: "4px 12px" }}>
            ⚙ Admin
          </span>
        )}
        <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{user?.name}</span>
        <div className="nav-avatar" style={{ background: isAdmin ? "linear-gradient(135deg, #f59e0b, #ef4444)" : undefined }}>
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <button onClick={handleLogout} className="btn btn-secondary btn-sm">Logout</button>
      </div>
    </nav>
  );
}
