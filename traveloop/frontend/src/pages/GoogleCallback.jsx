import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiClient } from "../api/client";
import { useAuth } from "../hooks/useAuth";

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      setError("No authorization code received from Google.");
      return;
    }

    const exchangeCode = async () => {
      try {
        const response = await apiClient.post("/auth/google/callback", {
          code,
        });
        login(response.data.access, response.data.user);
        navigate("/", { replace: true });
      } catch (err) {
        console.error("Google auth failed:", err);
        setError(
          err.response?.data?.detail ||
            "Authentication failed. Please try again."
        );
      }
    };

    exchangeCode();
  }, [searchParams, login, navigate]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--cream)]">
        <div className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-white p-8 text-center shadow-[var(--shadow)]">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-rose-100 text-2xl text-rose-500">
            ✕
          </div>
          <h2 className="text-xl font-semibold">Login failed</h2>
          <p className="mt-2 text-sm text-[var(--slate)]">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 rounded-lg bg-[var(--indigo)] px-6 py-2 text-sm font-semibold text-white"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--cream)]">
      <div className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-white p-8 text-center shadow-[var(--shadow)]">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[var(--indigo)] border-t-transparent" />
        <p className="text-sm text-[var(--slate)]">
          Completing Google sign-in…
        </p>
      </div>
    </div>
  );
};

export default GoogleCallback;
