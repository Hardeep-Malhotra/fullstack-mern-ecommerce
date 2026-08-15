import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth || {});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    dispatch(forgotPassword({ email }))
      .unwrap()
      .then((res) => toast.success(res.message || "Reset link sent to your email!"))
      .catch((err) => toast.error(err || "Failed to send reset link"));
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-slate-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-slate-100">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 text-center">Forgot Password</h2>
        <p className="text-sm text-slate-500 mb-6 text-center">
          Enter your registered email address to receive a password reset link.
        </p>

        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition duration-200 text-sm"
        >
          {loading ? "Sending Email..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;