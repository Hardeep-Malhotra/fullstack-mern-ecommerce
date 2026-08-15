import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { registerUser, clearError } from "../../redux/slices/authSlice";

const RegisterForm = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.auth || {},
  );

  // =========================
  // Handle Backend Errors
  // =========================
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // =========================
  // Registration Success
  // =========================
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // =========================
  // Input Change
  // =========================
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // Submit
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.",
      );
      return;
    }

    try {
      await dispatch(registerUser(user)).unwrap();

      toast.success("Account Created Successfully!");
      navigate("/");
    } catch (error) {
      console.log("Registration failed:", error);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-[85vh] bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-slate-100">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">
          Create an Account
        </h2>

        <p className="text-center text-slate-500 mb-6 text-sm">
          Join NexusCart AI to start shopping
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* Password */}
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />

            {/* Live Password Validation */}
            {password && (
              <div className="mt-2 space-y-1 text-xs">
                <p
                  className={
                    /[A-Z]/.test(password) ? "text-green-600" : "text-red-500"
                  }
                >
                  {/[A-Z]/.test(password) ? "✓" : "✗"} At least 1 uppercase
                  letter
                </p>

                <p
                  className={
                    /[a-z]/.test(password) ? "text-green-600" : "text-red-500"
                  }
                >
                  {/[a-z]/.test(password) ? "✓" : "✗"} At least 1 lowercase
                  letter
                </p>

                <p
                  className={
                    /\d/.test(password) ? "text-green-600" : "text-red-500"
                  }
                >
                  {/\d/.test(password) ? "✓" : "✗"} At least 1 number
                </p>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition duration-200 text-sm shadow-md disabled:bg-indigo-400 mt-2"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
