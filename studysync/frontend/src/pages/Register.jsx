import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">
          <h1>📚 StudySync</h1>
          <p>Create your account</p>
        </div>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handle}>
          <div className="form-group">
            <label>Full Name</label>
            <input className="input" placeholder="Your name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input className="input" type="email" placeholder="you@campus.edu" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="input" type="password" placeholder="Min. 6 characters" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select className="input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Creating account..." : "Create Account →"}
          </button>
        </form>
        <div className="auth-link">Already have an account? <Link to="/login">Sign in</Link></div>
      </div>
    </div>
  );
}
