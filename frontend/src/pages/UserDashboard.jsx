import React, { useState, useEffect } from "react";
import axios from "axios";
import { Compass, ShoppingBag, History, Package, Clock, CheckCircle, Map, BookOpen, Globe } from "lucide-react";

// ✅ ADD THIS LINE (IMPORTANT)
const API_URL = import.meta.env.VITE_API_URL;

const UserDashboard = () => {
  const username = localStorage.getItem("username");
  const [orders, setOrders] = useState([]);
  const [tribes, setTribes] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [orderRes, tribeRes, enrollRes] = await Promise.all([
        axios.get(`${API_URL}/api/purchase/my-orders`, { headers }),
        axios.get(`${API_URL}/api/tribes/all`),
        axios.get(`${API_URL}/api/courses/my-enrollments`, { headers })
      ]);
      setOrders(orderRes.data.reverse());
      setTribes(tribeRes.data);
      setEnrollments(enrollRes.data.reverse());
    } catch (error) {
      console.error("Error fetching user data", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Purchased": return <Clock size={16} color="var(--terracotta)" />;
      case "Shipped": return <Package size={16} color="var(--saffron)" />;
      case "Delivered": return <CheckCircle size={16} color="#10b981" />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div style={{ paddingTop: "150px", padding: "150px 40px 60px", maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "60px", display: "flex", gap: "25px", alignItems: "center" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--indigo)", border: "4px solid white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}>
          <Compass size={40} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: "2.8rem" }}>Heritage <span style={{ color: "var(--terracotta)" }}>Journal</span></h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Welcome, Explorer {username}. Tracking your contribution to tribal heritage.</p>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "40px" }}>
        {/* Order History */}
        <div className="scrapbook-card" style={{ padding: "40px", borderTop: "8px solid var(--indigo)" }}>
          <h3 style={{ marginBottom: "30px", display: "flex", alignItems: "center", gap: "10px" }}>
            <History size={24} color="var(--terracotta)" /> My Purchase History
          </h3>
          
          {loading ? (
            <p>Gathering your heritage entries...</p>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
               <ShoppingBag size={48} color="var(--border-organic)" style={{ marginBottom: "20px" }} />
               <p style={{ color: "var(--text-dark)", fontWeight: 600 }}>Your journal is empty.</p>
               <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginTop: "10px" }}>Start your collection from the home page.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {orders.map((order) => (
                <div key={order.id} style={{ display: "flex", justifyContent: "space-between", background: "var(--bg-textured)", padding: "20px", borderRadius: "12px" }}>
                   <div style={{ display: "flex", gap: "15px" }}>
                      <img src={order.artifact.imageUrl} alt={order.artifact.title} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }} />
                      <div>
                        <h4 style={{ fontSize: "1.1rem" }}>{order.artifact.title}</h4>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "0.75rem", marginTop: "5px" }}>
                           {getStatusIcon(order.status)} <span style={{fontWeight: 700}}>{order.status}</span>
                        </div>
                      </div>
                   </div>
                   <div style={{ textAlign: "right" }}>
                      <p style={{ fontWeight: 800, color: "var(--terracotta)" }}>₹{order.amount}</p>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Universal Tribal News / Knowledge Bank */}
        <div className="scrapbook-card" style={{ padding: "40px" }}>
           <h3 style={{ marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
             <Map size={22} color="var(--terracotta)" /> Tribal Knowledge Bank
           </h3>
           <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxHeight: "600px", overflowY: "auto", paddingRight: "10px" }}>
              {tribes.length === 0 ? (
                <p style={{ fontStyle: "italic", fontSize: "0.9rem" }}>The curators are currently updating the tribal archives.</p>
              ) : tribes.map((info) => (
                <div key={info.id} style={{ borderBottom: "1px dashed var(--border-organic)", paddingBottom: "15px" }}>
                   <h4 style={{ color: "var(--indigo)", fontSize: "1.2rem", marginBottom: "8px" }}>{info.tribeName}</h4>
                   <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, marginBottom: "8px" }}>REGION: {info.region}</p>
                   <p style={{ fontSize: "0.9rem", color: "var(--text-dark)", lineHeight: 1.5 }}>{info.history}</p>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* My Courses Section */}
      <div className="scrapbook-card" style={{ padding: "40px", marginTop: "40px", borderTop: "8px solid var(--saffron)" }}>
        <h3 style={{ marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
          <BookOpen size={24} color="var(--terracotta)" /> My Language Courses
        </h3>
        {enrollments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Globe size={48} color="var(--border-organic)" style={{ marginBottom: "20px" }} />
            <p style={{ color: "var(--text-dark)", fontWeight: 600 }}>No courses enrolled yet.</p>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginTop: "10px" }}>Browse tribal language courses on the home page.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {enrollments.map(e => (
              <div key={e.id} style={{ display: "flex", gap: "15px", background: "var(--bg-textured)", borderRadius: "12px", overflow: "hidden", padding: "15px" }}>
                <img src={e.course?.imageUrl} alt={e.course?.title} style={{ width: "70px", height: "70px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: "var(--terracotta)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>{e.course?.language}</p>
                  <h4 style={{ fontSize: "1rem", margin: "4px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.course?.title}</h4>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.75rem" }}>
                    <CheckCircle size={14} color="#10b981" />
                    <span style={{ fontWeight: 700, color: "#10b981" }}>{e.status}</span>
                    <span style={{ color: "var(--text-muted)" }}>· ₹{e.amount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
