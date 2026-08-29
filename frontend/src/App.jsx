import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";

// Redux
import { loadUser } from "./redux/slices/authSlice";

// Layouts
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import AdminLayout from "./components/admin/AdminLayout";
import SellerLayout from "./components/seller/SellerLayout";

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

// User Pages
import Profile from "./pages/user/Profile";
import Shipping from "./pages/cart/Shipping";
import ConfirmOrder from "./pages/cart/ConfirmOrder";
import Payment from "./pages/cart/Payment";
import MyOrders from "./pages/order/MyOrders";
import OrderDetails from "./pages/order/OrderDetails";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import SystemHealth from "./pages/admin/SystemHealth";

// Seller Pages
import SellerDashboard from "./pages/seller/sellerDashboard";
import SellerProducts from "./pages/seller/SellerProducts";
import SellerOrders from "./pages/seller/SellerOrders";
import SellerOrderDetails from "./pages/seller/SellerOrderDetails";

// Route Guard
import ProtectedRoute from "./components/route/ProtectedRoute";
import DashboardRedirect from "./components/route/DashboardRedirect";

// Common
import NotFound from "./components/common/NotFound";

/* =========================================================
   APP CONTENT
========================================================= */

function AppContent() {
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    isAuthenticated = false,
    user = null,
    loading = true,
  } = useSelector((state) => state.auth || {});

  /* =========================================================
     DASHBOARD ROUTE CHECK
  ========================================================= */

  const isDashboardRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/seller");

  /* =========================================================
     LOAD USER
  ========================================================= */

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  /* =========================================================
     GOOGLE LOGIN TOAST
  ========================================================= */

  useEffect(() => {
    if (isAuthenticated && user) {
      const googleLogin = sessionStorage.getItem("googleLogin");

      if (googleLogin === "true") {
        toast.success(`Welcome back, ${user.name}!`);

        sessionStorage.removeItem("googleLogin");
      }
    }
  }, [isAuthenticated, user]);

  /* =========================================================
     LOADING SCREEN
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-[pulse_3s_ease-in-out_infinite]" />

        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-[pulse_3s_ease-in-out_infinite_1s]" />

        <div className="relative flex flex-col items-center">
          {/* Logo */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-slate-800" />

            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 border-r-orange-500 animate-spin" />

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-2xl shadow-lg shadow-orange-900/50">
              🛍️
            </div>
          </div>

          <h1 className="mt-6 text-2xl font-extrabold text-white tracking-tight">
            Shopzy<span className="text-orange-500">.</span>
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Syncing your experience...
          </p>

          <div className="mt-6 w-48 h-1 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 animate-[loadingBar_1.4s_ease-in-out_infinite]" />
          </div>
        </div>

        <style>{`
          @keyframes loadingBar {
            0% {
              transform: translateX(-100%);
            }

            50% {
              transform: translateX(150%);
            }

            100% {
              transform: translateX(150%);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      {/* =====================================================
          TOASTER
      ===================================================== */}

      <Toaster position="top-right" reverseOrder={false} />

      {/* =====================================================
          HEADER
          Hide on Admin + Seller
      ===================================================== */}

      {!isDashboardRoute && <Header />}

      {/* =====================================================
          MAIN ROUTING
      ===================================================== */}

      <main
        className={`flex-1 ${isDashboardRoute ? "w-full" : "min-h-[80vh]"}`}
      >
        <Routes>
          {/* =================================================
              PUBLIC
          ================================================= */}

          <Route path="/" element={<Home />} />

          <Route path="/products" element={<Products />} />

          <Route path="/products/:id" element={<ProductDetails />} />

          <Route path="/cart" element={<Cart />} />

          {/* =================================================
              AUTH
          ================================================= */}

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/password/forgot" element={<ForgotPassword />} />

          <Route path="/password/reset/:token" element={<ResetPassword />} />

          {/* =================================================
              USER PROTECTED
          ================================================= */}

          <Route
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} user={user} />
            }
          >
            <Route path="/account" element={<Profile />} />

            <Route path="/shipping" element={<Shipping />} />

            <Route path="/order/confirm" element={<ConfirmOrder />} />

            <Route path="/process/payment" element={<Payment />} />

            <Route path="/orders" element={<MyOrders />} />

            <Route path="/order/:id" element={<OrderDetails />} />
          </Route>

          {/* =================================================
    DASHBOARD REDIRECT
    /dashboard -> role ke according
================================================= */}

          <Route
            path="/dashboard"
            element={<DashboardRedirect user={user} />}
          />

          {/* =================================================
    SELLER PROTECTED
================================================= */}

          <Route
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                isSeller={true}
                user={user}
              />
            }
          >
            <Route element={<SellerLayout />}>
              {/* Seller Dashboard */}
              <Route path="/seller/dashboard" element={<SellerDashboard />} />

              {/* Seller Products */}
              <Route path="/seller/products" element={<SellerProducts />} />

              {/* Seller Orders */}
              <Route path="/seller/orders" element={<SellerOrders />} />

              {/* Seller Order Details */}
              <Route
                path="/seller/orders/:id"
                element={<SellerOrderDetails />}
              />
            </Route>
          </Route>

          {/* =================================================
    ADMIN PROTECTED
================================================= */}

          <Route
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                isAdmin={true}
                user={user}
              />
            }
          >
            <Route element={<AdminLayout />}>
              {/* Admin Dashboard */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* Admin Products */}
              <Route path="/admin/products" element={<AdminProducts />} />

              {/* Admin Users */}
              <Route path="/admin/users" element={<AdminUsers />} />

              {/* Admin Orders */}
              <Route path="/admin/orders" element={<AdminOrders />} />

              {/* Admin Order Details */}
              <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />

              {/* System Health */}
              <Route path="/admin/system-health" element={<SystemHealth />} />
            </Route>
          </Route>

          {/* =================================================
              404
          ================================================= */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* =====================================================
          FOOTER
          Hide on Admin + Seller
      ===================================================== */}

      {!isDashboardRoute && <Footer />}
    </div>
  );
}

/* =========================================================
   APP
========================================================= */

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
