import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, isAdmin = false, user }) => {
  // 1. Unauthenticated users -> Redirect to Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Non-admin trying to access Admin routes -> Redirect to Account
  if (isAdmin && user?.role !== "admin") {
    return <Navigate to="/account" replace />;
  }

  // 3. Authenticated & authorized -> Render child routes
  return <Outlet />;
};

export default ProtectedRoute;