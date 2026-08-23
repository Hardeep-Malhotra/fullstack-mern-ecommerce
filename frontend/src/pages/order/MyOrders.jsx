import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  ShoppingBag,
  ChevronRight,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  CreditCard,
} from "lucide-react";

import API from "../../api/axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchMyOrders = async () => {
      try {
        setError("");
        const { data } = await API.get("/orders/me");

        if (isMounted && data.success) {
          setOrders(data.orders || []);
        }
      } catch (err) {
        if (isMounted) {
          console.error("FETCH ORDERS ERROR:", err);
          setError(
            err.response?.data?.message || "Failed to load your orders.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMyOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  // Helper for Order Status Badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Delivered
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            <Clock className="w-3.5 h-3.5" />
            {status || "Processing"}
          </span>
        );
    }
  };

  // ==============================
  // LOADING STATE
  // ==============================
  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-gray-50/50">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-sm font-semibold text-gray-600 mt-4 animate-pulse">
          Fetching your order history...
        </p>
      </div>
    );
  }

  // ==============================
  // ERROR STATE
  // ==============================
  if (error) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-gray-50/50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-sm w-full"
        >
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 stroke-[2]" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">
            Something Went Wrong
          </h2>
          <p className="text-xs text-gray-500 mt-1 mb-6 leading-relaxed">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2.5 bg-gray-900 text-white text-xs font-semibold rounded-xl hover:bg-black transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // ==============================
  // EMPTY STATE (NO ORDERS)
  // ==============================
  if (orders.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-gray-50/50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-md w-full"
        >
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">
            No Orders Yet
          </h2>
          <p className="text-xs text-gray-500 mt-1.5 mb-6 leading-relaxed">
            Looks like you haven't placed any orders yet. Start exploring our
            catalogue and find something you love!
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
          >
            Start Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  // ==============================
  // MAIN ORDERS LIST
  // ==============================
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/60 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              My Orders
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Track, view details, and manage your recent purchases
            </p>
          </div>
          <div className="bg-white border border-gray-200/80 px-3.5 py-1.5 rounded-full text-xs font-medium text-gray-600 shadow-xs self-start sm:self-auto">
            Total Orders:{" "}
            <span className="font-bold text-gray-900">{orders.length}</span>
          </div>
        </div>

        {/* ORDER LIST CARDS */}
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              {/* CARD TOP INFO BAR */}
              <div className="bg-gray-50/70 border-b border-gray-100 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-200/80 flex items-center justify-center text-gray-600 shadow-2xs">
                    <Package className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                      Order Reference
                    </p>
                    <p className="font-mono text-xs font-bold text-gray-800">
                      #{order._id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                      Placed On
                    </p>
                    <p className="text-xs font-medium text-gray-700">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short", year: "numeric" },
                          )
                        : "N/A"}
                    </p>
                  </div>

                  <div>{renderStatusBadge(order.orderStatus)}</div>
                </div>
              </div>

              {/* PRODUCTS PREVIEW */}
              <div className="p-4 sm:p-6 divide-y divide-gray-100">
                {order.orderItems?.map((item, idx) => (
                  <div
                    key={item.product || idx}
                    className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-gray-100 shadow-2xs flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>
                          Qty:{" "}
                          <strong className="text-gray-700 font-medium">
                            {item.quantity}
                          </strong>
                        </span>
                        <span>•</span>
                        <span>
                          Price:{" "}
                          <strong className="text-gray-700 font-medium">
                            ₹{item.price?.toLocaleString("en-IN")}
                          </strong>
                        </span>
                      </div>
                    </div>

                    <div className="text-right font-bold text-gray-900 text-sm sm:text-base flex-shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>

              {/* CARD FOOTER */}
              <div className="bg-gray-50/40 border-t border-gray-100 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-gray-400">Payment: </span>
                    <span className="font-semibold text-emerald-600 inline-flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5" />
                      {order.paymentInfo?.status || "PAID"}
                    </span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <div>
                    <span className="text-gray-400">Total Amount: </span>
                    <span className="font-extrabold text-gray-900 text-base">
                      ₹{order.totalPrice?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/order/${order._id}`)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
                >
                  View Full Details
                  <ChevronRight className="w-4 h-4 stroke-[2]" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MyOrders;
