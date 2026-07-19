import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian-950 flex flex-col items-center justify-center text-slate-100 font-sans">
        <div className="w-12 h-12 border-4 border-cyan-accent border-t-transparent rounded-full animate-spin mb-4 shadow-glow" />
        <span className="text-sm font-medium tracking-wide text-cyan-accent uppercase">Loading Apex Motors...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
