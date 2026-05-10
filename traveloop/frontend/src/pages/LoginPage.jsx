import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/client";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [googleLoading, setGoogleLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm();

  /* ── Toggle between login / register ─────────────────────────── */
  const toggleMode = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    setApiError("");
    reset();
  };

  /* ── Email + password submit ─────────────────────────────────── */
  const onSubmit = async (values) => {
    setApiError("");
    try {
      const endpoint =
        mode === "register" ? "/auth/register" : "/auth/login";
      const body =
        mode === "register"
          ? {
              email: values.email,
              username: values.username,
              password: values.password,
              first_name: values.first_name || "",
              last_name: values.last_name || "",
            }
          : { email: values.email, password: values.password };

      const response = await apiClient.post(endpoint, body);
      login(response.data.access, response.data.user);
      navigate("/");
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setApiError(Array.isArray(detail) ? detail[0]?.msg || detail[0] : detail);
    }
  };

  /* ── Google OAuth ────────────────────────────────────────────── */
  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const response = await apiClient.get("/auth/google/login");
      window.location.href = response.data.url;
    } catch (err) {
      console.error("Failed to get Google login URL:", err);
      setGoogleLoading(false);
    }
  };

  const isLogin = mode === "login";

  return (
    <div className="grid min-h-screen grid-cols-1 bg-[var(--cream)] lg:grid-cols-[1.1fr_1fr]">
      {/* ── Left panel (branding) ───────────────────────────────── */}
      <div className="relative hidden items-center justify-center overflow-hidden bg-[var(--indigo)] text-white lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,107,71,0.4),_transparent_60%)]" />
        <div className="relative max-w-md space-y-6 px-10">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">
            Traveloop
          </p>
          <h1 className="text-4xl font-semibold leading-tight">
            Dream it. Plan it. Live it.
          </h1>
          <p className="text-sm text-white/80">
            Build multi-city itineraries, track budgets, and share a single link
            with your crew.
          </p>
          <div className="rounded-2xl bg-white/10 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
              Next up
            </p>
            <p className="mt-3 text-lg">Lisbon → Porto → Barcelona</p>
            <p className="mt-2 text-xs text-white/70">
              4 travelers • 11 days • $3.2k
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel (form) ──────────────────────────────────── */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-white p-8 shadow-[var(--shadow)]">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
              {isLogin ? "Welcome back" : "Get started"}
            </p>
            <h2 className="mt-2 text-3xl">
              {isLogin
                ? "Sign in to your travel studio"
                : "Create your account"}
            </h2>
          </div>

          {/* ── Google Sign-In Button ───────────────────────────── */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            id="google-login-btn"
            className="mb-4 flex w-full items-center justify-center gap-3 rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--indigo)] transition-all hover:border-[var(--slate)] hover:shadow-md disabled:opacity-60"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.97-6.19a24.01 24.01 0 0 0 0 21.56l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            {googleLoading ? "Redirecting…" : "Continue with Google"}
          </button>

          {/* ── Divider ────────────────────────────────────────── */}
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-xs text-[var(--slate)]">or</span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          {/* ── API Error Banner ────────────────────────────────── */}
          {apiError && (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-600">
              {apiError}
            </div>
          )}

          {/* ── Email / Password Form ──────────────────────────── */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* Name fields (register only) */}
              {!isLogin && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium uppercase text-[var(--slate)]">
                      First name
                    </label>
                    <input
                      className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                      placeholder="John"
                      {...register("first_name")}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase text-[var(--slate)]">
                      Last name
                    </label>
                    <input
                      className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                      placeholder="Doe"
                      {...register("last_name")}
                    />
                  </div>
                </div>
              )}

              {/* Username (register only) */}
              {!isLogin && (
                <div>
                  <label className="text-xs font-medium uppercase text-[var(--slate)]">
                    Username
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                    placeholder="johndoe"
                    {...register("username", {
                      required: "Username is required",
                      minLength: { value: 3, message: "At least 3 characters" },
                    })}
                  />
                  {errors.username && (
                    <p className="mt-1 text-xs text-rose-500">
                      {errors.username.message}
                    </p>
                  )}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="text-xs font-medium uppercase text-[var(--slate)]">
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                  placeholder="you@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-medium uppercase text-[var(--slate)]">
                  Password
                </label>
                <input
                  type="password"
                  className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                  placeholder={isLogin ? "••••••••" : "Min 6 characters"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: isLogin
                      ? undefined
                      : { value: 6, message: "At least 6 characters" },
                  })}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-rose-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-[var(--indigo)] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[var(--indigo-deep)] disabled:opacity-60"
              disabled={isSubmitting}
              id="login-submit-btn"
            >
              {isSubmitting
                ? isLogin
                  ? "Signing in…"
                  : "Creating account…"
                : isLogin
                  ? "Sign in"
                  : "Create account"}
            </button>
          </form>

          {/* ── Toggle login / register ────────────────────────── */}
          <p className="mt-5 text-center text-xs text-[var(--slate)]">
            {isLogin ? "New here? " : "Already have an account? "}
            <button
              type="button"
              onClick={toggleMode}
              className="font-semibold text-[var(--indigo)] underline-offset-2 hover:underline"
              id="toggle-auth-mode"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              {isLogin ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
