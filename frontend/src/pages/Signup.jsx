import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { UserPlus, ShieldCheck, ShoppingBag, Database, ArrowRight } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({ 
    username: "", 
    password: "", 
    role: "USER" 
  });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/auth/register", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("role", res.data.role);
      
      // Navigate to correct dashboard based on role
      if (res.data.role === "ADMIN") navigate("/dashboard");
      else if (res.data.role === "ARTIST") navigate("/dashboard");
      else if (res.data.role === "TUTOR") navigate("/dashboard");
      else navigate("/dashboard");
      
      window.location.reload();
    } catch (error) {
      alert("Registration failed. This alias may already be in the registry.");
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "20px",
      background: "var(--bg-textured)"
    }}>
      <div className="scrapbook-card" style={{ maxWidth: "500px", width: "100%", padding: "50px" }}>
        <header style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ 
            width: "60px", 
            height: "60px", 
            background: "var(--terracotta)", 
            borderRadius: "15px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            margin: "0 auto 20px",
            boxShadow: "0 10px 20px rgba(188, 71, 54, 0.2)"
          }}>
            <UserPlus color="white" size={30} />
          </div>
          <h2 style={{ fontSize: "2.5rem" }}>Join the <span style={{ color: "var(--terracotta)" }}>Registry</span></h2>
          <p style={{ color: "var(--text-muted)", marginTop: "10px" }}>Begin your journey in the Heritage Gallery.</p>
        </header>

        <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="input-group">
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px", display: "block", textTransform: "uppercase" }}>Chosen Alias</label>
            <input 
              type="text" 
              className="input-artisanal" 
              placeholder="e.g. curator_mohit"
              value={formData.username} 
              onChange={(e) => setFormData({...formData, username: e.target.value})} 
              required 
            />
          </div>

          <div className="input-group">
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px", display: "block", textTransform: "uppercase" }}>Private Key</label>
            <input 
              type="password" 
              className="input-artisanal" 
              placeholder="••••••••"
              value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required 
            />
          </div>

          <div className="input-group">
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px", display: "block", textTransform: "uppercase" }}>Your Heritage Vocation</label>
            <select 
              className="input-artisanal"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              style={{ width: "100%", appearance: "none" }}
            >
              <option value="USER">Heritage Explorer (Visitor)</option>
              <option value="ARTIST">Master Artisan (Seller)</option>
              <option value="TUTOR">Language Tutor (Educator)</option>
              <option value="ADMIN">Chief Curator (Manager)</option>
            </select>
          </div>

          <button type="submit" className="btn-artisanal" style={{ width: "100%", justifyContent: "center", marginTop: "10px" }}>
            Create Heritage Account <ArrowRight size={20} />
          </button>
        </form>

        <footer style={{ marginTop: "30px", textAlign: "center", fontSize: "0.9rem" }}>
          <p style={{ color: "var(--text-muted)" }}>
            Already recorded in the gallery? <Link to="/login" style={{ color: "var(--terracotta)", fontWeight: 700 }}>Login here</Link>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Signup;
