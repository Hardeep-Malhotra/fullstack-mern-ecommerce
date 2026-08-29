// import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRoute = ({ isAuthenticated, isAdmin = false, user }) => {
//   // 1. Unauthenticated users -> Redirect to Login
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   // 2. Non-admin trying to access Admin routes -> Redirect to Account
//   if (isAdmin && user?.role !== "admin") {
//     return <Navigate to="/account" replace />;
//   }

//   // 3. Authenticated & authorized -> Render child routes
//   return <Outlet />;
// };

// export default ProtectedRoute;

import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({
  isAuthenticated,
  isAdmin = false,
  isSeller = false,
  user,
}) => {
  // 1. Unauthenticated users -> Redirect to Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Non-admin trying to access Admin routes -> Redirect to Account
  if (isAdmin && user?.role !== "admin") {
    return <Navigate to="/account" replace />;
  }

  // 3. Seller Route Access Check
  if (isSeller) {
    // Agar user Admin ya Seller nahi hai -> Redirect to Home/Account
    if (user?.role !== "seller" && user?.role !== "admin") {
      return <Navigate to="/account" replace />;
    }

    // Agar User Seller hai par Admin ne APPROVE nahi kiya -> Restrict access
    if (user?.role === "seller" && !user?.isApproved) {
      return <Navigate to="/account" replace />;
    }
  }

  // 4. Authenticated & Authorized -> Render child routes
  return <Outlet />;
};

export default ProtectedRoute;