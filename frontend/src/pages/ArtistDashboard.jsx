import React, { useState, useEffect } from "react";
import axios from "axios";
import { Palette, Share2, Plus, PenTool, IndianRupee, Image as ImageIcon, CheckCircle, Map } from "lucide-react";

// ✅ ADD THIS LINE (IMPORTANT)
const API_URL = import.meta.env.VITE_API_URL;

const ArtistDashboard = () => {
  const username = localStorage.getItem("username");
  const [myArtifacts, setMyArtifacts] = useState([]);
  const [sales, setSales] = useState([]);
  const [tribes, setTribes] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", price: "", imageUrl: "", tribeId: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    
    // Fetch Tribes separately so it's not blocked by auth-protected calls
    try {
      const tribeRes = await axios.get(`${API_URL}/api/tribes/all`);
      console.log("Tribes fetched successfully:", tribeRes.data);
      setTribes(tribeRes.data);
    } catch (error) {
      console.error("Error fetching tribes", error);
    }

    // Fetch stats and sales
    try {
      const [artRes, salesRes] = await Promise.all([
        axios.get(`${API_URL}/api/artifacts/my`, { headers }),
        axios.get(`${API_URL}/api/purchase/artist-sales`, { headers })
      ]);
      setMyArtifacts(artRes.data);
      setSales(salesRes.data);
    } catch (error) {
      console.error("Error fetching artist stats", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tribeId) {
      alert("Please select a tribe provided by the curators.");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      await axios.post("http://localhost:8080/api/artifacts/add", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Heritage artifact listed successfully!");
      setForm({ title: "", description: "", price: "", imageUrl: "", tribeId: "" });
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Error adding artifact. Ensure all fields are valid.");
    }
  };

  return (
    <div style={{ paddingTop: "150px", padding: "150px 40px 60px", maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "60px" }}>
        <h1 style={{ fontSize: "3rem" }}>Tribal <span style={{ color: "var(--terracotta)" }}>Artisan Studio</span></h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Welcome back, Master Artisan {username}. Share your craftsmanship with the world.</p>
      </header>

      {loading ? (
        <p>Loading studio data...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "40px" }}>
          {/* Add Artifact Form */}
          <div className="scrapbook-card" style={{ padding: "40px", height: "fit-content" }}>
            <h3 style={{ marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Plus size={22} color="var(--terracotta)" /> List New Creation
            </h3>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "20px" }}>
               Registry Status: {loading ? "Loading..." : `${tribes.length} tribes available`}
            </p>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
               <input 
                 type="text" placeholder="Artifact Title" className="input-artisanal" 
                 value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required 
               />
               
               <div style={{ position: "relative" }}>
                 <Map size={18} style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                 <select 
                    className="input-artisanal" 
                    style={{ paddingLeft: "45px" }}
                    value={form.tribeId} 
                    onChange={(e) => setForm({...form, tribeId: e.target.value})}
                    required
                 >
                   <option value="">Select Tribe</option>
                   {tribes.map(t => (
                     <option key={t.id} value={t.id}>{t.tribeName}</option>
                   ))}
                 </select>
               </div>

               <div style={{ position: "relative" }}>
                  <IndianRupee size={16} style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)" }} />
                  <input 
                    type="number" placeholder="Price" className="input-artisanal" style={{ paddingLeft: "40px" }}
                    value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} required 
                  />
               </div>
               <input 
                 type="text" placeholder="Image URL" className="input-artisanal" 
                 value={form.imageUrl} onChange={(e) => setForm({...form, imageUrl: e.target.value})} required 
               />
               <textarea 
                 placeholder="Cultural Story & Description" className="input-artisanal" rows="4"
                 value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} required 
               />
               <button type="submit" className="btn-artisanal" style={{ justifyContent: "center" }}>
                 List Artifact
               </button>
            </form>
          </div>

          {/* Right Column: Creations & Sales */}
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
             {/* Summary Stats */}
             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div className="scrapbook-card" style={{ textAlign: "center", padding: "20px" }}>
                   <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 700 }}>TOTAL LISTED</p>
                   <h2 style={{ fontSize: "2rem" }}>{myArtifacts.length}</h2>
                </div>
                <div className="scrapbook-card" style={{ textAlign: "center", padding: "20px", borderLeft: "4px solid var(--saffron)" }}>
                   <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 700 }}>TOTAL SALES</p>
                   <h2 style={{ fontSize: "2rem" }}>{sales.length}</h2>
                </div>
             </div>

             {/* Sales History */}
             <div className="scrapbook-card" style={{ padding: "30px" }}>
                <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckCircle size={20} color="var(--indigo)" /> Recent Sales
                </h3>
                {sales.length === 0 ? (
                  <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No sales yet. Your art will find its home soon.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                     {sales.map((sale) => (
                       <div key={sale.id} style={{ display: "flex", justifyContent: "space-between", padding: "15px", background: "var(--bg-textured)", borderRadius: "8px" }}>
                          <div>
                            <p style={{ fontWeight: 600 }}>{sale.artifact.title}</p>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Purchased by: {sale.buyer.username}</p>
                            <p style={{ fontSize: "0.7rem", color: "var(--terracotta)", fontWeight: 700 }}>STATUS: {sale.status}</p>
                          </div>
                          <p style={{ fontWeight: 700, color: "var(--terracotta)" }}>₹{sale.amount}</p>
                       </div>
                     ))}
                  </div>
                )}
             </div>

             {/* My Portfolio */}
             <div className="scrapbook-card" style={{ padding: "30px" }}>
                <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <Palette size={20} color="var(--terracotta)" /> My Portfolio
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px" }}>
                   {myArtifacts.map((art) => (
                     <div key={art.id} style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-organic)" }}>
                        <img src={art.imageUrl} alt={art.title} style={{ width: "100%", height: "100px", objectFit: "cover" }} />
                        <div style={{ padding: "10px" }}>
                          <p style={{ fontSize: "0.85rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{art.title}</p>
                          <p style={{ fontSize: "0.75rem", color: "var(--terracotta)" }}>₹{art.price}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistDashboard;
