import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { loginUser, clearError } from "../../redux/slices/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.auth || {}
  );

  // ==============================
  // Authentication Redirect
  // ==============================
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // ==============================
  // Error Toast
  // ==============================
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // ==============================
  // Login Submit
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      await dispatch(
        loginUser({
          email,
          password,
        })
      ).unwrap();

      toast.success("Login Successful!");
      navigate("/");
    } catch (error) {
      // Error is already handled by Redux + useEffect
      console.log("Login failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-slate-100">

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">
          Welcome Back
        </h2>

        <p className="text-center text-slate-500 mb-6 text-sm">
          Please enter your details to sign in
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
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
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
                className="text-xs text-indigo-600 hover:underline"
              >
                Forgot Password?
              </Link>

            </div>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition duration-200 text-sm shadow-md disabled:bg-indigo-400"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Register */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Don't have an account?{" "}

          <Link
            to="/register"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;