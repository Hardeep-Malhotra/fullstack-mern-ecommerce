import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

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
  // Redux se authentication state
  const { isAuthenticated = false, user = null } = useSelector(
    (state) => state.auth || {}
  );

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

          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/cart" element={<Cart />} />


          {/* ================= AUTH ROUTES ================= */}

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route
            path="/password/forgot"
            element={<ForgotPassword />}
          />

          <Route
            path="/password/reset/:token"
            element={<ResetPassword />}
          />


          {/* ================= PROTECTED USER ROUTES ================= */}

          <Route
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
              />
            }
          >
            <Route path="/account" element={<Profile />} />

            <Route path="/shipping" element={<Shipping />} />

            <Route
              path="/order/confirm"
              element={<ConfirmOrder />}
            />

            <Route
              path="/process/payment"
              element={<Payment />}
            />

            <Route path="/orders" element={<MyOrders />} />

            <Route
              path="/order/:id"
              element={<OrderDetails />}
            />
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
            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/products"
              element={<AdminProducts />}
            />

            <Route
              path="/admin/users"
              element={<AdminUsers />}
            />

            <Route
              path="/admin/orders"
              element={<AdminOrders />}
            />
          </Route>


          {/* ================= 404 ROUTE ================= */}

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>
      </main>

      {/* Common Footer */}
      <Footer />
    </Router>
  );
}

export default App;