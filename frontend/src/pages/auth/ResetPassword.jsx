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

  // Password conditions
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  const isPasswordValid =
    hasUppercase && hasLowercase && hasNumber;

  // =========================
  // Submit
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (!isPasswordValid) {
      toast.error(
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number."
      );
      return;
    }

    // Confirm password
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await dispatch(
        resetPassword({
          token,
          passwords: {
            password,
            confirmPassword,
          },
        })
      ).unwrap();

      toast.success("Password Reset Successfully!");

      navigate("/login");
    } catch (error) {
      toast.error(error || "Token invalid or expired");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-slate-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-slate-100"
      >
        {/* Heading */}
        <h2 className="text-2xl font-bold mb-2 text-slate-800 text-center">
          Reset Password
        </h2>

        <p className="text-sm text-slate-500 text-center mb-6">
          Create a new secure password for your account.
        </p>

        {/* ================= PASSWORD ================= */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            New Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />

          {/* Live Password Validation */}
          {password && (
            <div className="mt-2 space-y-1 text-xs">

              <p
                className={
                  hasUppercase
                    ? "text-green-600"
                    : "text-red-500"
                }
              >
                {hasUppercase ? "✓" : "✗"} At least 1 uppercase letter
              </p>

              <p
                className={
                  hasLowercase
                    ? "text-green-600"
                    : "text-red-500"
                }
              >
                {hasLowercase ? "✓" : "✗"} At least 1 lowercase letter
              </p>

              <p
                className={
                  hasNumber
                    ? "text-green-600"
                    : "text-red-500"
                }
              >
                {hasNumber ? "✓" : "✗"} At least 1 number
              </p>

            </div>
          )}
        </div>

        {/* ================= CONFIRM PASSWORD ================= */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Confirm Password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />

          {/* Password Match */}
          {confirmPassword && (
            <p
              className={`text-xs mt-2 ${
                password === confirmPassword
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {password === confirmPassword
                ? "✓ Passwords match"
                : "✗ Passwords do not match"}
            </p>
          )}
        </div>

        {/* ================= BUTTON ================= */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition duration-200 text-sm shadow-md disabled:bg-indigo-400"
        >
          {loading
            ? "Updating Password..."
            : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;