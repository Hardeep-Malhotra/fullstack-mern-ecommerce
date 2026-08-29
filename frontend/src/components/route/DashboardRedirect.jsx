import { Navigate } from "react-router-dom";

const DashboardRedirect = ({ user }) => {
  // User available nahi hai
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // ==============================
  // ADMIN
  // ==============================
  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // ==============================
  // SELLER
  // ==============================
  if (user.role === "seller") {
    if (user.isApproved === true) {
      return <Navigate to="/seller/dashboard" replace />;
    }

    // Seller approved nahi hai
    return <Navigate to="/" replace />;
  }

  // ==============================
  // NORMAL USER
  // ==============================
  return <Navigate to="/" replace />;
};

export default DashboardRedirect;