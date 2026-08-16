import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth || {});

  // CartSlice abhi nahi bana hai
  // CartSlice banne ke baad yahan cartCount connect karenge
  const cartCount = 0;

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchTerm.trim()) {
      navigate(
        `/products?keyword=${encodeURIComponent(
          searchTerm,
        )}&category=${selectedCategory}`,
      );
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());

    setIsProfileOpen(false);

    toast.success("Logged Out Successfully");

    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
      {/* =====================================================
          ANNOUNCEMENT BAR
      ===================================================== */}
      <div className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center text-xs sm:text-sm">
          <p className="flex items-center gap-2">
            <span className="text-indigo-400">✦</span>

            <span>
              Smart Shopping powered by{" "}
              <span className="font-semibold text-indigo-400">
                InfinityCart AI
              </span>
            </span>

            <span className="hidden sm:inline text-slate-500">•</span>

            <span className="hidden sm:inline text-slate-300">
              Free shipping on orders over ₹499
            </span>
          </p>
        </div>
      </div>

      {/* =====================================================
          MAIN HEADER
      ===================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[76px] flex items-center justify-between gap-5">
          {/* =================================================
              MOBILE MENU
          ================================================= */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

          {/* =================================================
              LOGO
          ================================================= */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            {/* Shopping Basket Logo */}
            <div className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center shadow-sm">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
              >
                {/* Basket Handle */}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 9V7a6 6 0 0 1 12 0v2"
                />

                {/* Basket */}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 9h16l-1.2 9.2a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8L4 9Z"
                />

                {/* Basket Lines */}
                <path strokeLinecap="round" d="M8 13v3" />
                <path strokeLinecap="round" d="M12 13v3" />
                <path strokeLinecap="round" d="M16 13v3" />
              </svg>
            </div>

            {/* Brand */}
            <div className="leading-none">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                Infinity
                <span className="text-indigo-600">Cart</span>
              </h1>

              <p className="text-[9px] sm:text-[10px] font-semibold tracking-[0.22em] uppercase text-slate-400 mt-1">
                AI Commerce
              </p>
            </div>
          </Link>

          {/* =================================================
              SEARCH
          ================================================= */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl"
          >
            <div className="w-full flex items-center border border-slate-200 rounded-xl bg-slate-50 focus-within:bg-white focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50 transition">
              {/* Category */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-transparent pl-4 pr-8 py-3 text-sm font-medium text-slate-600 outline-none cursor-pointer"
                >
                  <option value="All">All Categories</option>

                  <option value="Electronics">Electronics</option>

                  <option value="Fashion">Fashion</option>

                  <option value="Home">Home & Living</option>

                  <option value="Books">Books</option>
                </select>

                <svg
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              <div className="h-7 w-px bg-slate-200" />

              {/* Search Input */}
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="flex-1 min-w-0 bg-transparent px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none"
              />

              {/* Search Button */}
              <button
                type="submit"
                className="mr-1.5 w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition shadow-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeWidth="2"
                    strokeLinecap="round"
                    d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* =================================================
              RIGHT ACTIONS
          ================================================= */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Wishlist */}
            <button
              type="button"
              className="hidden sm:flex w-10 h-10 rounded-xl items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition"
              title="Wishlist"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                />
              </svg>
            </button>

            {/* =================================================
                CART
            ================================================= */}
            <Link
              to="/cart"
              className="relative w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition"
              title="Shopping Cart"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M3 3h2l2.4 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 7H6"
                />

                <circle cx="10" cy="20" r="1.2" strokeWidth="1.8" />

                <circle cx="18" cy="20" r="1.2" strokeWidth="1.8" />
              </svg>

              {/* Cart Count */}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* =================================================
                AUTHENTICATED USER
            ================================================= */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-slate-100 transition"
                >
                  {/* Avatar */}
                  {user?.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt={user?.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-indigo-100"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}

                  {/* Name */}
                  <span className="hidden lg:block text-sm font-semibold text-slate-700">
                    {user?.name?.split(" ")[0] || "Account"}
                  </span>

                  <svg
                    className="hidden lg:block w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m6 9 6 6 6-6"
                    />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-14 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                    {/* User Info */}
                    <div className="px-4 py-4 bg-slate-50 border-b border-slate-200">
                      <p className="font-bold text-slate-900">{user?.name}</p>

                      <p className="text-xs text-slate-500 truncate mt-1">
                        {user?.email}
                      </p>
                    </div>

                    <div className="p-2">
                      <Link
                        to="/account"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        My Profile
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        My Orders
                      </Link>

                      {user?.role === "admin" && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-purple-600 hover:bg-purple-50"
                        >
                          Admin Dashboard
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 mt-1"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* =================================================
                  GUEST USER
              ================================================= */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="hidden sm:block px-3 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm hover:shadow-md transition"
                >
                  <span className="hidden sm:inline">Create Account</span>

                  <span className="sm:hidden">Sign In</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* =====================================================
            DESKTOP NAVIGATION
        ===================================================== */}
        <nav className="hidden lg:flex items-center justify-between border-t border-slate-100 h-12">
          <div className="flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-indigo-600 transition">
              Home
            </Link>

            <Link to="/products" className="hover:text-indigo-600 transition">
              Shop
            </Link>

            <Link
              to="/products?category=Electronics"
              className="hover:text-indigo-600 transition"
            >
              Electronics
            </Link>

            <Link
              to="/products?category=Fashion"
              className="hover:text-indigo-600 transition"
            >
              Fashion
            </Link>

            <Link
              to="/products?category=Home"
              className="hover:text-indigo-600 transition"
            >
              Home & Living
            </Link>

            <Link
              to="/products?featured=true"
              className="flex items-center gap-1.5 text-indigo-600 font-semibold"
            >
              <span>✦</span>
              Trending Deals
            </Link>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            AI Recommendations Active
          </div>
        </nav>
      </div>

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white shadow-lg">
          <div className="p-4 space-y-4">
            {/* Mobile Search */}
            <form
              onSubmit={handleSearch}
              className="flex border border-slate-200 rounded-xl overflow-hidden"
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-3 text-sm outline-none"
              />

              <button type="submit" className="px-4 bg-indigo-600 text-white">
                Search
              </button>
            </form>

            {/* Mobile Links */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg bg-slate-50 text-sm font-medium text-slate-700"
              >
                Home
              </Link>

              <Link
                to="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg bg-slate-50 text-sm font-medium text-slate-700"
              >
                Shop
              </Link>

              <Link
                to="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg bg-slate-50 text-sm font-medium text-slate-700"
              >
                Cart
              </Link>

              <Link
                to="/products?featured=true"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg bg-indigo-50 text-sm font-semibold text-indigo-600"
              >
                Trending
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
