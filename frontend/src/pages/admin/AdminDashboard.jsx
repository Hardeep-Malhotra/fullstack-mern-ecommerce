import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Users,
  Package,
  ShoppingBag,
  IndianRupee,
  Eye,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  ShoppingBasket,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  Calendar,
  Boxes,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import axiosInstance from "../../api/axios";
import Loader from "../../components/common/Loader";

// Safely resolve an image-like field that might be a string, an
// object ({ url }), or missing entirely — never passes an object
// straight into an <img src>.
const resolveImageSrc = (value, fallback = "/placeholder.png") => {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "object" && typeof value.url === "string") {
    return value.url;
  }
  return fallback;
};

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const navigate = useNavigate();

  // ==============================
  // SINGLE SOURCE OF TRUTH FOR FETCHING
  // Used for both the initial load and the manual refresh button,
  // so the two can never drift out of sync.
  // ==============================
  const fetchDashboardStats = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
      setLoadError(null);
    }

    try {
      const response = await axiosInstance.get("/admin/dashboard");

      if (response.data?.success) {
        setData(response.data);
        setLoadError(null);
        if (isRefresh) {
          toast.success("Dashboard refreshed");
        }
      } else {
        throw new Error(
          response.data?.message || "Unable to load dashboard data",
        );
      }
    } catch (error) {
      console.error("DASHBOARD FETCH ERROR:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load dashboard metrics";
      toast.error(message);
      if (!isRefresh) {
        setLoadError(message);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ==============================
  // INITIAL LOAD (race-condition safe)
  // ==============================
  useEffect(() => {
    let ignore = false;

    (async () => {
      setLoading(true);
      setLoadError(null);

      try {
        const response = await axiosInstance.get("/admin/dashboard");

        if (ignore) return;

        if (response.data?.success) {
          setData(response.data);
        } else {
          throw new Error(
            response.data?.message || "Unable to load dashboard data",
          );
        }
      } catch (error) {
        if (!ignore) {
          console.error("DASHBOARD FETCH ERROR:", error);
          const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to load dashboard metrics";
          toast.error(message);
          setLoadError(message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  // ==============================
  // LOADING STATE
  // ==============================
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white">
        <Loader />
      </div>
    );
  }

  // ==============================
  // ERROR STATE — instead of silently rendering a zeroed dashboard
  // ==============================
  if (loadError && !data) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white px-4">
        <div className="text-center bg-white border border-orange-100 rounded-2xl p-10 max-w-sm shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-5">
            <AlertTriangle size={30} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Couldn't load dashboard
          </h2>
          <p className="text-sm text-slate-500 mt-2 mb-6">{loadError}</p>
          <button
            onClick={() => fetchDashboardStats(false)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==============================
  // SAFE DATA PARSING
  // ==============================
  const {
    stats = {},
    recentOrders = [],
    lowStockProducts = [],
    allProducts = [],
    monthlyRevenue = [],
  } = data || {};

  const formatNumber = (value = 0) => {
    return Number(value || 0).toLocaleString("en-IN");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  // ==============================
  // REVENUE CHART DATA MAPPING (FIX FOR SINGLE MONTH DOT ISSUE)
  // ==============================
  let rawRevenueData = Array.isArray(monthlyRevenue)
    ? monthlyRevenue.map((item) => ({
        month: item.month || item._id || item.name || "N/A",
        revenue:
          item.revenue ??
          item.totalAmount ??
          item.amount ??
          item.totalRevenue ??
          0,
      }))
    : [];

  const revenueChartData = (() => {
    if (rawRevenueData.length === 0) return [];
    if (rawRevenueData.length >= 2) return rawRevenueData;

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentEntry = rawRevenueData[0];
    // Normalize so "January" / "january" / "JAN" all match "Jan"
    const normalizedMonth = String(currentEntry.month || "").slice(0, 3);
    const currentMonthIndex = months.findIndex(
      (m) => m.toLowerCase() === normalizedMonth.toLowerCase(),
    );

    if (currentMonthIndex === -1) {
      return [{ month: "Prev", revenue: 0 }, currentEntry];
    }

    const paddedData = [];
    for (let i = 5; i > 0; i--) {
      const prevIdx = (currentMonthIndex - i + 12) % 12;
      paddedData.push({ month: months[prevIdx], revenue: 0 });
    }
    paddedData.push(currentEntry);
    return paddedData;
  })();

  // ==============================
  // ORDER STATUS DATA & PERCENTAGE CALCULATION (VIEW ONLY)
  // ==============================
  const totalOrdersCount = stats?.totalOrders || recentOrders.length || 0;

  const getPercentage = (count) => {
    if (!totalOrdersCount || totalOrdersCount === 0) return "0%";
    return `${Math.round((count / totalOrdersCount) * 100)}%`;
  };

  const orderStatusData = [
    {
      name: "Processing",
      value: stats?.processing || 0,
      color: "#F59E0B",
      icon: Clock,
    },
    {
      name: "Shipped",
      value: stats?.shipped || 0,
      color: "#3B82F6",
      icon: Truck,
    },
    {
      name: "Delivered",
      value: stats?.delivered || 0,
      color: "#F97316",
      icon: CheckCircle2,
    },
    {
      name: "Cancelled",
      value: stats?.cancelled || 0,
      color: "#EF4444",
      icon: XCircle,
    },
  ];

  // ==============================
  // KPI CARDS
  // ==============================
  const statCards = [
    {
      title: "Total Revenue",
      value: `₹${formatNumber(stats?.totalRevenue)}`,
      description: "Total earnings",
      icon: IndianRupee,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      border: "hover:border-orange-300",
    },
    {
      title: "Total Orders",
      value: formatNumber(stats?.totalOrders),
      description: "Store transactions",
      icon: ShoppingBag,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      border: "hover:border-orange-300",
    },
    {
      title: "Total Products",
      value: formatNumber(stats?.totalProducts),
      description: "Products in catalog",
      icon: Package,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      border: "hover:border-amber-300",
    },
    {
      title: "Total Users",
      value: formatNumber(stats?.totalUsers),
      description: "Registered accounts",
      icon: Users,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      border: "hover:border-orange-300",
    },
  ];

  return (
    <div className="min-h-screen  text-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-7">
        {/* HEADER — view-only dashboard, no CRUD action here */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-600">
                Admin Control Center
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Dashboard
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Full store overview — manage your store from the Admin Panel.
            </p>
          </div>

          <button
            onClick={() => fetchDashboardStats(true)}
            disabled={refreshing}
            className="
              inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl
              border border-orange-100 bg-white hover:bg-orange-50 hover:border-orange-300
              text-sm font-semibold text-slate-700 hover:text-orange-600 shadow-sm
              transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin text-orange-500" : ""}
            />
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className={`group relative overflow-hidden rounded-2xl border border-orange-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 ${card.border}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      {card.title}
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
                      {card.value}
                    </h3>
                  </div>
                  <div
                    className={`p-3 rounded-xl border border-slate-100 ${card.iconBg} ${card.iconColor}`}
                  >
                    <Icon size={21} />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-100">
                    <TrendingUp size={11} className="text-orange-600" />
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {card.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 rounded-2xl border border-orange-100 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Revenue Overview
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Monthly revenue performance
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                  Live
                </span>
              </div>
            </div>

            <div className="h-[300px]">
              {revenueChartData.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                    <TrendingUp size={22} className="text-orange-500" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    No revenue data
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Revenue analytics will appear here.
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData}>
                    <defs>
                      <linearGradient
                        id="lightOrangeGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#F97316"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor="#F97316"
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      stroke="#F1F5F9"
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) =>
                        `₹${Number(value).toLocaleString("en-IN")}`
                      }
                    />
                    <Tooltip
                      cursor={{
                        stroke: "#F97316",
                        strokeWidth: 1,
                        strokeDasharray: "3 3",
                      }}
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #FED7AA",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                      }}
                      labelStyle={{
                        color: "#EA580C",
                        fontSize: 12,
                        fontWeight: "bold",
                        marginBottom: 4,
                      }}
                      formatter={(value) => [
                        `₹${Number(value).toLocaleString("en-IN")}`,
                        "Revenue",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#F97316"
                      strokeWidth={3}
                      fill="url(#lightOrangeGradient)"
                      fillOpacity={1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ORDER STATUS — view only, no update controls */}
          <div className="rounded-2xl border border-orange-100 bg-white p-5 sm:p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Order Status</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Current order distribution
              </p>
            </div>

            <div className="h-[210px] relative my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    innerRadius={65}
                    outerRadius={88}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {orderStatusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: "12px",
                      boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900">
                  {formatNumber(stats?.totalOrders)}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  Orders
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {orderStatusData.map((item) => {
                const Icon = item.icon;
                const percentage = getPercentage(item.value);
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-slate-100"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon size={14} style={{ color: item.color }} />
                      <span className="text-[11px] font-medium text-slate-600 truncate">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900">
                        {item.value}
                      </span>
                      <span className="text-[10px] text-slate-500 ml-1 font-semibold">
                        ({percentage})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RECENT ORDERS — view only. */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 rounded-2xl border border-orange-100 bg-white shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="p-5 sm:p-6 flex items-center justify-between border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Recent Orders
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Latest transactions from your store
                  </p>
                </div>

                {recentOrders.length > 0 && (
                  <Link
                    to="/admin/orders"
                    className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    View All
                    <ArrowUpRight size={14} />
                  </Link>
                )}
              </div>

              {recentOrders.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                    <ShoppingBasket size={24} className="text-slate-500" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    No recent orders
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    New orders will appear here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 bg-orange-50/40 text-[10px] uppercase tracking-wider text-slate-500">
                        <th className="px-5 py-3.5">Order</th>
                        <th className="px-5 py-3.5">Customer</th>
                        <th className="px-5 py-3.5">Date</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5">Amount</th>
                        <th className="px-5 py-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentOrders.map((order) => {
                        const status =
                          order?.orderStatus || order?.status || "Processing";
                        const badgeColors = {
                          Processing:
                            "bg-amber-50 text-amber-700 border-amber-200",
                          Shipped: "bg-blue-50 text-blue-700 border-blue-200",
                          Delivered:
                            "bg-orange-50 text-orange-700 border-orange-200",
                          Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
                        };
                        const userAvatar = resolveImageSrc(
                          order?.user?.avatar || order?.user?.profileImage,
                          null,
                        );

                        return (
                          <tr
                            key={order?._id}
                            className="hover:bg-white/80 transition-colors"
                          >
                            <td className="px-5 py-4">
                              <span className="font-mono text-xs font-bold text-slate-700">
                                #{order?._id?.slice(-6) || "------"}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                {userAvatar ? (
                                  <img
                                    src={userAvatar}
                                    alt={order?.user?.name || "Customer"}
                                    className="w-8 h-8 rounded-full object-cover border border-orange-200 bg-white"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                                    {(order?.user?.name || "G")
                                      .charAt(0)
                                      .toUpperCase()}
                                  </div>
                                )}
                                <span className="text-xs font-semibold text-slate-800">
                                  {order?.user?.name || "Guest User"}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                                <Calendar
                                  size={13}
                                  className="text-slate-500"
                                />
                                {formatDate(order?.createdAt)}
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${badgeColors[status] || badgeColors.Processing}`}
                              >
                                {status}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-xs font-bold text-slate-900">
                                ₹{formatNumber(order?.totalPrice)}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <button
                                onClick={() =>
                                  navigate(`/admin/orders/${order?._id}`)
                                }
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 hover:bg-orange-500 hover:text-white hover:border-orange-500 text-[11px] font-bold text-orange-600 transition-all"
                              >
                                <Eye size={13} />
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

          {/* LOW STOCK — view only, no "Manage Inventory" link anymore */}
          <div className="rounded-2xl border border-orange-100 bg-white p-5 sm:p-6 shadow-sm min-h-[360px] flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">
                      Low Stock
                    </h2>
                    {lowStockProducts.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[9px] font-bold">
                        {lowStockProducts.length}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Products that need attention
                  </p>
                </div>
                <AlertTriangle
                  size={19}
                  className={
                    lowStockProducts.length > 0
                      ? "text-orange-500"
                      : "text-slate-300"
                  }
                />
              </div>

              {lowStockProducts.length === 0 ? (
                <div className="py-16 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-3">
                    <Sparkles size={22} className="text-orange-500" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    Inventory looks healthy
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    No products need restocking.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lowStockProducts.map((product) => {
                    const stockCount = product?.stock ?? product?.Stock ?? 0;
                    const image = resolveImageSrc(product?.images?.[0]);

                    return (
                      <div
                        key={product?._id}
                        className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:border-orange-200 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={image}
                            alt={product?.name || "Product"}
                            className="w-11 h-11 rounded-xl object-cover bg-white border border-orange-100"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-800 truncate max-w-[130px]">
                              {product?.name || "Unnamed Product"}
                            </h4>
                            <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
                              ₹{formatNumber(product?.price)}
                            </p>
                          </div>
                        </div>
                        <span className="shrink-0 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-[10px] font-bold text-rose-600">
                          {stockCount} left
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ALL PRODUCTS — full read-only catalog, no add/edit/delete here. */}
        <div className="rounded-2xl border border-orange-100 bg-white shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-100 text-amber-600">
                <Boxes size={18} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  All Products
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Full catalog across all sellers
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {formatNumber(allProducts.length)} items
            </span>
          </div>

          {allProducts.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                <Package size={22} className="text-slate-500" />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                No products yet
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Products added by sellers will show up here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[420px]">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-slate-100 bg-orange-50/40 text-[10px] uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-3.5">Product</th>
                    <th className="px-5 py-3.5">Seller</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5">Price</th>
                    <th className="px-5 py-3.5">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allProducts.map((product) => {
                    const image = resolveImageSrc(product?.images?.[0]);
                    return (
                      <tr
                        key={product?._id}
                        className="hover:bg-white/80 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={image}
                              alt={product?.name || "Product"}
                              className="w-9 h-9 rounded-lg object-cover bg-white border border-orange-100"
                            />
                            <span className="text-xs font-semibold text-slate-800 truncate max-w-[160px]">
                              {product?.name || "Unnamed Product"}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-600">
                          {product?.seller?.name || product?.sellerName || "—"}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-600">
                          {product?.category || "—"}
                        </td>
                        <td className="px-5 py-3.5 text-xs font-bold text-slate-900">
                          ₹{formatNumber(product?.price)}
                        </td>
                        <td className="px-5 py-3.5 text-xs font-semibold text-slate-700">
                          {product?.stock ?? product?.Stock ?? 0}
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

export default AdminDashboard;
