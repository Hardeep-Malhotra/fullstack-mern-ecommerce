// import { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import toast from "react-hot-toast";
// import { registerUser, clearError } from "../../redux/slices/authSlice";

// const RegisterForm = () => {
//   const [user, setUser] = useState({ name: "", email: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);

//   const { name, email, password } = user;

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Dynamic redirect path preserved from location state
//   const redirectPath = location.state?.from || "/";

//   const { loading, isAuthenticated, error } = useSelector(
//     (state) => state.auth || {},
//   );

//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//       dispatch(clearError());
//     }
//   }, [error, dispatch]);

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate(redirectPath, { replace: true });
//     }
//   }, [isAuthenticated, navigate, redirectPath]);

//   const handleChange = (e) => {
//     setUser({ ...user, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!name || !email || !password) {
//       toast.error("Please fill in all fields.");
//       return;
//     }

//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

//     if (!passwordRegex.test(password)) {
//       toast.error(
//         "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.",
//       );
//       return;
//     }

//     try {
//       await dispatch(registerUser(user)).unwrap();
//       toast.success("Account Created Successfully!");
//       navigate(redirectPath, { replace: true });
//     } catch (err) {
//       console.log("Registration failed:", err);
//     }
//   };

//   const handleGoogleAuth = () => {
//     window.location.href = "http://localhost:8000/api/v1/auth/google";
//   };

//   const checks = [
//     { label: "At least 1 uppercase letter", test: /[A-Z]/.test(password) },
//     { label: "At least 1 lowercase letter", test: /[a-z]/.test(password) },
//     { label: "At least 1 number", test: /\d/.test(password) },
//   ];

//   return (
//     <div className="flex items-center justify-center min-h-[85vh] bg-gradient-to-br from-orange-50 via-white to-slate-50 px-4 py-10">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-orange-100 animate-[fadeUp_0.5s_ease-out]">
//         {/* Logo mark */}
//         <div className="flex justify-center mb-4">
//           <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-2xl shadow-lg shadow-orange-200 animate-[popIn_0.5s_ease-out]">
//             🛍️
//           </div>
//         </div>

//         <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-1">
//           Create an Account
//         </h2>

//         <p className="text-center text-slate-500 mb-6 text-sm">
//           Join <span className="text-orange-500 font-semibold">Shopzy</span> to
//           start shopping
//         </p>

//         {/* Google OAuth Button */}
//         <button
//           type="button"
//           onClick={handleGoogleAuth}
//           className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-medium py-2.5 rounded-xl hover:border-orange-300 hover:bg-orange-50/50 hover:shadow-md transition-all duration-200 text-sm mb-4 active:scale-[0.98]"
//         >
//           <svg className="w-5 h-5" viewBox="0 0 24 24">
//             <path
//               fill="#4285F4"
//               d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//             />
//             <path
//               fill="#34A853"
//               d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//             />
//             <path
//               fill="#FBBC05"
//               d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
//             />
//             <path
//               fill="#EA4335"
//               d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
//             />
//           </svg>
//           Continue with Google
//         </button>

//         {/* Divider */}
//         <div className="relative my-4">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-slate-200"></div>
//           </div>
//           <div className="relative flex justify-center text-xs uppercase">
//             <span className="bg-white px-2 text-slate-400 font-medium">
//               Or continue with email
//             </span>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Name */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">
//               Full Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={name}
//               onChange={handleChange}
//               placeholder="John Doe"
//               required
//               className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none transition-all duration-200 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">
//               Email Address
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={email}
//               onChange={handleChange}
//               placeholder="you@example.com"
//               required
//               className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none transition-all duration-200 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={password}
//                 onChange={handleChange}
//                 placeholder="••••••••"
//                 required
//                 className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-300 outline-none transition-all duration-200 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors text-sm"
//               >
//                 {showPassword ? "🙈" : "👁️"}
//               </button>
//             </div>

