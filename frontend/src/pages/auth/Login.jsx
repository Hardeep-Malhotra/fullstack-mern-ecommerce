import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { loginUser, clearError } from "../../redux/slices/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.auth || {},
  );

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      toast.success("Login Successful!");
      navigate("/");
    } catch (err) {
      console.log("Login failed:", err);
    }
  };

  const handleGoogleLogin = () => {
    sessionStorage.setItem("googleLogin", "true");
    window.location.href = "http://localhost:8000/api/v1/auth/google";
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] bg-gradient-to-br from-orange-50 via-white to-slate-50 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-orange-100 animate-[fadeUp_0.5s_ease-out]">
        {/* Logo mark */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-2xl shadow-lg shadow-orange-200 animate-[popIn_0.5s_ease-out]">
            🛍️
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-1">
          Welcome Back
        </h2>

        <p className="text-center text-slate-500 mb-6 text-sm">
          Sign in to continue to{" "}
          <span className="text-orange-500 font-semibold">Shopzy</span>
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none transition-all duration-200 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <Link
                to="/password/forgot"
                className="text-xs text-orange-500 hover:text-orange-600 hover:underline transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-300 outline-none transition-all duration-200 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors text-sm"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 text-sm shadow-md shadow-orange-200 hover:shadow-lg hover:shadow-orange-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-medium">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-semibold text-slate-700 hover:border-orange-300 hover:bg-orange-50/50 hover:shadow-md active:scale-[0.98] transition-all duration-200"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Sign in with Google
        </button>

        {/* Register */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-orange-500 hover:text-orange-600 hover:underline transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Login;
