import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector(
    (state) => state.auth || {}
  );

  const { cartItems = [] } = useSelector(
    (state) => state.cart || {}
  );

  // ================= LOGOUT =================
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();

      toast.success("Logged Out Successfully");

      // Logout ke baad login page par redirect
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout Error:", error);

      toast.error(error || "Logout failed");
    }
  };

  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide text-indigo-400"
        >
          NexusCart AI
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">

          {/* Home */}
          <Link
            to="/"
            className="hover:text-indigo-400 transition"
          >
            Home
          </Link>

          {/* Products */}
          <Link
            to="/products"
            className="hover:text-indigo-400 transition"
          >
            Products
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative hover:text-indigo-400 transition"
          >
            Cart

            {cartItems.length > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-indigo-600 rounded-full font-bold">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* Authentication */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">

              {/* Account */}
              <Link
                to="/account"
                className="font-medium text-indigo-300 hover:text-indigo-400 transition"
              >
                {user?.name || "Account"}
              </Link>

              {/* Admin */}
              {user?.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="bg-purple-600 px-3 py-1.5 rounded-lg text-sm hover:bg-purple-700 transition"
                >
                  Admin
                </Link>
              )}

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="bg-red-600 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-700 active:scale-95 transition-all duration-150"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">

              {/* Login */}
              <Link
                to="/login"
                className="bg-indigo-600 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
              >
                Login
              </Link>

              {/* Register */}
              <Link
                to="/register"
                className="border border-indigo-500 text-indigo-400 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-indigo-500 hover:text-white transition"
              >
                Register
              </Link>
            </div>
          )}

        </nav>
      </div>
    </header>
  );
};

export default Header;