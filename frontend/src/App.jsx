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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            <Route path="/admin/products" element={<AdminProducts />} />

            <Route path="/admin/users" element={<AdminUsers />} />

            <Route path="/admin/orders" element={<AdminOrders />} />
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