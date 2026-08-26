import { useEffect, useState } from "react";
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

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigate = useNavigate();

  // ==============================
  // FETCH DASHBOARD DATA
  // ==============================
  const fetchDashboardStats = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await axiosInstance.get("/admin/dashboard");

      if (response.data?.success) {
        setData(response.data);
      } else {
        toast.error("Unable to load dashboard data");
      }
    } catch (error) {
      console.error("DASHBOARD FETCH ERROR:", error);
      toast.error(
        error?.response?.data?.message || "Failed to load dashboard metrics",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==============================
  // INITIAL DASHBOARD LOAD
  // ==============================
  useEffect(() => {
    let ignore = false;

    const loadDashboard = async () => {
      try {
        const response = await axiosInstance.get("/admin/dashboard");

        if (!ignore && response.data?.success) {
          setData(response.data);
        }
      } catch (error) {
        if (!ignore) {
          console.error("DASHBOARD FETCH ERROR:", error);
          toast.error(
            error?.response?.data?.message ||
              "Failed to load dashboard metrics",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, []);

  // ==============================
  // LOADING STATE
  // ==============================
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <Loader />
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
    monthlyRevenue = [],
  } = data || {};

  // ==============================
  // NUMBER FORMATTER
  // ==============================
  const formatNumber = (value = 0) => {
    return Number(value || 0).toLocaleString("en-IN");
  };

  // ==============================
  // REVENUE CHART DATA MAPPING
  // ==============================
  const revenueChartData = Array.isArray(monthlyRevenue)
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

  // ==============================
  // ORDER STATUS DATA
  // ==============================
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
  // KPI CARDS (LIGHT + ORANGE THEME)
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
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-7">
        {/* HEADER */}
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
              Monitor your store performance, orders and inventory.
            </p>
          </div>

          <button
            onClick={() => fetchDashboardStats(true)}
            disabled={refreshing}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              border
              border-slate-200
              bg-white
              hover:bg-orange-50
              hover:border-orange-300
              text-sm
              font-semibold
              text-slate-700
              hover:text-orange-600
              shadow-sm
              transition-all
              duration-200
              disabled:opacity-50
              disabled:cursor-not-allowed
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
                className={`
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200/80
                  bg-white
                  p-5
                  shadow-sm
                  hover:shadow-md
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  ${card.border}
                `}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {card.title}
                    </p>

                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
                      {card.value}
                    </h3>
                  </div>

                  <div
                    className={`
                      p-3
                      rounded-xl
                      border
                      border-slate-100
                      ${card.iconBg}
                      ${card.iconColor}
                    `}
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
          {/* REVENUE OVERVIEW */}
          <div className="xl:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm">
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
                  <p className="text-xs text-slate-400 mt-1">
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

          {/* ORDER STATUS */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Order Status</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Current order distribution
              </p>
            </div>

            <div className="h-[230px] relative">
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
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  Orders
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              {orderStatusData.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.name}
                    className="
                      flex
                      items-center
                      justify-between
                      gap-2
                      p-2.5
                      rounded-xl
                      bg-slate-50
                      border
                      border-slate-100
                    "
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon size={14} style={{ color: item.color }} />
                      <span className="text-[11px] font-medium text-slate-600 truncate">
                        {item.name}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-slate-900">
                      {item.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* TABLES / LISTS */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* RECENT ORDERS TABLE */}
          <div className="xl:col-span-2 rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
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
                  className="
                    flex
                    items-center
                    gap-1
                    text-xs
                    font-bold
                    text-orange-600
                    hover:text-orange-700
                    transition-colors
                  "
                >
                  View All
                  <ArrowUpRight size={14} />
                </Link>
              )}
            </div>

            {recentOrders.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                  <ShoppingBasket size={24} className="text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  No recent orders
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  New orders will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] uppercase tracking-wider text-slate-400">
                      <th className="px-5 py-3.5">Order</th>
                      <th className="px-5 py-3.5">Customer</th>
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

                      return (
                        <tr
                          key={order?._id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="px-5 py-4">
                            <span className="font-mono text-xs font-bold text-slate-700">
                              #{order?._id?.slice(-6) || "------"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center text-xs font-bold text-orange-700">
                                {(order?.user?.name || "G")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <span className="text-xs font-semibold text-slate-800">
                                {order?.user?.name || "Guest User"}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`
                                inline-flex
                                items-center
                                px-2.5
                                py-1
                                rounded-full
                                text-[10px]
                                font-bold
                                border
                                ${badgeColors[status] || badgeColors.Processing}
                              `}
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
                              className="
                                inline-flex
                                items-center
                                gap-1.5
                                px-3
                                py-1.5
                                rounded-lg
                                bg-orange-50
                                border
                                border-orange-200
                                hover:bg-orange-500
                                hover:text-white
                                hover:border-orange-500
                                text-[11px]
                                font-bold
                                text-orange-600
                                transition-all
                              "
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

          {/* LOW STOCK ALERT */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm">
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

                <p className="text-xs text-slate-400 mt-1">
                  No products need restocking.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((product) => {
                  const stockCount = product?.stock ?? product?.Stock ?? 0;

                  const image =
                    product?.images?.[0]?.url ||
                    product?.images?.[0] ||
                    "/placeholder.png";

                  return (
                    <div
                      key={product?._id}
                      className="
                        flex
                        items-center
                        justify-between
                        gap-3
                        p-3
                        rounded-xl
                        bg-slate-50
                        border
                        border-slate-100
                        hover:border-orange-200
                        transition-all
                      "
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={image}
                          alt={product?.name || "Product"}
                          className="
                            w-11
                            h-11
                            rounded-xl
                            object-cover
                            bg-white
                            border
                            border-slate-200
                          "
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
    </div>
  );
};

export default AdminDashboard;
