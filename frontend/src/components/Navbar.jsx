import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Compass, Home } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const isAuthenticated = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  return (
    <nav style={{
      position: "absolute",
      top: "0",
      left: "0",
      right: "0",
      height: "120px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 40px",
      zIndex: 1000
    }}>
      {/* Top Left: Login/Logout Stamp */}
      <div style={{ position: "absolute", left: "40px" }}>
        {!isAuthenticated ? (
          <Link to="/login" className="btn-circle" title="Login to Explorer Hub">
            <User size={24} />
          </Link>
        ) : (
          <button onClick={handleLogout} className="btn-circle" style={{ borderColor: "#ef4444", color: "#ef4444" }} title="Logout">
            <LogOut size={24} />
          </button>
        )}
      </div>


      {/* Top Right: Navigation */}
      <div style={{ position: "absolute", right: "40px", display: "flex", gap: "30px" }}>
        <Link to="/" style={{ color: "var(--text-dark)", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", fontWeight: 500 }}>
          <Home size={18} /> Home
        </Link>
        {isAuthenticated && (
          <Link to="/dashboard" style={{ color: "var(--text-dark)", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", fontWeight: 500 }}>
             <Compass size={18} /> Explorer Hub
          </Link>
        )}
      </div>

      {/* Decorative Line */}
      <div style={{
        position: "absolute",
        bottom: "20px",
        left: "10%",
        right: "10%",
        height: "1px",
        background: "var(--border-organic)",
        opacity: 0.5
      }} />
    </nav>
  );
};

export default Navbar;
