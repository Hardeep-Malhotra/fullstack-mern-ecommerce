// import { Link, useLocation } from "react-router-dom";
// // import { LayoutDashboard, Package, ShoppingCart, Store } from "lucide-react"; // ya koi bhi icon set

// const SellerSidebar = () => {
//   const location = useLocation();

//   const navItems = [
//     { name: "Dashboard", path: "/seller/dashboard", icon: "📊" },
//     { name: "My Products", path: "/seller/products", icon: "📦" },
//     { name: "My Orders", path: "/seller/orders", icon: "🛒" },
//   ];

//   return (
//     <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen p-4 flex flex-col border-r border-slate-800">
//       {/* Brand Header */}
//       <div className="mb-8 px-2 flex items-center gap-2">
//         <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold">
//           S
//         </div>
//         <div>
//           <h2 className="text-lg font-bold text-white leading-none">Shopzy</h2>
//           <span className="text-xs text-orange-400 font-medium">Vendor Console</span>
//         </div>
//       </div>

//       {/* Navigation Items */}
//       <nav className="space-y-1 flex-1">
//         {navItems.map((item) => {
//           const isActive = location.pathname === item.path;
//           return (
//             <Link
//               key={item.path}
//               to={item.path}
//               className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
//                 isActive
//                   ? "bg-orange-500 text-white font-semibold shadow-lg shadow-orange-500/20"
//                   : "hover:bg-slate-800 text-slate-400 hover:text-white"
//               }`}
//             >
//               <span>{item.icon}</span>
//               <span>{item.name}</span>
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Seller Footer Info */}
//       <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800 text-xs text-slate-400">
//         <p className="font-semibold text-slate-300">Seller Portal</p>
//         <p className="mt-0.5">Manage products & process sales orders.</p>
//       </div>
//     </aside>
//   );
// };

// export default SellerSidebar;


import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Store,
  ChevronRight,
  ShoppingBag
} from "lucide-react";

const SellerSidebar = () => {
  const navItems = [
    { path: "/seller/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/seller/products", label: "My Products", icon: Package },
    { path: "/seller/orders", label: "My Orders", icon: ShoppingCart },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col shrink-0 sticky top-0 h-screen">
      {/* =====================================
          BRAND HEADER
      ===================================== */}
      <div className="px-5 pt-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-2 pb-6 border-b border-slate-100"
        >
          {/* Logo */}
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-200">
              <Store size={23} strokeWidth={2.3} />
            </div>

            {/* Online Status Dot */}
            <span className="absolute -right-0.5 -bottom-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Shopzy
            </h2>

            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] text-slate-400 font-medium">Vendor Console</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* =====================================
          NAVIGATION
      ===================================== */}
      <div className="flex-1 px-4 py-7 overflow-y-auto">
        <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
          Seller Portal
        </p>

        <nav className="space-y-1.5">
          {navItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `
                    group relative flex items-center gap-3
                    px-3.5 py-3 rounded-xl
                    text-sm font-semibold
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200"
                        : "text-slate-500 hover:text-orange-600 hover:bg-orange-50/60"
                    }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Indicator Bar */}
                      {isActive && (
                        <motion.div
                          layoutId="seller-sidebar-active"
                          className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-white/90"
                        />
                      )}

                      {/* Icon Container */}
                      <div
                        className={`
                          w-9 h-9 rounded-lg
                          flex items-center justify-center
                          transition-all
                          ${
                            isActive
                              ? "bg-white/15"
                              : "bg-orange-50 text-orange-500 group-hover:bg-orange-100"
                          }
                        `}
                      >
                        <Icon size={18} strokeWidth={2} />
                      </div>

                      {/* Label */}
                      <span className="flex-1">{item.label}</span>

                      {/* Chevron Arrow */}
                      <ChevronRight
                        size={15}
                        className={`
                          transition-all duration-200
                          ${
                            isActive
                              ? "opacity-100 translate-x-0"
                              : "opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0"
                          }
                        `}
                      />
                    </>
                  )}
                </NavLink>
              </motion.div>
            );
          })}
        </nav>

        {/* =====================================
            SELLER INFO CARD
        ===================================== */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-white border border-orange-100"
        >
          <div className="w-9 h-9 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 mb-3">
            <ShoppingBag size={18} />
          </div>

          <p className="text-xs font-bold text-slate-900">Seller Dashboard</p>

          <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
            Manage your store inventory, track order updates, and inspect sales growth.
          </p>
        </motion.div>
      </div>

      {/* =====================================
          FOOTER
      ===================================== */}
      <div className="px-5 pb-5">
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Shopzy
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Vendor v1.0.0</p>
            </div>

            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <Store size={15} className="text-orange-500" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SellerSidebar;