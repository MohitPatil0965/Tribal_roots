import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { CreditCard, Smartphone, Building2, CheckCircle, ArrowLeft, Lock, IndianRupee, Globe, Clock, BarChart2 } from "lucide-react";

const CoursePayment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [form, setForm] = useState({ cardNumber: "", cardName: "", expiry: "", cvv: "", upi: "", netBankingBank: "" });

  useEffect(() => {
    axios.get("http://localhost:8080/api/courses/all")
      .then(res => {
        const found = res.data.find(c => String(c.id) === String(courseId));
        setCourse(found);
      })
      .catch(err => console.error("Failed to fetch courses", err));
  }, [courseId]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:8080/api/courses/enroll/${courseId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPaid(true);
    } catch (err) {
      alert("Enrollment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const levelColors = { Beginner: "#10b981", Intermediate: "var(--saffron)", Advanced: "var(--terracotta)" };

  if (paid) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-textured)", paddingTop: "100px" }}>
        <div className="scrapbook-card" style={{ maxWidth: "480px", width: "100%", padding: "60px", textAlign: "center" }}>
          <div style={{ width: "80px", height: "80px", background: "#10b981", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 30px", boxShadow: "0 15px 30px rgba(16,185,129,0.25)" }}>
            <CheckCircle color="white" size={40} />
          </div>
          <h2 style={{ fontSize: "2rem", marginBottom: "15px" }}>Enrollment <span style={{ color: "#10b981" }}>Confirmed!</span></h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "10px" }}>You are now enrolled in <strong>{course?.title}</strong>.</p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "40px" }}>Check your Heritage Journal to begin your learning journey.</p>
          <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/dashboard")} className="btn-artisanal">View My Courses</button>
            <button onClick={() => navigate("/")} style={{ padding: "12px 24px", border: "2px solid var(--border-organic)", background: "none", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "130px 20px 60px", background: "var(--bg-textured)" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", marginBottom: "30px", fontSize: "0.95rem" }}>
          <ArrowLeft size={18} /> Back to Gallery
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "30px", alignItems: "start" }}>
          {/* Course Summary */}
          <div className="scrapbook-card" style={{ padding: "35px", borderTop: "4px solid var(--saffron)" }}>
            <h3 style={{ marginBottom: "20px", fontSize: "1.2rem" }}>Enrollment Summary</h3>
            {course ? (
              <>
                <div style={{ borderRadius: "10px", overflow: "hidden", marginBottom: "20px", border: "1px solid var(--border-organic)" }}>
                  <img src={course.imageUrl} alt={course.title} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
                </div>
                <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                  <span style={{ background: levelColors[course.level] || "var(--indigo)", color: "white", padding: "3px 10px", borderRadius: "20px", fontSize: "0.7rem", fontWeight: 700 }}>{course.level}</span>
                  <span style={{ background: "var(--bg-textured)", padding: "3px 10px", borderRadius: "20px", fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", border: "1px solid var(--border-organic)" }}>{course.language}</span>
                </div>
                <h4 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>{course.title}</h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "15px" }}>{course.description}</p>
                <div style={{ display: "flex", gap: "15px", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "20px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Clock size={14} /> {course.durationWeeks} weeks</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Globe size={14} /> {course.language}</span>
                </div>
                <div style={{ borderTop: "1px dashed var(--border-organic)", paddingTop: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.9rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>Course Fee</span>
                    <span>₹{course.price}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.9rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>Platform Fee</span>
                    <span style={{ color: "#10b981" }}>FREE</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px", paddingTop: "15px", borderTop: "2px solid var(--border-organic)", fontWeight: 800, fontSize: "1.1rem" }}>
                    <span>Total</span>
                    <span style={{ color: "var(--terracotta)" }}>₹{course.price}</span>
                  </div>
                </div>
              </>
            ) : <p style={{ color: "var(--text-muted)" }}>Loading course details...</p>}
          </div>

          {/* Payment Form */}
          <div className="scrapbook-card" style={{ padding: "35px", borderTop: "4px solid var(--terracotta)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "25px" }}>
              <Lock size={18} color="var(--terracotta)" />
              <h3 style={{ fontSize: "1.2rem" }}>Secure Payment</h3>
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
              {[{ id: "card", label: "Card", icon: <CreditCard size={16} /> }, { id: "upi", label: "UPI", icon: <Smartphone size={16} /> }, { id: "netbanking", label: "Net Banking", icon: <Building2 size={16} /> }].map(m => (
                <button key={m.id} onClick={() => setPaymentMethod(m.id)} style={{ flex: 1, padding: "12px 8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", border: paymentMethod === m.id ? "2px solid var(--terracotta)" : "2px solid var(--border-organic)", borderRadius: "8px", background: paymentMethod === m.id ? "rgba(188,71,54,0.05)" : "none", color: paymentMethod === m.id ? "var(--terracotta)" : "var(--text-muted)", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem", fontFamily: "inherit", transition: "all 0.2s" }}>
                  {m.icon} {m.label}
                </button>
              ))}
            </div>

            <form onSubmit={handlePayment} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {paymentMethod === "card" && (
                <>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "8px", textTransform: "uppercase" }}>Card Number</label>
                    <input className="input-artisanal" type="text" placeholder="1234 5678 9012 3456" maxLength="19" value={form.cardNumber} onChange={e => { const v = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim(); setForm({...form, cardNumber: v}); }} required />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "8px", textTransform: "uppercase" }}>Cardholder Name</label>
                    <input className="input-artisanal" type="text" placeholder="Name as on card" value={form.cardName} onChange={e => setForm({...form, cardName: e.target.value})} required />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "8px", textTransform: "uppercase" }}>Expiry</label>
                      <input className="input-artisanal" type="text" placeholder="MM / YY" maxLength="7" value={form.expiry} onChange={e => setForm({...form, expiry: e.target.value})} required />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "8px", textTransform: "uppercase" }}>CVV</label>
                      <input className="input-artisanal" type="password" placeholder="•••" maxLength="3" value={form.cvv} onChange={e => setForm({...form, cvv: e.target.value})} required />
                    </div>
                  </div>
                </>
              )}
              {paymentMethod === "upi" && (
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "8px", textTransform: "uppercase" }}>UPI ID</label>
                  <input className="input-artisanal" type="text" placeholder="yourname@upi" value={form.upi} onChange={e => setForm({...form, upi: e.target.value})} required />
                </div>
              )}
              {paymentMethod === "netbanking" && (
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "8px", textTransform: "uppercase" }}>Select Your Bank</label>
                  <select className="input-artisanal" value={form.netBankingBank} onChange={e => setForm({...form, netBankingBank: e.target.value})} required>
                    <option value="">-- Select Bank --</option>
                    <option value="SBI">State Bank of India</option>
                    <option value="HDFC">HDFC Bank</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="AXIS">Axis Bank</option>
                    <option value="PNB">Punjab National Bank</option>
                    <option value="KOTAK">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}
              <button type="submit" className="btn-artisanal" disabled={loading} style={{ width: "100%", justifyContent: "center", marginTop: "10px", fontSize: "1rem", padding: "18px" }}>
                {loading ? "Processing..." : <><IndianRupee size={20} /> Pay & Enroll — ₹{course?.price || "..."}</>}
              </button>
              <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                <Lock size={12} /> 256-bit encrypted secure payment
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePayment;
