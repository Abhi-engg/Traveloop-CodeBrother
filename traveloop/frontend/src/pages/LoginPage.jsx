import { useForm } from "react-hook-form";
import { apiClient } from "../api/client";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm();

  const onSubmit = async (values) => {
    const response = await apiClient.post("/token/pair", {
      username: values.username,
      password: values.password,
    });
    login(response.data.access);
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-[var(--cream)] lg:grid-cols-[1.1fr_1fr]">
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

      <div className="flex items-center justify-center px-6 py-12">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-white p-8 shadow-[var(--shadow)]"
        >
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
              Welcome back
            </p>
            <h2 className="mt-2 text-3xl">Sign in to your travel studio</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium uppercase text-[var(--slate)]">
                Username
              </label>
              <input
                className="mt-2 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && (
                <p className="mt-1 text-xs text-rose-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium uppercase text-[var(--slate)]">
                Password
              </label>
              <input
                type="password"
                className="mt-2 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                {...register("password", { required: "Password is required" })}
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
            className="mt-6 w-full rounded-lg bg-[var(--indigo)] px-4 py-2 text-sm font-semibold text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
          <p className="mt-4 text-xs text-[var(--slate)]">
            New here?{" "}
            <span className="font-semibold text-[var(--indigo)]">
              Create an account
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
