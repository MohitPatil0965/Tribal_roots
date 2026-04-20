import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Payment from "./pages/Payment";
import CoursePayment from "./pages/CoursePayment";
import AdminDashboard from "./pages/AdminDashboard";
import ArtistDashboard from "./pages/ArtistDashboard";
import UserDashboard from "./pages/UserDashboard";
import TutorDashboard from "./pages/TutorDashboard";

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const handleStorageChange = () => {
      setUserRole(localStorage.getItem("role"));
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChange", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleStorageChange);
    };
  }, []);

  const getDashboard = () => {
    if (!userRole) return <Navigate to="/login" />;
    switch (userRole) {
      case "ADMIN":  return <AdminDashboard />;
      case "ARTIST": return <ArtistDashboard />;
      case "USER":   return <UserDashboard />;
      case "TUTOR":  return <TutorDashboard />;
      default:       return <Navigate to="/login" />;
    }
  };

  return (
    <Router>
      <Navbar userRole={userRole} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/payment/:artifactId" element={<Payment />} />
        <Route path="/course-payment/:courseId" element={<CoursePayment />} />
        <Route path="/dashboard" element={getDashboard()} />
      </Routes>
    </Router>
  );
}

export default App;
