// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logoutUser } from "../../redux/slices/authSlice";
// import toast from "react-hot-toast";

// const categories = [
//   { name: "Men", desc: "Clothing, Shoes, Watches", icon: "👤" },
//   { name: "Women", desc: "Clothing, Shoes, Accessories", icon: "👗" },
//   { name: "Electronics", desc: "Mobiles, Laptops, Gadgets", icon: "💻" },
//   { name: "Footwear", desc: "Sneakers, Formal, Sports", icon: "👟" },
//   { name: "Accessories", desc: "Bags, Wallets, Belts", icon: "👜" },
//   { name: "Beauty", desc: "Makeup, Skincare, Perfume", icon: "💄" },
// ];

// const navLinks = [
//   { label: "Home", path: "/" },
//   { label: "Shop", path: "/products" },
//   { label: "Deals", path: "/products?featured=true", hot: true },
//   { label: "About", path: "/about" },
//   { label: "Contact", path: "/contact" },
// ];

// const Header = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isCategoryOpen, setIsCategoryOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { isAuthenticated, user } = useSelector((state) => state.auth || {});

//   const cartCount = 2;
//   const wishlistCount = 3;

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (!searchTerm.trim()) return;
//     navigate(`/products?keyword=${encodeURIComponent(searchTerm.trim())}`);
//   };

//   const handleLogout = () => {
//     dispatch(logoutUser());
//     setIsProfileOpen(false);
//     toast.success("Logged Out Successfully");
//     navigate("/login");
//   };

//   return (
//     <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="h-[78px] flex items-center justify-between gap-4">

//           {/* ============= LEFT GROUP ============= */}
//           <div className="flex items-center gap-3 min-w-0">
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="lg:hidden w-9 h-9 flex items-center justify-center text-slate-700 shrink-0"
//             >
//               ☰
//             </button>

//             <Link to="/" className="flex items-center gap-2 shrink-0">
//               <span className="text-2xl">🛍️</span>
//               <h1 className="text-xl font-extrabold text-slate-900">
//                 Shopzy<span className="text-orange-500">.</span>
//               </h1>
//             </Link>

//             <div className="relative hidden lg:block shrink-0">
//               <button
//                 onClick={() => setIsCategoryOpen(!isCategoryOpen)}
//                 className="h-11 px-4 flex items-center gap-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-orange-300"
//               >
//                 <span>▤</span> Categories
//                 <span className={`transition ${isCategoryOpen ? "rotate-180" : ""}`}>▾</span>
//               </button>

//               {isCategoryOpen && (
//                 <div className="absolute left-0 top-14 w-[560px] bg-white border border-slate-200 rounded-xl shadow-xl p-4 grid grid-cols-4 gap-3">
//                   {categories.map((c) => (
//                     <Link
//                       key={c.name}
//                       to={`/products?category=${c.name}`}
//                       onClick={() => setIsCategoryOpen(false)}
//                       className="flex flex-col items-center text-center gap-1 p-2 rounded-lg hover:bg-orange-50"
//                     >
//                       <span className="text-xl">{c.icon}</span>
//                       <p className="text-sm font-semibold text-slate-800">{c.name}</p>
//                       <p className="text-[10px] text-slate-400">{c.desc}</p>
//                     </Link>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <form onSubmit={handleSearch} className="hidden md:block w-[320px] shrink-0">
//               <div className="w-full h-11 flex items-center border border-slate-200 rounded-lg focus-within:border-orange-400">
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Search for products..."
//                   className="flex-1 min-w-0 px-4 text-sm outline-none"
//                 />
//                 <button type="submit" className="w-11 h-10 flex items-center justify-center text-slate-500 hover:text-orange-500">
//                   🔍
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* ============= CENTER NAV ============= */}
//           <nav className="hidden xl:flex items-center gap-7 shrink-0">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.label}
//                 to={link.path}
//                 className="text-sm font-medium text-slate-700 hover:text-orange-500 flex items-center gap-1.5 whitespace-nowrap"
//               >
//                 {link.label}
//                 {link.hot && (
//                   <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500 text-white font-bold">HOT</span>
//                 )}
//               </Link>
//             ))}
//           </nav>

//           {/* ============= RIGHT GROUP ============= */}
//           <div className="flex items-center gap-2 sm:gap-3 shrink-0">
//             <Link to="/wishlist" className="relative w-10 h-10 flex items-center justify-center text-slate-700 hover:text-orange-500">
//               ♡
//               {wishlistCount > 0 && (
//                 <span className="absolute top-0 right-0 min-w-[17px] h-[17px] rounded-full bg-orange-500 text-white text-[9px] font-bold flex items-center justify-center">
//                   {wishlistCount}
//                 </span>
//               )}
//             </Link>

