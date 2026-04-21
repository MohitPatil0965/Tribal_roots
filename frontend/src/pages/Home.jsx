import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowRight, Shield, Heart, ShoppingBag, Map, X, BookOpen, Clock, Globe } from "lucide-react";

// ✅ ADD THIS LINE (IMPORTANT)
const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const [artifacts, setArtifacts] = useState([]);
  const [tribalInfo, setTribalInfo] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedTribeId, setSelectedTribeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const marketplaceRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [artRes, tribalRes, courseRes] = await Promise.all([
        axios.get(`${API_URL}/api/artifacts/all`),
        axios.get(`${API_URL}/api/tribes/all`),
        axios.get(`${API_URL}/api/courses/all`)
      ]);
      setArtifacts(artRes.data);
      setTribalInfo(tribalRes.data);
      setCourses(courseRes.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTribeClick = (id) => {
    setSelectedTribeId(id);
    if (marketplaceRef.current) {
      marketplaceRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleBuy = (artifactId) => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    navigate(`/payment/${artifactId}`);
  };

  const filteredArtifacts = selectedTribeId 
    ? artifacts.filter(art => art.tribe?.id === selectedTribeId)
    : artifacts;

  const activeTribe = tribalInfo.find(t => t.id === selectedTribeId);

  return (
    <div style={{ paddingTop: "140px", paddingBottom: "100px" }}>
      {/* Hero Section */}
      <section style={{ 
        maxWidth: "1200px", 
        margin: "0 auto", 
        padding: "0 20px", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        textAlign: "center" 
      }}>
        <h1 style={{ fontSize: "5rem", fontWeight: 800, lineHeight: 1, marginBottom: "20px", color: "var(--text-dark)" }}>
          TRIBAL <span style={{ color: "var(--terracotta)" }}>ROOTS</span>
        </h1>
        <h3 style={{ fontSize: "1.5rem", letterSpacing: "8px", color: "var(--terracotta)", marginBottom: "30px", fontWeight: 700 }}>
          THE HERITAGE OF INDIA
        </h3>
        <p style={{ fontSize: "1.2rem", color: "var(--text-muted)", maxWidth: "700px", marginBottom: "40px", fontWeight: 500 }}>
          Step into a digital sanctuary where the ancient artistry of India's indigenous tribes comes to life. Explore, learn, and preserve.
        </p>

        <Link to="/login" className="btn-artisanal">
          Explore the Collection <ArrowRight size={20} />
        </Link>
      </section>

      {/* Tribal Info / Heritage Gallery Section */}
      {tribalInfo.length > 0 && (
        <section style={{ maxWidth: "1200px", margin: "100px auto", padding: "0 20px" }}>
           <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <h3 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>Heritage <span style={{ color: "var(--terracotta)" }}>Gallery</span></h3>
              <p style={{ color: "var(--text-muted)" }}>Click a card to explore curated artifacts from that tradition.</p>
           </div>
           
           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>
              {tribalInfo.map((info) => (
                <div 
                  key={info.id} 
                  className="scrapbook-card" 
                  onClick={() => handleTribeClick(info.id)}
                  style={{ 
                    padding: "30px", 
                    borderTop: `4px solid ${selectedTribeId === info.id ? "var(--terracotta)" : "var(--saffron)"}`,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    transform: selectedTribeId === info.id ? "scale(1.02)" : "auto",
                    boxShadow: selectedTribeId === info.id ? "0 20px 40px rgba(0,0,0,0.1)" : "auto"
                  }}
                >
                   <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                      <Map size={20} color="var(--terracotta)" />
                      <h4 style={{ fontSize: "1.4rem" }}>{info.tribeName}</h4>
                   </div>
                   <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "10px" }}>REGION: {info.region}</p>
                   <p style={{ fontSize: "0.95rem", color: "var(--text-dark)" }}>{info.history}</p>
                </div>
              ))}
           </div>
        </section>
      )}

      {/* Language Courses Section */}
      {courses.length > 0 && (
        <section style={{ maxWidth: "1200px", margin: "0 auto 0", padding: "80px 20px 0" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h3 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>Tribal <span style={{ color: "var(--terracotta)" }}>Language Courses</span></h3>
            <p style={{ color: "var(--text-muted)" }}>Learn the living languages of India's indigenous tribes from certified tutors.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>
            {courses.map(c => {
              const levelColors = { Beginner: "#10b981", Intermediate: "var(--saffron)", Advanced: "var(--terracotta)" };
              return (
                <div key={c.id} className="scrapbook-card" style={{ padding: "0", overflow: "hidden" }}>
                  <div style={{ position: "relative" }}>
                    <img src={c.imageUrl} alt={c.title} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                    <span style={{ position: "absolute", top: "15px", left: "15px", background: levelColors[c.level] || "var(--indigo)", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "0.7rem", fontWeight: 700 }}>{c.level}</span>
                  </div>
                  <div style={{ padding: "25px" }}>
                    <p style={{ color: "var(--terracotta)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px" }}>{c.language} · {c.durationWeeks} WEEKS</p>
                    <h4 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>{c.title}</h4>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "15px" }}>{c.description?.substring(0, 90)}...</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--indigo)" }}>₹{c.price}</span>
                      {localStorage.getItem("role") === "USER" ? (
                        <button
                          onClick={() => navigate(`/course-payment/${c.id}`)}
                          className="btn-artisanal"
                          style={{ padding: "10px 18px", fontSize: "0.85rem" }}
                        >
                          <BookOpen size={16} /> Enroll Now
                        </button>
                      ) : (
                        <Link to="/login" className="btn-artisanal" style={{ padding: "10px 18px", fontSize: "0.85rem" }}>
                          <BookOpen size={16} /> Enroll Now
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Marketplace Grid */}
      <section 
        ref={marketplaceRef}
        style={{ 
          maxWidth: "1300px", 
          margin: "100px auto 0", 
          padding: "40px 20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "40px"
        }}
      >
        <div style={{ gridColumn: "1/-1", textAlign: "center", marginBottom: "40px" }}>
            <h3 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
              {selectedTribeId ? (
                <>Artifacts of the <span style={{ color: "var(--terracotta)" }}>{activeTribe?.tribeName}</span> Tradition</>
              ) : (
                <>Artifacts for <span style={{ color: "var(--terracotta)" }}>Sale</span></>
              )}
            </h3>
            {selectedTribeId && (
              <button 
                onClick={() => setSelectedTribeId(null)}
                style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: "8px", 
                  background: "var(--bg-textured)", 
                  border: "1px solid var(--border-organic)",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  color: "var(--text-muted)"
                }}
              >
                <X size={16} /> Show All Traditional Arts
              </button>
            )}
        </div>
        
        {loading ? (
          <p style={{ textAlign: "center", width: "100%", gridColumn: "1/-1" }}>Loading cultural treasures...</p>
        ) : filteredArtifacts.length === 0 ? (
          <p style={{ textAlign: "center", width: "100%", gridColumn: "1/-1", padding: "60px", background: "var(--bg-textured)", borderRadius: "12px" }}>
            No artifacts found for this tradition yet. Check back as our artisans list new creations!
          </p>
        ) : filteredArtifacts.map((art, i) => (
          <div key={art.id} className="scrapbook-card" style={{ 
            padding: "20px"
          }}>
             <div style={{ 
               width: "100%", 
               height: "350px", 
               overflow: "hidden", 
               borderRadius: "2px",
               marginBottom: "20px",
               border: "1px solid var(--bg-textured)"
             }}>
                <img 
                  src={art.imageUrl} 
                  alt={art.title} 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
             </div>
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                   <p style={{ color: "var(--terracotta)", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px" }}>
                     {art.tribe?.tribeName || "Traditional Art"}
                   </p>
                   <h3 style={{ fontSize: "1.6rem", margin: "5px 0" }}>{art.title}</h3>
                </div>
                <div style={{ textAlign: "right" }}>
                   <p style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--indigo)" }}>₹{art.price}</p>
                </div>
             </div>
             <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "10px 0 20px" }}>
               {art.description}
             </p>
             
             {role === "USER" && (
                <button 
                  onClick={() => handleBuy(art.id)}
                  className="btn-artisanal" 
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <ShoppingBag size={18} /> Purchase Artifact
                </button>
             )}
          </div>
        ))}
      </section>

      {/* Philosophy Section */}
      <section style={{ 
        marginTop: "150px", 
        background: "var(--indigo)", 
        color: "white", 
        padding: "100px 20px" ,
        textAlign: "center"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "3rem", marginBottom: "30px" }}>The Artisan's Promise</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", marginTop: "60px" }}>
            <div>
              <Shield size={32} style={{ marginBottom: "15px" }} />
              <h4 style={{ marginBottom: "10px" }}>Ethically Sourced</h4>
              <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>Supporting tribal communities directly through fair trade practices.</p>
            </div>
            <div>
              <Heart size={32} style={{ marginBottom: "15px" }} />
              <h4 style={{ marginBottom: "10px" }}>Cultural Integrity</h4>
              <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>Every artifact is verified for its traditional significance and history.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
