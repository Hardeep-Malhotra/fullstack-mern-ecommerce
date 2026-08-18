import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth || {});

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const isPasswordValid = hasUppercase && hasLowercase && hasNumber;

  const checks = [
    { label: "At least 1 uppercase letter", test: hasUppercase },
    { label: "At least 1 lowercase letter", test: hasLowercase },
    { label: "At least 1 number", test: hasNumber },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error(
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.",
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await dispatch(
        resetPassword({ token, passwords: { password, confirmPassword } }),
      ).unwrap();

      toast.success("Password Reset Successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error || "Token invalid or expired");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-orange-50 via-white to-slate-50 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-orange-100 animate-[fadeUp_0.5s_ease-out]"
      >
        {/* Logo mark */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-2xl shadow-lg shadow-orange-200 animate-[popIn_0.5s_ease-out]">
            🔒
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-1">
          Reset Password
        </h2>

        <p className="text-sm text-slate-500 text-center mb-6">
          Create a new secure password for your account.
        </p>

        {/* New Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            New Password
          </label>

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

          {password && (
            <div className="mt-2 space-y-1 text-xs">
              {checks.map((c) => (
                <p
                  key={c.label}
                  className={`flex items-center gap-1.5 transition-colors duration-200 ${
                    c.test ? "text-green-600" : "text-slate-400"
                  }`}
                >
                  <span
                    className={`inline-block w-3.5 text-center transition-transform duration-200 ${
                      c.test ? "scale-110" : "scale-100"
                    }`}
                  >
                    {c.test ? "✓" : "○"}
                  </span>
                  {c.label}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Confirm Password
          </label>

          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none transition-all duration-200 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />

          {confirmPassword && (
            <p
              className={`text-xs mt-2 flex items-center gap-1.5 transition-colors duration-200 ${
                password === confirmPassword ? "text-green-600" : "text-red-500"
              }`}
            >
              {password === confirmPassword
                ? "✓ Passwords match"
                : "✗ Passwords do not match"}
            </p>
          )}
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
          {loading ? "Updating Password..." : "Update Password"}
        </button>
      </form>

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

export default ResetPassword;
