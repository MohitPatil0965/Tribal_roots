import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Users, Database, ShieldCheck, Trash2, Plus, Info, Map, ChevronRight, Edit2, X } from "lucide-react";

const AdminDashboard = () => {
  const username = localStorage.getItem("username");
  const [stats, setStats] = useState({ totalArtifacts: 0, totalUsers: 0, totalArtists: 0 });
  const [users, setUsers] = useState([]);
  const [tribes, setTribes] = useState([]);
  const [infoForm, setInfoForm] = useState({ tribeName: "", history: "", region: "" });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [statsRes, usersRes, tribeRes] = await Promise.all([
        axios.get("http://localhost:8080/api/admin/stats", { headers }),
        axios.get("http://localhost:8080/api/admin/users", { headers }),
        axios.get("http://localhost:8080/api/tribes/all")
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setTribes(tribeRes.data);
    } catch (error) {
      console.error("Error fetching admin data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this explorer?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8080/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      alert("Error deleting user.");
    }
  };

  const handleDeleteTribe = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tribe entry? (Associated artifacts will also be removed)")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8080/api/admin/tribes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      alert("Error deleting tribe.");
    }
  };

  const handleEdit = (tribe) => {
    setIsEditing(true);
    setEditId(tribe.id);
    setInfoForm({
      tribeName: tribe.tribeName,
      region: tribe.region,
      history: tribe.history
    });
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setInfoForm({ tribeName: "", history: "", region: "" });
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8080/api/admin/tribes/${editId}`, infoForm, { headers });
        alert("Tribal Information updated successfully!");
      } else {
        await axios.post("http://localhost:8080/api/admin/tribal-info", infoForm, { headers });
        alert("Tribal Information added to the Heritage Gallery!");
      }
      setInfoForm({ tribeName: "", history: "", region: "" });
      setIsEditing(false);
      setEditId(null);
      fetchData();
    } catch (error) {
      console.error("Submission Error:", error.response?.data || error.message);
      alert(`Error submitting information: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div style={{ paddingTop: "150px", padding: "150px 40px 60px", maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "60px", textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem" }}>Chief <span style={{ color: "var(--terracotta)" }}>Curator Hub</span></h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Welcome back, Curator {username}. Managing the digital heritage.</p>
      </header>

      {/* Stats Section */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "30px", marginBottom: "60px" }}>
        <div className="scrapbook-card" style={{ borderLeft: "6px solid var(--terracotta)" }}>
          <Database size={28} color="var(--terracotta)" style={{ marginBottom: "15px" }} />
          <h4 style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 700 }}>TOTAL ARTIFACTS</h4>
          <h3 style={{ fontSize: "2.2rem", margin: "10px 0" }}>{stats.totalArtifacts}</h3>
        </div>
        <div className="scrapbook-card" style={{ borderLeft: "6px solid var(--indigo)" }}>
          <Users size={28} color="var(--indigo)" style={{ marginBottom: "15px" }} />
          <h4 style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 700 }}>TOTAL EXPLORERS</h4>
          <h3 style={{ fontSize: "2.2rem", margin: "10px 0" }}>{stats.totalUsers}</h3>
        </div>
        <div className="scrapbook-card" style={{ borderLeft: "6px solid var(--saffron)" }}>
          <ShieldCheck size={28} color="var(--saffron)" style={{ marginBottom: "15px" }} />
          <h4 style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 700 }}>TOTAL ARTISANS</h4>
          <h3 style={{ fontSize: "2.2rem", margin: "10px 0" }}>{stats.totalArtists}</h3>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "40px" }}>
        {/* User Management */}
        <div className="scrapbook-card" style={{ padding: "40px" }}>
           <h3 style={{ marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
             <Users size={22} color="var(--terracotta)" /> Manage Community
           </h3>
           <div style={{ display: "flex", flexDirection: "column", gap: "15px", maxHeight: "400px", overflowY: "auto" }}>
              {users.map((u) => (
                <div key={u.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px", background: "var(--bg-textured)", borderRadius: "8px" }}>
                   <div>
                      <p style={{ fontWeight: 600 }}>{u.username}</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>ROLE: {u.role}</p>
                   </div>
                   {u.username !== "admin" && (
                     <button onClick={() => handleDeleteUser(u.id)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>
                        <Trash2 size={18} />
                     </button>
                   )}
                </div>
              ))}
           </div>
        </div>

        {/* Tribe Form */}
        <div className="scrapbook-card" style={{ padding: "40px" }} ref={formRef}>
           <h3 style={{ marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
             <Info size={22} color="var(--terracotta)" /> {isEditing ? "Update Tribal History" : "Add Tribal History"}
           </h3>
           <form onSubmit={handleInfoSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <input 
                type="text" placeholder="Tribe Name" className="input-artisanal" 
                value={infoForm.tribeName} onChange={(e) => setInfoForm({...infoForm, tribeName: e.target.value})} required 
              />
              <input 
                type="text" placeholder="Region" className="input-artisanal" 
                value={infoForm.region} onChange={(e) => setInfoForm({...infoForm, region: e.target.value})} required 
              />
              <textarea 
                placeholder="History & Significance" className="input-artisanal" rows="4"
                value={infoForm.history} onChange={(e) => setInfoForm({...infoForm, history: e.target.value})} required 
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" className="btn-artisanal" style={{ flex: 1, justifyContent: "center" }}>
                  {isEditing ? <Edit2 size={18} /> : <Plus size={18} />} 
                  {isEditing ? "Update Registry" : "Publish to Gallery"}
                </button>
                {isEditing && (
                  <button type="button" onClick={cancelEdit} className="btn-artisanal" style={{ background: "var(--bg-textured)", color: "var(--text-dark)", border: "1px solid var(--border-organic)" }}>
                    <X size={18} />
                  </button>
                )}
              </div>
           </form>
        </div>
      </div>

      {/* Tribe Registry Table */}
      <div className="scrapbook-card" style={{ padding: "40px" }}>
         <h3 style={{ marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
            <Map size={22} color="var(--terracotta)" /> Heritage Registry
         </h3>
         <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
               <thead>
                  <tr style={{ textAlign: "left", borderBottom: "2px solid var(--border-organic)" }}>
                     <th style={{ padding: "15px" }}>TRIBE</th>
                     <th style={{ padding: "15px" }}>REGION</th>
                     <th style={{ padding: "15px" }}>HISTORY SNIPPET</th>
                     <th style={{ padding: "15px" }}>ACTION</th>
                  </tr>
               </thead>
               <tbody>
                  {tribes.map(t => (
                    <tr key={t.id} style={{ borderBottom: "1px solid var(--bg-textured)" }}>
                       <td style={{ padding: "15px", fontWeight: 700 }}>{t.tribeName}</td>
                       <td style={{ padding: "15px" }}>{t.region}</td>
                       <td style={{ padding: "15px", color: "var(--text-muted)" }}>{t.history?.substring(0, 80)}...</td>
                       <td style={{ padding: "15px" }}>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <button onClick={() => handleEdit(t)} style={{ color: "var(--indigo)", background: "none", border: "none", cursor: "pointer" }} title="Update Record">
                               <Edit2 size={18} />
                            </button>
                            <button onClick={() => handleDeleteTribe(t.id)} style={{ color: "var(--terracotta)", background: "none", border: "none", cursor: "pointer" }} title="Delete Record">
                               <Trash2 size={18} />
                            </button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
