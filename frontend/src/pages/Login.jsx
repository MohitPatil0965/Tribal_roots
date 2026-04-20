import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { User, Lock, Loader2, ArrowRight } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("username", response.data.username);
      window.dispatchEvent(new Event("authChange"));
      navigate("/dashboard");
    } catch (err) {
      setError("The spirits don't recognize those credentials. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      padding: "20px",
      paddingTop: "120px"
    }}>
      <div className="scrapbook-card" style={{ width: "100%", maxWidth: "450px", padding: "50px", borderTop: "8px solid var(--terracotta)" }}>
        <h2 style={{ fontSize: "2.5rem", marginBottom: "10px", textAlign: "center", color: "var(--text-dark)" }}>Welcome Home</h2>
        <p style={{ color: "var(--text-muted)", textAlign: "center", marginBottom: "40px", fontSize: "0.9rem" }}>
          Log in to our digital sanctuary
        </p>
        
        {error && <div style={{ 
          color: "var(--terracotta)", 
          background: "rgba(181, 66, 45, 0.05)", 
          padding: "15px", 
          borderRadius: "8px", 
          marginBottom: "25px", 
          textAlign: "center", 
          border: "1px solid var(--border-organic)",
          fontSize: "0.85rem"
        }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "var(--text-dark)", fontSize: "0.85rem", fontWeight: 600 }}>USERNAME</label>
            <div style={{ position: "relative" }}>
              <User style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} size={18} />
              <input 
                type="text" 
                className="input-artisanal" 
                style={{ paddingLeft: "45px" }} 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "var(--text-dark)", fontSize: "0.85rem", fontWeight: 600 }}>PASSWORD</label>
            <div style={{ position: "relative" }}>
              <Lock style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} size={18} />
              <input 
                type="password" 
                className="input-artisanal" 
                style={{ paddingLeft: "45px" }} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <button type="submit" className="btn-artisanal" disabled={loading} style={{ width: "100%", justifyContent: "center", marginTop: "10px" }}>
            {loading ? <Loader2 className="spinning" /> : <>Enter Sanctuary <ArrowRight size={18} /></>}
          </button>
        </form>

        <div style={{ marginTop: "40px", textAlign: "center", borderTop: "1px dashed var(--border-organic)", paddingTop: "20px" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "12px" }}>
            New to the Heritage Gallery?
          </p>
          <Link to="/signup" style={{ 
            display: "inline-flex", 
            alignItems: "center",
            gap: "6px",
            color: "var(--terracotta)", 
            fontWeight: 700, 
            fontSize: "0.9rem",
            textDecoration: "none",
            borderBottom: "2px solid var(--saffron)",
            paddingBottom: "2px"
          }}>
            Join the Heritage Registry →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
