import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Users, Database, ShieldCheck, Trash2, Plus, Info, Map, Edit2, X } from "lucide-react";

// ✅ ADD THIS LINE (IMPORTANT)
const API_URL = import.meta.env.VITE_API_URL;

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
        axios.get(`${API_URL}/api/admin/stats`, { headers }),
        axios.get(`${API_URL}/api/admin/users`, { headers }),
        axios.get(`${API_URL}/api/tribes/all`)
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
      await axios.delete(`${API_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchData();

    } catch (error) {
      alert("Error deleting user.");
    }
  };

  const handleDeleteTribe = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tribe entry?")) return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${API_URL}/api/admin/tribes/${id}`, {
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
        await axios.put(`${API_URL}/api/admin/tribes/${editId}`, infoForm, { headers });
        alert("Updated successfully!");
      } else {
        await axios.post(`${API_URL}/api/admin/tribal-info`, infoForm, { headers });
        alert("Added successfully!");
      }

      setInfoForm({ tribeName: "", history: "", region: "" });
      setIsEditing(false);
      setEditId(null);

      fetchData();

    } catch (error) {
      console.error(error);
      alert("Error submitting data");
    }
  };

  return (
    <div style={{ paddingTop: "150px", padding: "150px 40px 60px", maxWidth: "1200px", margin: "0 auto" }}>
      
      <h1>Welcome {username}</h1>

      <h2>Stats</h2>
      <p>Artifacts: {stats.totalArtifacts}</p>
      <p>Users: {stats.totalUsers}</p>
      <p>Artists: {stats.totalArtists}</p>

      <h2>Users</h2>
      {users.map((u) => (
        <div key={u.id}>
          {u.username} ({u.role})
          <button onClick={() => handleDeleteUser(u.id)}>Delete</button>
        </div>
      ))}

      <h2>Add / Edit Tribe</h2>
      <form onSubmit={handleInfoSubmit}>
        <input
          placeholder="Tribe Name"
          value={infoForm.tribeName}
          onChange={(e) => setInfoForm({ ...infoForm, tribeName: e.target.value })}
        />
        <input
          placeholder="Region"
          value={infoForm.region}
          onChange={(e) => setInfoForm({ ...infoForm, region: e.target.value })}
        />
        <textarea
          placeholder="History"
          value={infoForm.history}
          onChange={(e) => setInfoForm({ ...infoForm, history: e.target.value })}
        />
        <button type="submit">{isEditing ? "Update" : "Add"}</button>
      </form>

      <h2>Tribes</h2>
      {tribes.map((t) => (
        <div key={t.id}>
          {t.tribeName} - {t.region}
          <button onClick={() => handleEdit(t)}>Edit</button>
          <button onClick={() => handleDeleteTribe(t.id)}>Delete</button>
        </div>
      ))}

    </div>
  );
};

export default AdminDashboard;