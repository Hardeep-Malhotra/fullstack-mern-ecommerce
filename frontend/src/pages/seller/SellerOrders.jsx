  import { useEffect, useMemo, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import axios from "../../api/axios";
  import { motion, AnimatePresence } from "framer-motion";

  import {
    RefreshCw,
    ShoppingBag,
    Clock3,
    Truck,
    CheckCircle2,
    XCircle,
    Eye,
    CalendarDays,
    CreditCard,
    Package,
    AlertCircle,
  } from "lucide-react";

  const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    // =====================================================
    // FETCH SELLER ORDERS
    // =====================================================

    // const fetchOrders = async () => {
    //   try {
    //     setRefreshing(true);
    //     setError("");

    //     // IMPORTANT:
    //     // Seller route
    //     const { data } = await axios.get("/seller/orders");

    //     if (data.success) {
    //       setOrders(data.orders || []);
    //     }
    //   } catch (err) {
    //     console.error("Fetch seller orders error:", err);

    //     setError(err.response?.data?.message || "Failed to fetch seller orders");
    //   } finally {
    //     setRefreshing(false);
    //   }
    // };

    const fetchOrders = async () => {
  try {
    setRefreshing(true);
    setError("");

    console.log("🟠 SELLER ORDERS API CALL");

    const { data } = await axios.get("/seller/orders");

    console.log("🟢 SELLER ORDERS RESPONSE:", data);
    console.log("🟢 ORDERS:", data?.orders);

    if (data?.success) {
      setOrders(data.orders || []);
    }
  } catch (err) {
    console.error("🔴 SELLER ORDERS ERROR:", err);
    console.error("🔴 RESPONSE:", err?.response?.data);

    setError(
      err?.response?.data?.message ||
        "Failed to fetch seller orders"
    );
  } finally {
    setRefreshing(false);
  }
};

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
      let mounted = true;

      const loadOrders = async () => {
        try {
          setLoading(true);
          setError("");

          const { data } = await axios.get("/seller/orders");

          if (mounted && data.success) {
            setOrders(data.orders || []);
          }
        } catch (err) {
          if (mounted) {
            console.error("Fetch seller orders error:", err);

            setError(
              err.response?.data?.message || "Failed to fetch seller orders",
            );
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };

      loadOrders();

      return () => {
        mounted = false;
      };
    }, []);

    // =====================================================
    // ORDER STATS
    // =====================================================

    const stats = useMemo(() => {
      return orders.reduce(
        (acc, order) => {
          const status = order.orderStatus;

          if (acc[status] !== undefined) {
            acc[status]++;
          }

          return acc;
        },
        {
          Processing: 0,
          Shipped: 0,
          Delivered: 0,
          Cancelled: 0,
        },
      );
    }, [orders]);

    // =====================================================
    // STATUS CONFIG
    // =====================================================

    const getStatusConfig = (status) => {
      switch (status) {
        case "Processing":
          return {
            className: "bg-amber-50 text-amber-700 border-amber-200/60",
            icon: <Clock3 size={14} />,
          };

        case "Shipped":
          return {
            className: "bg-blue-50 text-blue-700 border-blue-200/60",
            icon: <Truck size={14} />,
          };

        case "Delivered":
          return {
            className: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
            icon: <CheckCircle2 size={14} />,
          };

        case "Cancelled":
          return {
            className: "bg-rose-50 text-rose-700 border-rose-200/60",
            icon: <XCircle size={14} />,
          };

        default:
          return {
            className: "bg-gray-50 text-gray-700 border-gray-200/60",
            icon: <Package size={14} />,
          };
      }
    };

    // =====================================================
    // CUSTOMER INITIAL
    // =====================================================

    const getInitial = (order) => {
      const name = order.user?.name || order.user?.email || "U";

      return name.charAt(0).toUpperCase();
    };

    // =====================================================
    // STAT CARDS
    // =====================================================

    const statCards = [
      {
        title: "Total Orders",
        value: orders.length,
        icon: <ShoppingBag size={21} />,
        iconBg: "bg-orange-50 text-orange-600",
      },

      {
        title: "Processing",
        value: stats.Processing,
        icon: <Clock3 size={21} />,
        iconBg: "bg-amber-50 text-amber-600",
      },

      {
        title: "Shipped",
        value: stats.Shipped,
        icon: <Truck size={21} />,
        iconBg: "bg-blue-50 text-blue-600",
      },

      {
        title: "Delivered",
        value: stats.Delivered,
        icon: <CheckCircle2 size={21} />,
        iconBg: "bg-emerald-50 text-emerald-600",
      },

      {
        title: "Cancelled",
        value: stats.Cancelled,
        icon: <XCircle size={21} />,
        iconBg: "bg-rose-50 text-rose-600",
      },
    ];

    // =====================================================
    // LOADING UI
    // =====================================================

    if (loading) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* HEADER SKELETON */}

          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <div className="h-7 w-48 bg-slate-200 rounded-lg animate-pulse" />

              <div className="h-4 w-64 bg-slate-100 rounded-lg animate-pulse" />
            </div>

            <div className="h-10 w-28 bg-slate-200 rounded-xl animate-pulse" />
          </div>

          {/* STATS SKELETON */}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-3"
              >
                <div className="w-11 h-11 rounded-xl bg-slate-100 animate-pulse shrink-0" />

                <div className="space-y-2 flex-1">
                  <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />

                  <div className="h-5 w-10 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* TABLE SKELETON */}

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="grid grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6].map((c) => (
                  <div
                    key={c}
                    className="h-8 bg-slate-100 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // =====================================================
    // ERROR UI
    // =====================================================

    if (error) {
      return (
        <motion.div
          className="min-h-[60vh] flex items-center justify-center px-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-sm">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={28} />
            </div>

            <h2 className="text-lg font-bold text-gray-900">
              Something went wrong
            </h2>

            <p className="text-xs text-gray-500 mt-1 mb-6">{error}</p>

            <button
              onClick={fetchOrders}
              className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <RefreshCw size={17} />
              Retry
            </button>
          </div>
        </motion.div>
      );
    }

    // =====================================================
    // MAIN UI
    // =====================================================

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* =================================================
            HEADER
        ================================================= */}

        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-200">
                <ShoppingBag size={23} />
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                My Orders
              </h1>
            </div>

            <p className="text-sm text-slate-500 mt-1 ml-[3.25rem]">
              Manage and track orders containing your products
            </p>
          </div>

          {/* REFRESH */}

          <motion.button
            onClick={fetchOrders}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:border-orange-300 hover:text-orange-600 transition-colors duration-200 disabled:opacity-60 self-start sm:self-auto"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />

            {refreshing ? "Refreshing..." : "Refresh"}
          </motion.button>
        </motion.div>

        {/* =================================================
            STATS
        ================================================= */}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.08,
                duration: 0.4,
              }}
              whileHover={{
                y: -4,
                transition: { duration: 0.2 },
              }}
              className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-3 hover:shadow-md hover:border-orange-100 transition-shadow duration-300"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${stat.iconBg}`}
              >
                {stat.icon}
              </div>

              <div>
                <span className="text-xs text-slate-500 font-medium block">
                  {stat.title}
                </span>

                <strong className="text-xl font-extrabold text-slate-900">
                  {stat.value}
                </strong>
              </div>
            </motion.div>
          ))}
        </div>

        {/* =================================================
            ORDERS
        ================================================= */}

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-4">
              <ShoppingBag size={32} />
            </div>

            <h2 className="text-xl font-bold text-slate-900">No Orders Found</h2>

            <p className="text-sm text-slate-500 mt-2">
              No customer orders contain your products yet.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
          >
            {/* =================================================
                TABLE TOPBAR
            ================================================= */}

            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-orange-50/30">
              <div>
                <h3 className="font-bold text-slate-900">Recent Orders</h3>

                <span className="text-xs text-slate-500">
                  {orders.length} total orders
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 bg-white px-3 py-1.5 rounded-full border border-orange-200">
                <Package size={15} />
                Seller Orders
              </div>
            </div>

            {/* =================================================
                TABLE
            ================================================= */}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left">
                    <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Order
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Customer
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Items
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Total
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Payment
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Status
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Date
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  <AnimatePresence>
                    {orders.map((order, index) => {
                      const statusConfig = getStatusConfig(order.orderStatus);

                      return (
                        <motion.tr
                          key={order._id}
                          initial={{
                            opacity: 0,
                            y: 12,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            delay: index * 0.045,
                            duration: 0.3,
                          }}
                          layout
                          className="hover:bg-orange-50/20 transition-colors duration-150"
                        >
                          {/* ORDER */}

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className="w-9 h-9 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                                <Package size={16} />
                              </span>

                              <div>
                                <strong className="font-mono text-xs font-bold text-slate-800 block">
                                  #{order._id ? order._id.slice(-8) : "N/A"}
                                </strong>

                                <small className="text-[10px] text-slate-400">
                                  Order ID
                                </small>
                              </div>
                            </div>
                          </td>

                          {/* CUSTOMER */}

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                                {getInitial(order)}
                              </div>

                              <div className="min-w-0">
                                <strong className="text-sm font-semibold text-slate-800 block truncate">
                                  {order.user?.name || "Unknown User"}
                                </strong>

                                <small className="text-xs text-slate-400 block truncate">
                                  {order.user?.email || "No email"}
                                </small>
                              </div>
                            </div>
                          </td>

                          {/* ITEMS */}

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Package size={15} />

                              <span className="font-medium">
                                {order.orderItems?.length || 0}
                              </span>
                            </div>
                          </td>

                          {/* TOTAL */}

                          <td className="px-6 py-4">
                            <strong className="font-bold text-slate-900">
                              ₹
                              {Number(order.totalPrice || 0).toLocaleString(
                                "en-IN",
                              )}
                            </strong>
                          </td>

                          {/* PAYMENT */}

                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
                              <CreditCard size={14} />

                              {order.paymentInfo?.status || "PAID"}
                            </span>
                          </td>

                          {/* STATUS */}

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-semibold border px-2.5 py-1 rounded-full ${statusConfig.className}`}
                            >
                              {statusConfig.icon}

                              {order.orderStatus || "Processing"}
                            </span>
                          </td>

                          {/* DATE */}

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <CalendarDays size={15} />

                              <span>
                                {order.createdAt
                                  ? new Date(order.createdAt).toLocaleDateString(
                                      "en-IN",
                                      {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      },
                                    )
                                  : "N/A"}
                              </span>
                            </div>
                          </td>

                          {/* ACTION */}

                          <td className="px-6 py-4">
                            <motion.button
                              onClick={() =>
                                navigate(`/seller/orders/${order._id}`)
                              }
                              whileHover={{
                                scale: 1.04,
                              }}
                              whileTap={{
                                scale: 0.95,
                              }}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold hover:shadow-md hover:shadow-orange-200 transition-shadow duration-200"
                            >
                              <Eye size={16} />
                              View
                            </motion.button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  export default SellerOrders;
