import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});
  const { cartItems = [] } = useSelector((state) => state.cart || {});

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide text-indigo-400">
          WanderStore
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-6">
          <Link to="/products" className="hover:text-indigo-400 transition">
            Products
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="relative hover:text-indigo-400 transition">
            Cart
            {cartItems.length > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-indigo-600 rounded-full font-bold">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* Auth Controls */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to="/account" className="font-medium text-indigo-300">
                {user?.name || "Account"}
              </Link>
              {user?.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="bg-purple-600 px-3 py-1 rounded text-sm hover:bg-purple-700 transition"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-indigo-600 px-4 py-1.5 rounded text-sm font-semibold hover:bg-indigo-700 transition"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;