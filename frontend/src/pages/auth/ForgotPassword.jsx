import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth || {});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    dispatch(forgotPassword({ email }))
      .unwrap()
      .then((res) => {
        toast.success(res.message || "Reset link sent to your email!");
        setSent(true);
      })
      .catch((err) => toast.error(err || "Failed to send reset link"));
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
            ✉️
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-1">
          Forgot Password
        </h2>

        <p className="text-sm text-slate-500 text-center mb-6">
          Enter your registered email address to receive a password reset link.
        </p>

        <label className="block text-sm font-medium text-slate-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none transition-all duration-200 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 text-sm shadow-md shadow-orange-200 hover:shadow-lg hover:shadow-orange-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          )}
          {loading ? "Sending Email..." : "Send Reset Link"}
        </button>

        {sent && (
          <p className="text-center text-xs text-green-600 mt-4 animate-[fadeUp_0.4s_ease-out] flex items-center justify-center gap-1">
            <span>✓</span> Check your inbox for the reset link
          </p>
        )}
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

export default ForgotPassword;
