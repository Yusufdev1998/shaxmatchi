import React from "react";
import NavBar from "../components/NavBar";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate("/signin", { replace: true });
    }
  }, [loading, user, navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar title="Admin Dashboard" />
      <div className="p-4 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Welcome{user?.displayName ? ", " + user.displayName : ""}!</h2>
          <p className="text-gray-600">This is the admin dashboard placeholder.</p>
        </div>
      </div>
    </div>
  );
}
