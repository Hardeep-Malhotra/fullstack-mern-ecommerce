import { useEffect } from "react";
import toast from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // 1. Added useDispatch
import { Toaster } from "react-hot-toast";

// Redux Actions
import { loadUser } from "./redux/slices/authSlice"; // 2. Import loadUser thunk

// Layout Components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import AdminLayout from "./components/admin/AdminLayout";

// Public Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// User Protected Pages
import Profile from "./pages/user/Profile";
import Shipping from "./pages/cart/Shipping";
import ConfirmOrder from "./pages/cart/ConfirmOrder";
import Payment from "./pages/cart/Payment";
import MyOrders from "./pages/order/MyOrders";
import OrderDetails from "./pages/order/OrderDetails";

// Admin Protected Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import SystemHealth from "./pages/admin/SystemHealth";

// Route Guard
import ProtectedRoute from "./components/route/ProtectedRoute";

// Common
import NotFound from "./components/common/NotFound";

function App() {
  const dispatch = useDispatch();

  const {
    isAuthenticated = false,
    user = null,
    loading = true,
  } = useSelector((state) => state.auth || {});

  // 3. Dispatch loadUser on initial App mount (Page refresh ya Google redirect ke baad)
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const googleLogin = sessionStorage.getItem("googleLogin");

      if (googleLogin === "true") {
        toast.success(`Welcome back, ${user.name}!`);
        sessionStorage.removeItem("googleLogin");
      }
    }
  }, [isAuthenticated, user]);

  // 4. Loader screen jab tak session check ho raha hai
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Ambient glow blobs */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-[pulse_3s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-[pulse_3s_ease-in-out_infinite_1s]"></div>

        <div className="relative flex flex-col items-center">
          {/* Logo badge with spinning ring */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 border-r-orange-500 animate-spin"></div>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-2xl shadow-lg shadow-orange-900/50 animate-[pulse_2s_ease-in-out_infinite]">
              🛍️
            </div>
          </div>

          {/* Brand name */}
          <h1 className="mt-6 text-2xl font-extrabold text-white tracking-tight">
            Shopzy<span className="text-orange-500">.</span>
          </h1>

          {/* Status text + animated dots */}
          <p className="mt-2 text-sm text-slate-400 flex items-center gap-1">
            Syncing your experience
            <span className="flex gap-0.5">
              <span className="w-1 h-1 rounded-full bg-orange-500 animate-[bounce_1s_infinite_0ms]"></span>
              <span className="w-1 h-1 rounded-full bg-orange-500 animate-[bounce_1s_infinite_150ms]"></span>
              <span className="w-1 h-1 rounded-full bg-orange-500 animate-[bounce_1s_infinite_300ms]"></span>
            </span>
          </p>

          {/* Progress bar */}
          <div className="mt-6 w-48 h-1 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 animate-[loadingBar_1.4s_ease-in-out_infinite]"></div>
          </div>
        </div>

        <style>{`
        @keyframes loadingBar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(150%); }
          100% { transform: translateX(150%); }
        }
      `}</style>
      </div>
    );
  }

  return (
    <Router>
      {/* Toast Notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Common Header */}
      <Header />

      {/* Main Content */}
      <main className="min-h-[80vh]">
        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}

          <Route path="/" element={<Home />} />

          <Route path="/products" element={<Products />} />

          <Route path="/products/:id" element={<ProductDetails />} />

          <Route path="/cart" element={<Cart />} />

          {/* ================= AUTH ROUTES ================= */}

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          {/* Forgot Password */}
          <Route path="/password/forgot" element={<ForgotPassword />} />

          {/* Reset Password */}
          <Route path="/password/reset/:token" element={<ResetPassword />} />

          {/* ================= PROTECTED USER ROUTES ================= */}

          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/account" element={<Profile />} />

            <Route path="/shipping" element={<Shipping />} />

            <Route path="/order/confirm" element={<ConfirmOrder />} />

            <Route path="/process/payment" element={<Payment />} />

            <Route path="/orders" element={<MyOrders />} />

            <Route path="/order/:id" element={<OrderDetails />} />
          </Route>

          {/* ================= PROTECTED ADMIN ROUTES ================= */}

          <Route
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                isAdmin={true}
                user={user}
              />
            }
          >
            {/* Admin Layout wrapping all admin nested routes */}
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
              <Route path="/admin/system-health" element={<SystemHealth />} />
            </Route>
          </Route>
          {/* ================= 404 ROUTE ================= */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Common Footer */}
      <Footer />
    </Router>
  );
}

export default App;
