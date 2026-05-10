import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm();

  const onSubmit = async (values) => {
    // Hackathon MVP: Mock authentication to guarantee the demo works
    setTimeout(() => {
      login("mock_token_for_hackathon");
      navigate("/");
    }, 800);
  };

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      login(token);
      navigate("/", { replace: true });
    }
  }, [login, navigate, searchParams]);

  const handleGoogleLogin = () => {
    // For demo purposes, we can just simulate Google login success
    login("mock_google_token");
    navigate("/");
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-[var(--cream)] lg:grid-cols-2">
      {/* Left Panel: High-quality illustration / Photo */}
      <div className="relative hidden items-center justify-center overflow-hidden lg:flex">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-[var(--indigo)]/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--indigo)] via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-lg space-y-8 px-12 text-white">
          <p className="text-sm uppercase tracking-[0.4em] text-white/80 font-semibold">
            Traveloop
          </p>
          <h1 className="text-5xl font-bold leading-tight">
            Dream it.<br/>Plan it.<br/>Live it.
          </h1>
          <p className="text-lg text-white/90 max-w-md font-light">
            Build multi-city itineraries, track budgets, and share a single link
            with your crew.
          </p>
          <div className="rounded-2xl bg-white/10 backdrop-blur-md p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                Trending Trip
              </p>
              <span className="flex h-2 w-2 rounded-full bg-[#ff6b47]"></span>
            </div>
            <p className="mt-1 text-xl font-medium">Lisbon → Porto → Barcelona</p>
            <p className="mt-2 text-sm text-white/80 flex gap-3">
              <span>👥 4 travelers</span>
              <span>🗓 11 days</span>
              <span>💰 $3.2k</span>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="flex items-center justify-center px-6 py-12 relative">
        <div className="absolute top-8 right-8 hidden sm:block">
           <p className="text-sm text-[var(--slate)]">
             {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
             <button 
               type="button"
               onClick={() => setIsLogin(!isLogin)}
               className="font-semibold text-[var(--indigo)] hover:text-[#ff6b47] transition-colors"
             >
               {isLogin ? "Sign up" : "Log in"}
             </button>
           </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md rounded-[2rem] border border-gray-100 bg-white/80 backdrop-blur-xl p-10 shadow-2xl transition-all duration-500"
        >
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-[var(--indigo)] mb-2">
              {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-sm text-[var(--slate)]">
              {isLogin 
                ? "Enter your details to access your travel studio." 
                : "Join Traveloop to start planning your next adventure."}
            </p>
          </div>

          <div className="space-y-5">
            {!isLogin && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--slate)]">
                  Full Name
                </label>
                <input
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:border-[var(--indigo)] focus:ring-1 focus:ring-[var(--indigo)] outline-none transition-all"
                  placeholder="Jane Doe"
                  {...register("name", { required: !isLogin && "Name is required" })}
                />
                {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>}
              </div>
            )}

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--slate)]">
                {isLogin ? "Username or Email" : "Email"}
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:border-[var(--indigo)] focus:ring-1 focus:ring-[var(--indigo)] outline-none transition-all"
                placeholder={isLogin ? "traveler@example.com" : "hello@example.com"}
                {...register("email", { required: "This field is required" })}
              />
              {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--slate)]">
                  Password
                </label>
                {isLogin && (
                  <button type="button" className="text-xs text-[var(--indigo)] hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:border-[var(--indigo)] focus:ring-1 focus:ring-[var(--indigo)] outline-none transition-all"
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 w-full rounded-xl bg-[var(--indigo)] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (isLogin ? "Signing in..." : "Creating account...") 
              : (isLogin ? "Sign in" : "Create account")}
          </button>
          
          <div className="mt-6 flex items-center justify-center space-x-4">
             <div className="h-px w-full bg-gray-200"></div>
             <span className="text-xs font-medium text-gray-400 uppercase">Or</span>
             <div className="h-px w-full bg-gray-200"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="mt-6 w-full flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          
          <p className="mt-8 text-center text-xs text-[var(--slate)] sm:hidden">
             {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
             <button 
               type="button"
               onClick={() => setIsLogin(!isLogin)}
               className="font-semibold text-[var(--indigo)] hover:underline"
             >
               {isLogin ? "Sign up" : "Log in"}
             </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