//             <Link to="/cart" className="relative w-10 h-10 flex items-center justify-center text-slate-700 hover:text-orange-500">
//               🛒
//               {cartCount > 0 && (
//                 <span className="absolute top-0 right-0 min-w-[17px] h-[17px] rounded-full bg-orange-500 text-white text-[9px] font-bold flex items-center justify-center">
//                   {cartCount}
//                 </span>
//               )}
//             </Link>

//             {isAuthenticated ? (
//               <div className="relative">
//                 <button
//                   onClick={() => setIsProfileOpen(!isProfileOpen)}
//                   className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-orange-50"
//                 >
//                   <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
//                     {user?.name?.charAt(0).toUpperCase() || "U"}
//                   </div>
//                   <span className="hidden lg:block text-sm font-semibold text-slate-700 whitespace-nowrap">
//                     {user?.name?.split(" ")[0] || "Account"}
//                   </span>
//                 </button>

//                 {isProfileOpen && (
//                   <div className="absolute right-0 top-12 w-56 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
//                     <div className="px-4 py-3 bg-orange-50 border-b border-orange-100">
//                       <p className="font-bold text-slate-900 text-sm">{user?.name}</p>
//                       <p className="text-xs text-slate-500 truncate">{user?.email}</p>
//                     </div>
//                     <div className="p-2">
//                       <Link to="/account" onClick={() => setIsProfileOpen(false)} className="block px-3 py-2 rounded-lg text-sm hover:bg-orange-50">
//                         My Profile
//                       </Link>
//                       <Link to="/orders" onClick={() => setIsProfileOpen(false)} className="block px-3 py-2 rounded-lg text-sm hover:bg-orange-50">
//                         My Orders
//                       </Link>
//                       {user?.role === "admin" && (
//                         <Link to="/admin/dashboard" onClick={() => setIsProfileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-semibold text-orange-500 hover:bg-orange-50">
//                           Admin Dashboard
//                         </Link>
//                       )}
//                       <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50">
//                         Logout
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <Link
//                 to="/login"
//                 className="px-3 sm:px-4 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-semibold whitespace-nowrap"
//               >
//                 Login / Sign Up
//               </Link>
//             )}
//           </div>
//         </div>

//         {/* ============= MOBILE SEARCH ============= */}
//         <div className="md:hidden pb-3">
//           <form onSubmit={handleSearch}>
//             <div className="h-11 flex items-center border border-slate-200 rounded-lg">
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search for products..."
//                 className="flex-1 px-4 text-sm outline-none"
//               />
//               <button type="submit" className="w-11 h-10 bg-orange-500 text-white rounded-r-lg">🔍</button>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* ============= MOBILE MENU ============= */}
//       {isMobileMenuOpen && (
//         <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-1">
//           {navLinks.map((link) => (
//             <Link
//               key={link.label}
//               to={link.path}
//               onClick={() => setIsMobileMenuOpen(false)}
//               className="block px-4 py-3 rounded-lg hover:bg-orange-50"
//             >
//               {link.label} {link.hot && "🔥"}
//             </Link>
//           ))}
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

// ==========================================
// CATEGORIES
// ==========================================
const categories = [
  {
    name: "Electronics",
    desc: "Mobiles, Laptops, Gadgets",
    icon: "💻",
  },
  {
    name: "Fashion",
    desc: "Clothing & Apparel",
    icon: "👕",
  },
  {
    name: "Footwear",
    desc: "Sneakers, Sports, Casual",
    icon: "👟",
  },
  {
    name: "Accessories",
    desc: "Watches, Bags, Wallets",
    icon: "👜",
  },
  {
    name: "Beauty",
    desc: "Makeup, Skincare, Perfume",
    icon: "💄",
  },
  {
    name: "Gaming",
    desc: "Gaming Gear & Accessories",
    icon: "🎮",
  },
  {
    name: "Home",
    desc: "Home & Living Products",
    icon: "🏠",
  },
];

// ==========================================
// NAVIGATION LINKS
// ==========================================
const navLinks = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Shop",
    path: "/products",
  },
  {
    label: "Deals",
    path: "/products?sort=-price",
    hot: true,
  },
  {
    label: "About",
    path: "/about",
  },
  {
    label: "Contact",
    path: "/contact",
  },
];

