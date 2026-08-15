import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux Auth State
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const user = useSelector((state) => state.auth?.user);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged Out Successfully");
    navigate("/login");
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
          <Link to="/" className="hover:text-indigo-400 transition">
            Home
          </Link>

          <Link to="/products" className="hover:text-indigo-400 transition">
            Products
          </Link>

          <Link to="/cart" className="hover:text-indigo-400 transition">
            Cart
          </Link>

          {/* Authentication State */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              {/* Profile / Account with Google Avatar */}
              <Link
                to="/account"
                className="flex items-center gap-2 font-medium text-indigo-300 hover:text-indigo-400 transition"
              >
                {user?.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt={user?.name || "User Avatar"}
                    className="w-8 h-8 rounded-full object-cover border border-indigo-500"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
                <span>{user?.name || "Account"}</span>
              </Link>

              {/* Admin Dashboard */}
              {user?.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="bg-purple-600 px-3 py-1.5 rounded-lg text-sm hover:bg-purple-700 transition"
                >
                  Admin
                </Link>
              )}

              {/* Logout Button */}
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
              <Link
                to="/login"
                className="bg-indigo-600 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
              >
                Login
              </Link>

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