//             {/* Live Password Validation */}
//             {password && (
//               <div className="mt-2 space-y-1 text-xs">
//                 {checks.map((c) => (
//                   <p
//                     key={c.label}
//                     className={`flex items-center gap-1.5 transition-colors duration-200 ${
//                       c.test ? "text-green-600" : "text-slate-400"
//                     }`}
//                   >
//                     <span
//                       className={`inline-block w-3.5 text-center transition-transform duration-200 ${
//                         c.test ? "scale-110" : "scale-100"
//                       }`}
//                     >
//                       {c.test ? "✓" : "○"}
//                     </span>
//                     {c.label}
//                   </p>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 text-sm shadow-md shadow-orange-200 hover:shadow-lg hover:shadow-orange-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 mt-2 flex items-center justify-center gap-2"
//           >
//             {loading && (
//               <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//             )}
//             {loading ? "Registering..." : "Create Account"}
//           </button>
//         </form>

//         {/* Login Link preserving state */}
//         <p className="text-center text-sm text-slate-600 mt-6">
//           Already have an account?{" "}
//           <Link
//             to="/login"
//             state={{ from: redirectPath }}
//             className="font-semibold text-orange-500 hover:text-orange-600 hover:underline transition-colors"
//           >
//             Sign In
//           </Link>
//         </p>
//       </div>

//       <style>{`
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(16px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes popIn {
//           from { opacity: 0; transform: scale(0.7); }
//           to { opacity: 1; transform: scale(1); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default RegisterForm;


import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { registerUser, clearError, clearMessage } from "../../redux/slices/authSlice";

const RegisterForm = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [role, setRole] = useState("user"); // "user" OR "seller"
  const [showPassword, setShowPassword] = useState(false);

  const { name, email, password } = user;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || "/";

  const { loading, isAuthenticated, error, message } = useSelector(
    (state) => state.auth || {}
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
    }
  }, [error, message, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number."
      );
      return;
    }

    try {
      // Role bhej rahe hain payload me
      const res = await dispatch(registerUser({ ...user, role })).unwrap();
      
      if (role === "seller") {
        toast.success(res.message || "Approval request sent to Admin!");
        navigate("/login");
      } else {
        toast.success("Account Created Successfully!");
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      console.log("Registration failed:", err);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = "http://localhost:8000/api/v1/auth/google";
  };

  const checks = [
    { label: "At least 1 uppercase letter", test: /[A-Z]/.test(password) },
    { label: "At least 1 lowercase letter", test: /[a-z]/.test(password) },
    { label: "At least 1 number", test: /\d/.test(password) },
  ];

  return (
    <div className="flex items-center justify-center min-h-[85vh] bg-gradient-to-br from-orange-50 via-white to-slate-50 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-orange-100 animate-[fadeUp_0.5s_ease-out]">
        
        {/* Logo mark */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-2xl shadow-lg shadow-orange-200">
            🛍️
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-1">
          Create an Account
        </h2>

        <p className="text-center text-slate-500 mb-4 text-sm">
          Join <span className="text-orange-500 font-semibold">NexusCart</span> today
        </p>

        {/* Account Type Toggle (User vs Seller) */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
              role === "user"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Customer Account
          </button>
          <button
            type="button"
            onClick={() => setRole("seller")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
              role === "seller"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Seller Account
          </button>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-medium py-2.5 rounded-xl hover:border-orange-300 hover:bg-orange-50/50 hover:shadow-md transition-all duration-200 text-sm mb-4 active:scale-[0.98]"
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
          Continue with Google
        </button>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400 font-medium">
              Or continue with email
            </span>
          </div>
        </div>

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
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none transition-all duration-200 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
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
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none transition-all duration-200 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleChange}
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

            {/* Live Password Validation */}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 text-sm shadow-md shadow-orange-200 hover:shadow-lg hover:shadow-orange-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 mt-2 flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {loading
              ? "Registering..."
              : role === "seller"
              ? "Apply for Seller Account"
              : "Create Customer Account"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            state={{ from: redirectPath }}
            className="font-semibold text-orange-500 hover:text-orange-600 hover:underline transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;