// ==========================================
// HEADER
// ==========================================
const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ==========================================
  // AUTH STATE
  // ==========================================
  const { isAuthenticated, user } = useSelector(
    (state) => state.auth || {},
  );

  // ==========================================
  // CART / WISHLIST
  // ==========================================
  // Abhi static rakha hai.
  // Redux cart/wishlist banne ke baad yahan selector laga denge.
  const cartCount = 0;
  const wishlistCount = 0;

  // ==========================================
  // SEARCH
  // ==========================================
  const handleSearch = (e) => {
    e.preventDefault();

    const keyword = searchTerm.trim();

    if (!keyword && !selectedCategory) {
      navigate("/products");
      return;
    }

    const params = new URLSearchParams();

    if (keyword) {
      params.append("keyword", keyword);
    }

    if (selectedCategory) {
      params.append("category", selectedCategory);
    }

    navigate(`/products?${params.toString()}`);

    // Mobile menu close
    setIsMobileMenuOpen(false);
  };

  // ==========================================
  // CATEGORY SELECT
  // ==========================================
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsCategoryOpen(false);

    navigate(
      `/products?category=${encodeURIComponent(category)}`,
    );
  };

  // ==========================================
  // LOGOUT
  // ==========================================
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();

      setIsProfileOpen(false);

      toast.success("Logged Out Successfully");

      navigate("/login");
    } catch (error) {
      toast.error(error || "Logout failed");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================================================= */}
        {/* MAIN HEADER */}
        {/* ================================================= */}
        <div className="h-[78px] flex items-center justify-between gap-4">

          {/* ================================================= */}
          {/* LEFT GROUP */}
          {/* ================================================= */}
          <div className="flex items-center gap-3 min-w-0">

            {/* Mobile Menu */}
            <button
              onClick={() =>
                setIsMobileMenuOpen(!isMobileMenuOpen)
              }
              className="lg:hidden w-9 h-9 flex items-center justify-center text-slate-700 hover:text-orange-500 text-xl shrink-0"
              aria-label="Open menu"
            >
              ☰
            </button>

            {/* ================================================= */}
            {/* LOGO */}
            {/* ================================================= */}
            <Link
              to="/"
              className="flex items-center gap-2 shrink-0"
            >
              <span className="text-2xl">🛍️</span>

              <h1 className="text-xl font-extrabold text-slate-900">
                Shopzy
                <span className="text-orange-500">.</span>
              </h1>
            </Link>

            {/* ================================================= */}
            {/* CATEGORY DROPDOWN */}
            {/* ================================================= */}
            <div className="relative hidden lg:block shrink-0">

              <button
                type="button"
                onClick={() =>
                  setIsCategoryOpen(!isCategoryOpen)
                }
                className="h-11 px-4 flex items-center gap-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-orange-300 hover:text-orange-500 transition"
              >
                <span>▤</span>

                <span>Categories</span>

                <span
                  className={`transition-transform ${
                    isCategoryOpen ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>
              </button>

              {/* CATEGORY MENU */}
              {isCategoryOpen && (
                <div className="absolute left-0 top-14 w-[560px] bg-white border border-slate-200 rounded-xl shadow-xl p-4 grid grid-cols-4 gap-3">

                  {categories.map((category) => (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() =>
                        handleCategorySelect(category.name)
                      }
                      className="flex flex-col items-center text-center gap-1 p-3 rounded-lg hover:bg-orange-50 transition"
                    >
                      <span className="text-2xl">
                        {category.icon}
                      </span>

                      <p className="text-sm font-semibold text-slate-800">
                        {category.name}
                      </p>

                      <p className="text-[10px] text-slate-400">
                        {category.desc}
                      </p>
                    </button>
                  ))}

                </div>
              )}
            </div>

            {/* ================================================= */}
            {/* DESKTOP SEARCH */}
            {/* ================================================= */}
            <form
              onSubmit={handleSearch}
              className="hidden md:block w-[300px] lg:w-[320px] shrink-0"
            >
              <div className="w-full h-11 flex items-center border border-slate-200 rounded-lg overflow-hidden focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition">

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  placeholder="Search for products..."
                  className="flex-1 min-w-0 px-4 text-sm text-slate-700 outline-none"
                />

                <button
                  type="submit"
                  className="w-11 h-10 flex items-center justify-center text-slate-500 hover:text-orange-500 transition"
                  aria-label="Search"
                >
                  🔍
                </button>

              </div>
            </form>
          </div>

          {/* ================================================= */}
          {/* CENTER NAV */}
          {/* ================================================= */}
          <nav className="hidden xl:flex items-center gap-7 shrink-0">

            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-sm font-medium text-slate-700 hover:text-orange-500 flex items-center gap-1.5 whitespace-nowrap transition"
              >
                {link.label}

                {link.hot && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500 text-white font-bold">
                    HOT
                  </span>
                )}
              </Link>
            ))}

          </nav>

          {/* ================================================= */}
          {/* RIGHT GROUP */}
          {/* ================================================= */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative w-10 h-10 flex items-center justify-center text-xl text-slate-700 hover:text-orange-500 transition"
              aria-label="Wishlist"
            >
              ♡

              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 min-w-[17px] h-[17px] rounded-full bg-orange-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative w-10 h-10 flex items-center justify-center text-lg text-slate-700 hover:text-orange-500 transition"
              aria-label="Cart"
            >
              🛒

              {cartCount > 0 && (
                <span className="absolute top-0 right-0 min-w-[17px] h-[17px] rounded-full bg-orange-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* ================================================= */}
            {/* AUTHENTICATED USER */}
            {/* ================================================= */}
            {isAuthenticated ? (
              <div className="relative">

                <button
                  type="button"
                  onClick={() =>
                    setIsProfileOpen(!isProfileOpen)
                  }
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-orange-50 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {user?.name
                      ?.charAt(0)
                      .toUpperCase() || "U"}
                  </div>

                  <span className="hidden lg:block text-sm font-semibold text-slate-700 whitespace-nowrap">
                    {user?.name?.split(" ")[0] ||
                      "Account"}
                  </span>

                  <span className="hidden lg:block text-xs text-slate-400">
                    ▾
                  </span>
                </button>

                {/* PROFILE DROPDOWN */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-12 w-56 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">

                    {/* USER INFO */}
                    <div className="px-4 py-3 bg-orange-50 border-b border-orange-100">
                      <p className="font-bold text-slate-900 text-sm">
                        {user?.name}
                      </p>

                      <p className="text-xs text-slate-500 truncate">
                        {user?.email}
                      </p>
                    </div>

                    <div className="p-2">

                      <Link
                        to="/account"
                        onClick={() =>
                          setIsProfileOpen(false)
                        }
                        className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-orange-50 transition"
                      >
                        My Profile
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() =>
                          setIsProfileOpen(false)
                        }
                        className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-orange-50 transition"
                      >
                        My Orders
                      </Link>

                      {/* ADMIN */}
                      {user?.role === "admin" && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() =>
                            setIsProfileOpen(false)
                          }
                          className="block px-3 py-2 rounded-lg text-sm font-semibold text-orange-500 hover:bg-orange-50 transition"
                        >
                          Admin Dashboard
                        </Link>
                      )}

                      {/* LOGOUT */}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        Logout
                      </button>

                    </div>
                  </div>
                )}

              </div>
            ) : (

              /* LOGIN BUTTON */
              <Link
                to="/login"
                className="px-3 sm:px-4 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-semibold whitespace-nowrap transition"
              >
                Login / Sign Up
              </Link>

            )}

          </div>
        </div>

        {/* ================================================= */}
        {/* MOBILE SEARCH */}
        {/* ================================================= */}
        <div className="md:hidden pb-3">

          <form onSubmit={handleSearch}>

            <div className="h-11 flex items-center border border-slate-200 rounded-lg overflow-hidden focus-within:border-orange-400">

              <input
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                placeholder="Search for products..."
                className="flex-1 px-4 text-sm outline-none"
              />

              <button
                type="submit"
                className="w-11 h-10 bg-orange-500 text-white hover:bg-orange-600 transition"
              >
                🔍
              </button>

            </div>

          </form>
        </div>

      </div>

      {/* ================================================= */}
      {/* MOBILE MENU */}
      {/* ================================================= */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-1">

          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={() =>
                setIsMobileMenuOpen(false)
              }
              className="block px-4 py-3 rounded-lg text-slate-700 hover:bg-orange-50 hover:text-orange-500 transition"
            >
              {link.label}

              {link.hot && (
                <span className="ml-2 text-xs">
                  🔥
                </span>
              )}
            </Link>
          ))}

          {/* MOBILE CATEGORIES */}
          <div className="pt-3 border-t border-slate-100 mt-2">

            <p className="px-4 py-2 text-xs font-bold uppercase text-slate-400">
              Categories
            </p>

            <div className="grid grid-cols-2 gap-2">

              {categories.map((category) => (
                <button
                  key={category.name}
                  type="button"
                  onClick={() =>
                    handleCategorySelect(category.name)
                  }
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-500 transition"
                >
                  <span>
                    {category.icon}
                  </span>

                  {category.name}
                </button>
              ))}

            </div>
          </div>

        </div>
      )}
    </header>
  );
};

export default Header;