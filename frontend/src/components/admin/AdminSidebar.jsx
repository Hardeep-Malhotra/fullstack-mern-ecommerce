import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  UserCheck,
  ChevronRight,
  Store,
  Activity,
  ShieldCheck,
} from "lucide-react";

const AdminSidebar = () => {
  const navItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/admin/products",
      label: "Products",
      icon: Package,
    },
    {
      path: "/admin/orders",
      label: "Orders",
      icon: ShoppingCart,
    },
    {
      path: "/admin/users",
      label: "Users",
      icon: Users,
    },
    {
      path: "/admin/seller-approval",
      label: "Seller Approval",
      icon: UserCheck,
    },
    {
      path: "/admin/system-health",
      label: "System Health",
      icon: Activity,
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col shrink-0 sticky top-0 h-screen">
      {/* =====================================================
          BRAND
      ===================================================== */}

      <div className="px-5 pt-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-2 pb-6 border-b border-slate-100"
        >
          {/* Logo */}

          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-200">
              <ShieldCheck size={23} strokeWidth={2.3} />
            </div>

            {/* Online dot */}

            <span className="absolute -right-0.5 -bottom-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Shopzy
            </h2>

            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] text-slate-400">Admin Panel</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <div className="flex-1 px-4 py-7 overflow-y-auto">
        <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
          Management
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
                  className={({ isActive }) => `
                    group relative flex items-center gap-3
                    px-3.5 py-3 rounded-xl
                    text-sm font-semibold
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200"
                        : "text-slate-500 hover:text-orange-600 hover:bg-orange-50/60"
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {/* Active indicator */}

                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-white/90"
                        />
                      )}

                      {/* Icon */}

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

                      {/* Arrow */}

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

        {/* =================================================
            STORE CARD
        ================================================= */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-white border border-orange-100"
        >
          <div className="w-9 h-9 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 mb-3">
            <Store size={18} />
          </div>

          <p className="text-xs font-bold text-slate-900">Shopzy Store</p>

          <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
            Manage your store, products, sellers and customer orders.
          </p>
        </motion.div>
      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="px-5 pb-5">
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Shopzy
              </p>

              <p className="text-[10px] text-slate-400 mt-1">Admin v1.0.0</p>
            </div>

            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <ShieldCheck size={15} className="text-orange-500" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
