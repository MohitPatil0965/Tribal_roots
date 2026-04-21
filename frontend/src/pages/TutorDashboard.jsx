import React, { useState, useEffect } from "react";
import axios from "axios";
import { BookOpen, Users, Plus, Globe, IndianRupee, Clock, BarChart2, CheckCircle } from "lucide-react";

// ✅ ADD THIS LINE (IMPORTANT)
const API_URL = import.meta.env.VITE_API_URL;

const TutorDashboard = () => {
  const username = localStorage.getItem("username");
  const [stats, setStats] = useState({ totalCourses: 0, totalEnrollments: 0 });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    language: "",
    price: "",
    imageUrl: "",
    durationWeeks: "",
    level: "Beginner"
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [statsRes, coursesRes] = await Promise.all([
        axios.get(`${API_URL}/api/tutor/stats`, { headers }),
        axios.get(`${API_URL}/api/tutor/courses/my`, { headers })
      ]);
      setStats(statsRes.data);
      setCourses(coursesRes.data);
    } catch (err) {
      console.error("Error fetching tutor data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post("http://localhost:8080/api/tutor/courses/add", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Language course listed successfully!");
      setForm({ title: "", description: "", language: "", price: "", imageUrl: "", durationWeeks: "", level: "Beginner" });
      fetchData();
    } catch (err) {
      alert("Error listing course. Please check all fields.");
    }
  };

  const levelColors = { Beginner: "#10b981", Intermediate: "var(--saffron)", Advanced: "var(--terracotta)" };

  return (
    <div style={{ paddingTop: "150px", padding: "150px 40px 60px", maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "60px" }}>
        <h1 style={{ fontSize: "3rem" }}>Language <span style={{ color: "var(--terracotta)" }}>Tutor Studio</span></h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Welcome, Tutor {username}. Share the wisdom of tribal languages.</p>
      </header>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "25px", marginBottom: "50px" }}>
        <div className="scrapbook-card" style={{ borderLeft: "6px solid var(--terracotta)", display: "flex", alignItems: "center", gap: "20px" }}>
          <BookOpen size={36} color="var(--terracotta)" />
          <div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 700 }}>COURSES LISTED</p>
            <h2 style={{ fontSize: "2.5rem" }}>{stats.totalCourses}</h2>
          </div>
        </div>
        <div className="scrapbook-card" style={{ borderLeft: "6px solid var(--indigo)", display: "flex", alignItems: "center", gap: "20px" }}>
          <Users size={36} color="var(--indigo)" />
          <div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 700 }}>TOTAL ENROLLMENTS</p>
            <h2 style={{ fontSize: "2.5rem" }}>{stats.totalEnrollments}</h2>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "40px" }}>
        {/* Add Course Form */}
        <div className="scrapbook-card" style={{ padding: "40px", height: "fit-content" }}>
          <h3 style={{ marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
            <Plus size={22} color="var(--terracotta)" /> List New Course
          </h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <input className="input-artisanal" placeholder="Course Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            <input className="input-artisanal" placeholder="Tribal Language (e.g. Gondi)" value={form.language} onChange={e => setForm({...form, language: e.target.value})} required />
            <select className="input-artisanal" value={form.level} onChange={e => setForm({...form, level: e.target.value})}>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <input className="input-artisanal" type="number" placeholder="Duration (weeks)" value={form.durationWeeks} onChange={e => setForm({...form, durationWeeks: e.target.value})} required />
            <input className="input-artisanal" type="number" placeholder="Price (₹)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
            <input className="input-artisanal" placeholder="Cover Image URL" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} required />
            <textarea className="input-artisanal" placeholder="Course Description & Curriculum" rows="4" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
            <button type="submit" className="btn-artisanal" style={{ justifyContent: "center" }}>
              <Globe size={18} /> Publish Course
            </button>
          </form>
        </div>

        {/* My Courses Portfolio */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
            <BookOpen size={22} color="var(--terracotta)" /> My Published Courses
          </h3>
          {loading ? (
            <p style={{ color: "var(--text-muted)" }}>Loading your studio...</p>
          ) : courses.length === 0 ? (
            <div className="scrapbook-card" style={{ padding: "40px", textAlign: "center" }}>
              <Globe size={48} color="var(--border-organic)" style={{ marginBottom: "15px" }} />
              <p style={{ color: "var(--text-muted)" }}>No courses yet. Start by listing your first tribal language course!</p>
            </div>
          ) : courses.map(c => (
            <div key={c.id} className="scrapbook-card" style={{ padding: "0", overflow: "hidden", display: "flex" }}>
              <img src={c.imageUrl} alt={c.title} style={{ width: "140px", height: "140px", objectFit: "cover", flexShrink: 0 }} />
              <div style={{ padding: "20px", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <span style={{ background: levelColors[c.level] || "var(--indigo)", color: "white", padding: "3px 10px", borderRadius: "20px", fontSize: "0.7rem", fontWeight: 700 }}>{c.level}</span>
                  <span style={{ color: "var(--terracotta)", fontSize: "0.75rem", fontWeight: 700 }}>{c.language.toUpperCase()}</span>
                </div>
                <h4 style={{ fontSize: "1.1rem", marginBottom: "6px" }}>{c.title}</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "10px" }}>{c.description?.substring(0, 80)}...</p>
                <div style={{ display: "flex", gap: "20px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  <span><Clock size={12} style={{ marginRight: "4px" }} />{c.durationWeeks} weeks</span>
                  <span style={{ fontWeight: 800, color: "var(--indigo)" }}>₹{c.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
