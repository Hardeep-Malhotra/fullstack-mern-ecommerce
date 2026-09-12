import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  RotateCcw,
  RefreshCw,
  AlertTriangle,
  Package,
  Calendar,
  User,
  Mail,
  Loader2,
  XCircle,
  EyeOff,
  X,
} from "lucide-react";

import API from "../../api/axios.js";
import toast from "react-hot-toast";

const AdminDeletedOrders = () => {
  // =====================================================
  // STATES
  // =====================================================
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Confirm dialogs — replaces window.confirm with an in-app modal
  // { type: "restore" | "delete" | "empty", order? }
  const [confirmAction, setConfirmAction] = useState(null);

  // =====================================================
  // FETCH DELETED & HIDDEN ORDERS
  // GET /admin/orders/deleted
  // =====================================================
  const fetchDeletedOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setLoadError(null);

      const { data } = await API.get("/admin/orders/deleted");

      setOrders(data.orders || []);

      if (isRefresh) {
        toast.success("Trash refreshed");
      }
    } catch (error) {
      console.error("Failed to fetch deleted orders:", error);
      const message =
        error.response?.data?.message || "Failed to load deleted orders";
      toast.error(message);
      // Only show the blocking error screen on the very first load —
      // a failed refresh shouldn't wipe out a list that's already on screen.
      if (!isRefresh) {
        setLoadError(message);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    (async () => {
      setLoading(true);
      setLoadError(null);

      try {
        const { data } = await API.get("/admin/orders/deleted");
        if (!ignore) setOrders(data.orders || []);
      } catch (error) {
        if (!ignore) {
          console.error("Failed to fetch deleted orders:", error);
          const message =
            error.response?.data?.message || "Failed to load deleted orders";
          toast.error(message);
          setLoadError(message);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  // =====================================================
  // RESTORE ORDER — PUT /admin/order/restore/:id
  // =====================================================
  const handleRestore = async (orderId) => {
    try {
      setActionLoading(orderId);

      const { data } = await API.put(`/admin/order/restore/${orderId}`);

      toast.success(data.message || "Order restored successfully");

      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (error) {
      console.error("Restore order error:", error);
      toast.error(error.response?.data?.message || "Failed to restore order");
    } finally {
      setActionLoading(null);
      setConfirmAction(null);
    }
  };

  // =====================================================
  // PERMANENT DELETE — DELETE /admin/order/permanent/:id
  // =====================================================
  const handlePermanentDelete = async (orderId) => {
    try {
      setActionLoading(orderId);

      const { data } = await API.delete(`/admin/order/permanent/${orderId}`);

      toast.success(data.message || "Order permanently deleted");

      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (error) {
      console.error("Permanent delete error:", error);
      toast.error(
        error.response?.data?.message || "Failed to permanently delete order",
      );
    } finally {
      setActionLoading(null);
      setConfirmAction(null);
    }
  };

  // =====================================================
  // EMPTY TRASH — DELETE /admin/orders/trash/empty
  // =====================================================
  const handleEmptyTrash = async () => {
    try {
      setActionLoading("empty-trash");

      const { data } = await API.delete("/admin/orders/trash/empty");

      toast.success(data.message || "Trash emptied successfully");

      setOrders([]);
    } catch (error) {
      console.error("Empty trash error:", error);
      toast.error(error.response?.data?.message || "Failed to empty trash");
    } finally {
      setActionLoading(null);
      setConfirmAction(null);
    }
  };

  const runConfirmedAction = () => {
    if (!confirmAction) return;
    if (confirmAction.type === "restore") handleRestore(confirmAction.order._id);
    else if (confirmAction.type === "delete") handlePermanentDelete(confirmAction.order._id);
    else if (confirmAction.type === "empty") handleEmptyTrash();
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "N/A";
    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-orange-500" />
          <p className="text-sm text-slate-500">Loading trash items...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR STATE — distinct from "trash is empty"
  // =====================================================
  if (loadError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[60vh] flex items-center justify-center px-4"
      >
        <div className="text-center bg-white border border-slate-200 rounded-2xl p-10 max-w-sm shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-5">
            <AlertTriangle size={30} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Couldn't load trash</h2>
          <p className="text-sm text-slate-500 mt-2 mb-6">{loadError}</p>
          <button
            onClick={() => fetchDeletedOrders(false)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================
  return (
    <div className="p-6 md:p-8">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Deleted & Hidden Orders
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage deleted and user-hidden orders in trash.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => fetchDeletedOrders(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin text-orange-500" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </motion.button>

          <motion.button
            whileHover={{ y: orders.length === 0 ? 0 : -2 }}
            whileTap={{ scale: orders.length === 0 ? 1 : 0.96 }}
            onClick={() => setConfirmAction({ type: "empty" })}
            disabled={orders.length === 0 || actionLoading === "empty-trash"}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {actionLoading === "empty-trash" ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Trash2 size={17} />
            )}
            Empty Trash
          </motion.button>
        </div>
      </motion.div>

      {/* WARNING BOX */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4"
      >
        <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-900">
            Deleted and Hidden orders are stored in Trash
          </p>
          <p className="text-sm text-amber-700 mt-1">
            You can restore an order back to the system or permanently remove it.
          </p>
        </div>
      </motion.div>

      <div className="mb-5">
        <p className="text-sm text-slate-500">
          Total items in trash:
          <span className="ml-1 font-bold text-slate-900">{orders.length}</span>
        </p>
      </div>

      {/* EMPTY STATE */}
      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-[400px] flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-2xl bg-white"
        >
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Trash2 size={30} className="text-slate-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Trash is empty</h2>
          <p className="text-sm text-slate-500 mt-2">
            There are no deleted or hidden orders.
          </p>
        </motion.div>
      ) : (
        /* ORDERS TABLE */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Order
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Removed Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                <AnimatePresence mode="popLayout">
                  {orders.map((order, index) => {
                    const isUserHidden = order.isHiddenByUser;
                    const removedDate = order.deletedAt || order.hiddenByUserAt;
                    const isBusy = actionLoading === order._id;

                    return (
                      <motion.tr
                        key={order._id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.25, delay: index * 0.03 }}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        {/* ORDER */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                              <Package size={18} className="text-orange-500" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                #{order._id?.slice(-8)?.toUpperCase() || "N/A"}
                              </p>
                              <p className="text-xs text-slate-400 mt-1">
                                {order.orderItems?.length || 0} item(s)
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* CUSTOMER */}
                        <td className="px-6 py-5">
                          <div>
                            <div className="flex items-center gap-2">
                              <User size={14} className="text-slate-400" />
                              <span className="text-sm font-medium text-slate-700">
                                {order.user?.name || "Unknown User"}
                              </span>
                            </div>
                            {order.user?.email && (
                              <div className="flex items-center gap-2 mt-1">
                                <Mail size={13} className="text-slate-400" />
                                <span className="text-xs text-slate-400">
                                  {order.user.email}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* TYPE */}
                        <td className="px-6 py-5">
                          {isUserHidden ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-600 border border-purple-200">
                              <EyeOff size={12} />
                              User Hidden
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
                              <Trash2 size={12} />
                              Admin Deleted
                            </span>
                          )}
                        </td>

                        {/* AMOUNT */}
                        <td className="px-6 py-5">
                          <p className="text-sm font-bold text-slate-900">
                            ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                          </p>
                        </td>

                        {/* REMOVED DATE */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Calendar size={15} />
                            {formatDate(removedDate)}
                          </div>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-2">
                            {/* RESTORE */}
                            <motion.button
                              whileHover={{ scale: isBusy ? 1 : 1.08 }}
                              whileTap={{ scale: isBusy ? 1 : 0.9 }}
                              onClick={() => setConfirmAction({ type: "restore", order })}
                              disabled={isBusy}
                              title="Restore Order"
                              className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors disabled:opacity-50"
                            >
                              {isBusy ? (
                                <Loader2 size={17} className="animate-spin" />
                              ) : (
                                <RotateCcw size={17} />
                              )}
                            </motion.button>

                            {/* PERMANENT DELETE */}
                            <motion.button
                              whileHover={{ scale: isBusy ? 1 : 1.08 }}
                              whileTap={{ scale: isBusy ? 1 : 0.9 }}
                              onClick={() => setConfirmAction({ type: "delete", order })}
                              disabled={isBusy}
                              title="Delete Permanently"
                              className="w-10 h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors disabled:opacity-50"
                            >
                              <XCircle size={18} />
                            </motion.button>
                          </div>
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

      {/* CONFIRM MODAL — replaces window.confirm for restore / delete / empty */}
      <AnimatePresence>
        {confirmAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !actionLoading && setConfirmAction(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 z-10"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                    confirmAction.type === "restore"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {confirmAction.type === "restore" ? (
                    <RotateCcw size={20} />
                  ) : (
                    <AlertTriangle size={20} />
                  )}
                </div>
                <button
                  onClick={() => !actionLoading && setConfirmAction(null)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <h2 className="text-lg font-bold text-slate-900 mt-4">
                {confirmAction.type === "restore" && "Restore this order?"}
                {confirmAction.type === "delete" && "Delete this order permanently?"}
                {confirmAction.type === "empty" && "Empty the entire trash?"}
              </h2>

              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {confirmAction.type === "restore" && (
                  <>
                    Order{" "}
                    <span className="font-semibold text-slate-700">
                      #{confirmAction.order?._id?.slice(-8)?.toUpperCase()}
                    </span>{" "}
                    will be moved back into the active orders list.
                  </>
                )}
                {confirmAction.type === "delete" && (
                  <>
                    Order{" "}
                    <span className="font-semibold text-slate-700">
                      #{confirmAction.order?._id?.slice(-8)?.toUpperCase()}
                    </span>{" "}
                    will be permanently deleted. This action cannot be undone.
                  </>
                )}
                {confirmAction.type === "empty" && (
                  <>
                    All{" "}
                    <span className="font-semibold text-slate-700">
                      {orders.length}
                    </span>{" "}
                    order(s) in trash will be permanently deleted. This action
                    cannot be undone.
                  </>
                )}
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setConfirmAction(null)}
                  disabled={!!actionLoading}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={runConfirmedAction}
                  disabled={!!actionLoading}
                  className={`flex-1 py-2.5 rounded-xl text-white text-xs font-semibold transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5 ${
                    confirmAction.type === "restore"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {actionLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : confirmAction.type === "restore" ? (
                    "Restore"
                  ) : confirmAction.type === "empty" ? (
                    "Empty Trash"
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDeletedOrders;