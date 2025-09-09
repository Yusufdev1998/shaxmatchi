import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const { signInWithGoogle, loading, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && user) {
      navigate("/", { replace: true });
    }
  }, [loading, user, navigate]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate("/", { replace: true });
    } catch (e) {
      console.error(e);
      alert("Failed to sign in. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-6">Sign in</h1>
        <button
          onClick={handleSignIn}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          disabled={loading}
        >
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
}
