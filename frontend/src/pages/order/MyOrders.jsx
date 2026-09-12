import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import {
  ShoppingBag,
  AlertCircle,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

import API from "../../api/axios";
import OrderCard from "../../components/order/OrderCard";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Delete confirmation state
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  // ==========================================================
  // FETCH MY ORDERS
  // ==========================================================
  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await API.get("/orders/me");

      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("FETCH ORDERS ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load your orders. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  // ==========================================================
  // OPEN DELETE CONFIRMATION
  // ==========================================================
  const handleDeleteClick = (orderId) => {
    setOrderToDelete(orderId);
  };

  // ==========================================================
  // DELETE / HIDE ORDER FROM USER HISTORY
  // DELETE /api/v1/order/my/:id
  // ==========================================================
  const handleConfirmDelete = async () => {
    if (!orderToDelete || deleteLoading) return;

    try {
      setDeleteLoading(true);

      const { data } = await API.delete(
        `/order/my/${orderToDelete}`,
      );

      if (data.success) {
        // Remove order instantly from UI
        setOrders((prevOrders) =>
          prevOrders.filter(
            (order) => order._id !== orderToDelete,
          ),
        );

        toast.success(
          data.message ||
            "Order removed from your order history",
        );

        setOrderToDelete(null);
      }
    } catch (err) {
      console.error("DELETE ORDER ERROR:", err);

      toast.error(
        err.response?.data?.message ||
          "Failed to remove order",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // ==========================================================
  // CLOSE DELETE MODAL
  // ==========================================================
  const closeDeleteModal = () => {
    if (!deleteLoading) {
      setOrderToDelete(null);
    }
  };

  // ==========================================================
  // LOADING STATE
  // ==========================================================
  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-gradient-to-br from-orange-50/30 via-gray-50 to-gray-50">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin" />
        </div>

        <p className="text-sm font-semibold text-gray-600 mt-4 animate-pulse">
          Fetching your order history...
        </p>
      </div>
    );
  }

  // ==========================================================
  // ERROR STATE
  // ==========================================================
  if (error) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-gradient-to-br from-orange-50/30 via-gray-50 to-gray-50 p-4">
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
            onClick={fetchMyOrders}
            className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />

            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // ==========================================================
  // EMPTY STATE
  // ==========================================================
  if (orders.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-gradient-to-br from-orange-50/30 via-gray-50 to-gray-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-md w-full"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-200">
            <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
          </div>

          <h2 className="text-xl font-extrabold text-gray-900">
            No Orders Yet
          </h2>

          <p className="text-xs text-gray-500 mt-1.5 mb-6 leading-relaxed">
            Looks like you haven't placed any orders yet.
            Start exploring our catalogue and find something
            you love!
          </p>

          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold rounded-xl hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 transition-all duration-200"
          >
            Start Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  // ==========================================================
  // MAIN ORDERS PAGE
  // ==========================================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 via-gray-50 to-gray-100/60 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* ==================================================== */}
        {/* PAGE HEADER */}
        {/* ==================================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              My Orders
            </h1>

            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Track, view details, and manage your recent purchases
            </p>
          </div>

          <div className="bg-white border border-orange-200/70 px-3.5 py-1.5 rounded-full text-xs font-medium text-gray-600 shadow-xs self-start sm:self-auto">
            Total Orders:{" "}

            <span className="font-bold text-orange-600">
              {orders.length}
            </span>
          </div>
        </div>

        {/* ==================================================== */}
        {/* ORDER LIST */}
        {/* ==================================================== */}

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -30,
                  scale: 0.98,
                }}
                transition={{
                  delay: index * 0.04,
                  duration: 0.25,
                }}
              >
                <OrderCard
                  order={order}
                  onDelete={handleDeleteClick}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ==================================================== */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ==================================================== */}

      <AnimatePresence>
        {orderToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* BACKDROP */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDeleteModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* MODAL */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              transition={{
                type: "spring",
                duration: 0.3,
              }}
              className="relative z-10 w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-gray-100 p-6"
            >
              {/* HEADER */}

              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>

                <button
                  onClick={closeDeleteModal}
                  disabled={deleteLoading}
                  className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* CONTENT */}

              <h2 className="text-lg font-bold text-gray-900 mt-4">
                Remove this order?
              </h2>

              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                This order will be removed from your order history.
                You will no longer see it in your My Orders section.
              </p>

              {/* ACTION BUTTONS */}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeDeleteModal}
                  disabled={deleteLoading}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  {deleteLoading
                    ? "Removing..."
                    : "Remove"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyOrders;