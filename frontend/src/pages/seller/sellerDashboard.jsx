import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  IndianRupee,
  ShoppingBag,
  Package,
  RefreshCw,
  ArrowUpRight,
  Eye,
  Calendar,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Boxes,
  Store,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import API from "../../api/axios";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";

// =====================================================
// HELPERS
// =====================================================

const formatNumber = (value) => Number(value || 0).toLocaleString("en-IN");

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (date) => {
  if (!date) return "--";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

const EMPTY_STATS = {
  totalRevenue: 0,
  totalOrders: 0,
  totalProducts: 0,
  totalSoldItems: 0,
  averageOrderValue: 0,
  totalInventoryUnits: 0,
  outOfStockProducts: 0,
  monthlyAnalytics: [],
  categoryBreakdown: [],
  orderStatus: { processing: 0, shipped: 0, delivered: 0, cancelled: 0 },
  recentOrders: [],
  lowStockProducts: [],
  products: [],
};

const normalizeStats = (data = {}) => ({
  totalRevenue: Number(data.totalRevenue || 0),
  totalOrders: Number(data.totalOrders || 0),
  totalProducts: Number(data.totalProducts || 0),
  totalSoldItems: Number(data.totalSoldItems || 0),
  averageOrderValue: Number(data.averageOrderValue || 0),
  totalInventoryUnits: Number(data.totalInventoryUnits || 0),
  outOfStockProducts: Number(data.outOfStockProducts || 0),
  monthlyAnalytics: Array.isArray(data.monthlyAnalytics)
    ? data.monthlyAnalytics
    : [],
  categoryBreakdown: Array.isArray(data.categoryBreakdown)
    ? data.categoryBreakdown
    : [],
  orderStatus: {
    processing: Number(data.orderStatus?.processing || 0),
    shipped: Number(data.orderStatus?.shipped || 0),
    delivered: Number(data.orderStatus?.delivered || 0),
    cancelled: Number(data.orderStatus?.cancelled || 0),
  },
  recentOrders: Array.isArray(data.recentOrders) ? data.recentOrders : [],
  lowStockProducts: Array.isArray(data.lowStockProducts)
    ? data.lowStockProducts
    : [],
  products: Array.isArray(data.products) ? data.products : [],
});

// =====================================================
// SELLER DASHBOARD
// =====================================================

const SellerDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ===================================================
  // FETCH — reusable version, used ONLY by the refresh
  // button's onClick, never called directly from an effect.
  // ===================================================

  const fetchSellerDashboard = async () => {
    try {
      setRefreshing(true);

      const response = await API.get("/seller/stats");

      if (response.data?.success) {
        setStats(normalizeStats(response.data?.stats));
      }

      toast.success("Dashboard refreshed");
    } catch (error) {
      console.error("SELLER DASHBOARD ERROR:", error);
      toast.error(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  // ===================================================
  // INITIAL LOAD — kept inline inside the effect (React's
  // recommended data-fetching pattern) rather than calling
  // the reusable function above directly. An effect that calls
  // an externally defined function which sets state gets
  // flagged by the set-state-in-effect lint rule even when the
  // update happens after an `await`; defining the async logic
  // inline, with its own `ignore` guard, avoids that and also
  // protects against a stale response overwriting a newer one.
  // ===================================================

  useEffect(() => {
    let ignore = false;

    const loadDashboard = async () => {
      try {
        const response = await API.get("/seller/stats");

        if (ignore) return;

        if (response.data?.success) {
          setStats(normalizeStats(response.data?.stats));
        }
      } catch (error) {
        if (!ignore) {
          console.error("SELLER DASHBOARD ERROR:", error);
          toast.error(
            error.response?.data?.message || "Failed to load dashboard",
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, []);

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-sm font-semibold text-slate-500">
          Loading Seller Dashboard...
        </p>
      </div>
    );
  }

  // ===================================================
  // ORDER STATUS
  // ===================================================

  const orderStatusData = [
    {
      name: "Processing",
      value: stats.orderStatus.processing,
      icon: Clock,
      color: "#F59E0B",
    },
    {
      name: "Shipped",
      value: stats.orderStatus.shipped,
      icon: Truck,
      color: "#3B82F6",
    },
    {
      name: "Delivered",
      value: stats.orderStatus.delivered,
      icon: CheckCircle2,
      color: "#F97316",
    },
    {
      name: "Cancelled",
      value: stats.orderStatus.cancelled,
      icon: XCircle,
      color: "#EF4444",
    },
  ];

  const totalOrdersCount = stats.totalOrders || 0;

  const getPercentage = (value) => {
    if (!totalOrdersCount) return 0;
    return Math.round((value / totalOrdersCount) * 100);
  };

  // ===================================================
  // STATS CARDS
  // ===================================================

  const statCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      description: "Total earnings",
      icon: IndianRupee,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Total Orders",
      value: formatNumber(stats.totalOrders),
      description: "Store transactions",
      icon: ShoppingBag,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Total Products",
      value: formatNumber(stats.totalProducts),
      description: "Products in catalog",
      icon: Package,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Units Sold",
      value: formatNumber(stats.totalSoldItems),
      description: "Items sold",
      icon: Boxes,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
  ];

  const recentOrders = stats.recentOrders || [];
  const lowStockProducts = stats.lowStockProducts || [];
  const products = stats.products || [];

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-200">
                <Store size={23} />
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Seller Dashboard
              </h1>
            </div>

            <p className="text-sm text-slate-500 mt-1 ml-[3.25rem]">
              Your store performance and sales overview
            </p>
          </div>

          <button
            onClick={fetchSellerDashboard}
            disabled={refreshing}
            className="
              inline-flex items-center justify-center
              gap-2 px-4 py-2 rounded-xl
              border border-slate-200
              bg-white
              hover:bg-orange-50
              hover:border-orange-300
              text-sm font-semibold
              text-slate-700
              hover:text-orange-600
              shadow-sm
              transition-all
              disabled:opacity-50
            "
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin text-orange-500" : ""}
            />
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>

        {/* ================================================= */}
        {/* KPI CARDS */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -3 }}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-orange-200 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {card.title}
                  </span>
                  <div
                    className={`p-2 rounded-lg ${card.iconBg} ${card.iconColor}`}
                  >
                    <Icon size={17} />
                  </div>
                </div>

                <div className="mt-3">
                  <h3 className="text-2xl font-extrabold text-slate-900">
                    {card.value}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ================================================= */}
        {/* REVENUE + ORDER STATUS */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Revenue Overview
                </h2>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Monthly seller revenue
                </p>
              </div>
              <div className="px-2 py-1 rounded-md bg-orange-50 text-orange-600 text-[9px] font-bold">
                LIVE
              </div>
            </div>

            <div className="h-[260px] p-4">
              {stats.monthlyAnalytics.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No revenue data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.monthlyAnalytics}>
                    <defs>
                      <linearGradient
                        id="sellerRevenueGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#f97316"
                          stopOpacity={0.28}
                        />
                        <stop
                          offset="95%"
                          stopColor="#f97316"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

                    <XAxis
                      dataKey="month"
                      stroke="#94a3b8"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />

                    <YAxis
                      stroke="#94a3b8"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) =>
                        `₹${Number(value).toLocaleString("en-IN")}`
                      }
                    />

                    <Tooltip
                      formatter={(value) => [formatCurrency(value), "Revenue"]}
                      contentStyle={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        fontSize: "11px",
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#f97316"
                      strokeWidth={2}
                      fill="url(#sellerRevenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Order Status</h2>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Current order distribution
              </p>
            </div>

            <div className="p-5">
              <div className="h-[145px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={43}
                      outerRadius={62}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {orderStatusData.map((item) => (
                        <Cell key={item.name} fill={item.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3">
                {orderStatusData.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.name}
                      className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/60 px-2.5 py-2"
                    >
                      <div className="flex items-center gap-1.5">
                        <Icon size={11} style={{ color: item.color }} />
                        <span className="text-[9px] font-semibold text-slate-600">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-800">
                        {item.value} ({getPercentage(item.value)}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* RECENT ORDERS + LOW STOCK */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Recent Orders
                </h2>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Latest transactions from your store
                </p>
              </div>

              {recentOrders.length > 0 && (
                <button
                  onClick={() => navigate("/seller/orders")}
                  className="flex items-center gap-1 text-[10px] font-bold text-orange-600 hover:text-orange-700"
                >
                  View All
                  <ArrowUpRight size={13} />
                </button>
              )}
            </div>

            {recentOrders.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                  <ShoppingBag size={20} className="text-slate-400" />
                </div>
                <p className="text-xs font-semibold text-slate-700 mt-3">
                  No recent orders
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  New orders will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60 text-[9px] uppercase tracking-wider text-slate-400">
                      <th className="px-4 py-3">Order</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {recentOrders.map((order) => {
                      const status = order?.orderStatus || "Processing";

                      const badgeColors = {
                        Processing:
                          "bg-amber-50 text-amber-700 border-amber-200",
                        Shipped: "bg-blue-50 text-blue-700 border-blue-200",
                        Delivered:
                          "bg-orange-50 text-orange-700 border-orange-200",
                        Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
                      };

                      const customerName = order?.user?.name || "Guest User";

                      return (
                        <tr
                          key={order?._id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <span className="font-mono text-[10px] font-bold text-slate-700">
                              #{order?._id?.slice(-6) || "------"}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-[9px] font-bold text-white">
                                {customerName.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-[10px] font-semibold text-slate-800">
                                {customerName}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 text-[10px] text-slate-500">
                              <Calendar size={11} />
                              {formatDate(order?.createdAt)}
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex px-2 py-1 rounded-full text-[9px] font-bold border ${
                                badgeColors[status] || badgeColors.Processing
                              }`}
                            >
                              {status}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <span className="text-[10px] font-bold text-slate-900">
                              {formatCurrency(order?.sellerTotal)}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() =>
                                navigate(`/seller/orders/${order?._id}`)
                              }
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-orange-50 border border-orange-200 hover:bg-orange-500 hover:text-white text-[9px] font-bold text-orange-600 transition-all"
                            >
                              <Eye size={11} />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* LOW STOCK */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900">
                    Low Stock
                  </h2>
                  <span className="w-5 h-5 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-[9px] font-bold">
                    {lowStockProducts.length}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Products that need attention
                </p>
              </div>
              <AlertTriangle size={16} className="text-orange-500" />
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="py-14 text-center">
                <Package size={25} className="mx-auto text-slate-300" />
                <p className="text-xs font-semibold text-slate-600 mt-2">
                  Stock looks good
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  No products need attention.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {lowStockProducts.map((product) => {
                  const image = product?.images?.[0]?.url;

                  return (
                    <div
                      key={product?._id}
                      className="p-4 flex items-center gap-3"
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-100"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Package size={16} className="text-slate-400" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-slate-800 truncate">
                          {product?.name}
                        </p>
                        <p className="text-[9px] text-slate-400 mt-0.5">
                          {formatCurrency(product?.price)}
                        </p>
                      </div>

                      <span className="px-2 py-1 rounded-md bg-rose-50 border border-rose-200 text-[9px] font-bold text-rose-600 whitespace-nowrap">
                        {product?.stock} left
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ================================================= */}
        {/* ALL PRODUCTS */}
        {/* ================================================= */}

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Package size={14} />
                </div>
                <h2 className="text-sm font-bold text-slate-900">
                  All Products
                </h2>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Full catalog owned by your store
              </p>
            </div>

            <span className="text-[9px] font-bold text-slate-400">
              {stats.totalProducts} items
            </span>
          </div>

          {products.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <Package size={20} className="text-slate-400" />
              </div>
              <p className="text-xs font-semibold text-slate-700 mt-3">
                No products yet
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Products added by you will show up here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-[9px] uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3">Product</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Price</th>
                    <th className="px-5 py-3">Stock</th>
                    <th className="px-5 py-3">Created</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {products.slice(0, 10).map((product) => {
                    const image = product?.images?.[0]?.url;
                    const stock = Number(product?.stock || 0);

                    return (
                      <tr
                        key={product?._id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            {image ? (
                              <img
                                src={image}
                                alt={product.name}
                                className="w-9 h-9 rounded-lg object-cover border border-slate-100"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                                <Package size={14} className="text-slate-400" />
                              </div>
                            )}
                            <span className="text-[10px] font-bold text-slate-800 max-w-[220px] truncate">
                              {product?.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-3">
                          <span className="text-[10px] font-medium text-slate-500">
                            {product?.category || "Other"}
                          </span>
                        </td>

                        <td className="px-5 py-3">
                          <span className="text-[10px] font-bold text-slate-900">
                            {formatCurrency(product?.price)}
                          </span>
                        </td>

                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-[9px] font-bold border ${
                              stock === 0
                                ? "bg-rose-50 text-rose-600 border-rose-200"
                                : stock <= 5
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            {stock} units
                          </span>
                        </td>

                        <td className="px-5 py-3">
                          <span className="text-[10px] text-slate-500">
                            {formatDate(product?.createdAt)}
                          </span>
                        </td>

                        <td className="px-5 py-3 text-right">
                          <button
                            onClick={() =>
                              navigate(`/seller/products/${product?._id}`)
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-orange-50 border border-orange-200 hover:bg-orange-500 hover:text-white text-[9px] font-bold text-orange-600 transition-all"
                          >
                            <Eye size={11} />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
