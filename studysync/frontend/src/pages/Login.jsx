import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      login(data.user, data.token);
      // Redirect based on role
      navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">
          <h1>📚 StudySync</h1>
          <p>Campus Study Group & Collaboration Platform</p>
        </div>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handle}>
          <div className="form-group">
            <label>Email Address</label>
            <input className="input" type="email" placeholder="you@campus.edu" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="input" type="password" placeholder="Enter your password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>
        <div className="auth-link">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}
