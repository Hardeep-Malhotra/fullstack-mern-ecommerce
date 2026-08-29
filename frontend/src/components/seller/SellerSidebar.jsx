import { Link, useLocation } from "react-router-dom";
// import { LayoutDashboard, Package, ShoppingCart, Store } from "lucide-react"; // ya koi bhi icon set

const SellerSidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/seller/dashboard", icon: "📊" },
    { name: "My Products", path: "/seller/products", icon: "📦" },
    { name: "My Orders", path: "/seller/orders", icon: "🛒" },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen p-4 flex flex-col border-r border-slate-800">
      {/* Brand Header */}
      <div className="mb-8 px-2 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold">
          S
        </div>
        <div>
          <h2 className="text-lg font-bold text-white leading-none">Shopzy</h2>
          <span className="text-xs text-orange-400 font-medium">Vendor Console</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-orange-500 text-white font-semibold shadow-lg shadow-orange-500/20"
                  : "hover:bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Seller Footer Info */}
      <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800 text-xs text-slate-400">
        <p className="font-semibold text-slate-300">Seller Portal</p>
        <p className="mt-0.5">Manage products & process sales orders.</p>
      </div>
    </aside>
  );
};

export default SellerSidebar;