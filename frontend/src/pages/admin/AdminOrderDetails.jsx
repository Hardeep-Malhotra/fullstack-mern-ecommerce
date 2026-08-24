import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  User,
  Mail,
  MapPin,
  Phone,
  CreditCard,
  CheckCircle2,
  Clock3,
  Truck,
  XCircle,
  CalendarDays,
  IndianRupee,
  ShieldCheck,
  MessageSquare,
  RefreshCw,
  Lock,
  Navigation,
} from "lucide-react";

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");

  // ==========================================
  // FETCH ORDER
  // ==========================================

  useEffect(() => {
    let isMounted = true;

    const loadOrder = async () => {
      try {
        const { data } = await axios.get(`/order/${id}`);

        if (isMounted && data.success) {
          setOrder(data.order);
          setStatus(data.order?.orderStatus || "");
        }
      } catch (error) {
        if (isMounted) {
          console.error("Fetch order error:", error);

          toast.error(error.response?.data?.message || "Failed to fetch order");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      loadOrder();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const handleStatusUpdate = async (e) => {
    e.preventDefault();

    if (!status) {
      toast.error("Please select a status");
      return;
    }

    if (status === order?.orderStatus && !comment.trim()) {
      toast.error("No changes to update");
      return;
    }

    try {
      setUpdating(true);

      const { data } = await axios.put(`/admin/order/${order._id}`, {
        status,
        comment: comment.trim() || `Order status updated to ${status}`,
      });

      if (data.success) {
        setOrder(data.order);
        setStatus(data.order.orderStatus);
        setComment("");

        toast.success(data.message || "Order status updated");
      }
    } catch (error) {
      console.error("Update order status error:", error);

      toast.error(
        error.response?.data?.message || "Failed to update order status",
      );
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // STATUS CONFIG
  // ==========================================

  const getStatusConfig = (value) => {
    switch (value) {
      case "Processing":
        return {
          icon: <Clock3 size={15} />,
          classes: "bg-amber-50 text-amber-700 border-amber-200",
        };

      case "Shipped":
        return {
          icon: <Truck size={15} />,
          classes: "bg-blue-50 text-blue-700 border-blue-200",
        };

      case "Delivered":
        return {
          icon: <CheckCircle2 size={15} />,
          classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };

      case "Cancelled":
        return {
          icon: <XCircle size={15} />,
          classes: "bg-rose-50 text-rose-700 border-rose-200",
        };

      default:
        return {
          icon: <Package size={15} />,
          classes: "bg-slate-50 text-slate-600 border-slate-200",
        };
    }
  };

  const statusConfig = getStatusConfig(order?.orderStatus);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-3">
            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />

            <div className="h-8 w-64 bg-slate-200 rounded-lg animate-pulse" />

            <div className="h-4 w-48 bg-slate-100 rounded animate-pulse" />
          </div>

          <div className="h-9 w-28 bg-slate-200 rounded-xl animate-pulse" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl border border-slate-200 p-6"
              >
                <div className="h-5 w-40 bg-slate-200 rounded animate-pulse mb-6" />

                <div className="space-y-4">
                  {[1, 2, 3].map((row) => (
                    <div
                      key={row}
                      className="h-12 bg-slate-100 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="h-5 w-36 bg-slate-200 rounded animate-pulse mb-6" />

              <div className="h-40 bg-slate-100 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // NOT FOUND
  // ==========================================

  if (!order) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[60vh] flex items-center justify-center px-4"
      >
        <div className="text-center bg-white border border-slate-200 rounded-2xl p-10 max-w-sm shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-5">
            <Package size={30} />
          </div>

          <h2 className="text-xl font-bold text-slate-900">Order Not Found</h2>

          <p className="text-sm text-slate-500 mt-2 mb-6">
            We couldn't find this order.
          </p>

          <button
            onClick={() => navigate("/admin/orders")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-orange-200 transition-all"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </button>
        </div>
      </motion.div>
    );
  }

  const isLocked =
    order.orderStatus === "Delivered" || order.orderStatus === "Cancelled";

  // ==========================================
  // MAIN
  // ==========================================

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* =====================================
          HEADER
      ===================================== */}

      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <motion.button
          onClick={() => navigate("/admin/orders")}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-orange-600 transition-colors mb-5"
        >
          <ArrowLeft size={17} />
          Back to Orders
        </motion.button>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-200">
                <Package size={23} />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Order #{order._id ? order._id.slice(-8) : "N/A"}
                </h1>

                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                  <CalendarDays size={13} />

                  <span>
                    Placed on{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString("en-IN")
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-2 self-start lg:self-auto px-4 py-2 rounded-full border text-sm font-bold ${statusConfig.classes}`}
          >
            {statusConfig.icon}
            {order.orderStatus}
          </div>
        </div>
      </motion.div>

      {/* =====================================
          MAIN GRID
      ===================================== */}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ===================================
            LEFT
        =================================== */}

        <div className="lg:col-span-2 space-y-6">
          {/* CUSTOMER + SHIPPING */}

          <div className="grid md:grid-cols-2 gap-6">
            {/* CUSTOMER */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <User size={19} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Customer Information
                  </h2>

                  <p className="text-[11px] text-slate-400">Customer details</p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Name
                  </span>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {order.user?.name || "N/A"}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Mail size={16} className="text-slate-400 mt-0.5 shrink-0" />

                  <div className="min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                      Email
                    </span>

                    <p className="text-sm text-slate-700 truncate mt-1">
                      {order.user?.email || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    User ID
                  </span>

                  <p className="font-mono text-[10px] text-slate-500 mt-1 break-all">
                    {order.user?._id || "N/A"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* SHIPPING */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <MapPin size={19} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Shipping Information
                  </h2>

                  <p className="text-[11px] text-slate-400">Delivery address</p>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex gap-3">
                  <Navigation
                    size={15}
                    className="text-slate-400 mt-0.5 shrink-0"
                  />

                  <p className="text-sm text-slate-700">
                    {order.shippingInfo?.address || "N/A"}
                  </p>
                </div>

                <p className="text-sm text-slate-600">
                  {order.shippingInfo?.city || "N/A"},{" "}
                  {order.shippingInfo?.state || "N/A"}
                </p>

                <p className="text-sm text-slate-600">
                  {order.shippingInfo?.country || "N/A"} -{" "}
                  {order.shippingInfo?.pinCode || "N/A"}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-sm text-slate-600">
                  <Phone size={15} />
                  {order.shippingInfo?.phoneNo || "N/A"}
                </div>
              </div>
            </motion.div>
          </div>

          {/* =================================
              ORDER ITEMS
          ================================= */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Package size={19} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">Order Items</h2>

                  <p className="text-[11px] text-slate-400">
                    {order.orderItems?.length || 0} products
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full">
                {order.orderItems?.length || 0} Items
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {order.orderItems?.map((item, index) => (
                <motion.div
                  key={item.product || index}
                  initial={{
                    opacity: 0,
                    x: -10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: 0.18 + index * 0.05,
                  }}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-orange-50/20 transition-colors"
                >
                  {/* IMAGE */}

                  <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* INFO */}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                      {item.name}
                    </h3>

                    <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2">
                      <span className="text-xs text-slate-500">
                        Qty:{" "}
                        <strong className="text-slate-700">
                          {item.quantity}
                        </strong>
                      </span>

                      <span className="text-xs text-slate-500">
                        Price: ₹
                        {Number(item.price || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* TOTAL */}

                  <div className="sm:text-right">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                      Subtotal
                    </span>

                    <strong className="text-base font-extrabold text-slate-900">
                      ₹
                      {Number(
                        (item.price || 0) * (item.quantity || 1),
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* =================================
              PAYMENT
          ================================= */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CreditCard size={19} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Payment Information
                </h2>

                <p className="text-[11px] text-slate-400">
                  Payment transaction details
                </p>
              </div>
            </div>

            <div className="p-6 grid sm:grid-cols-3 gap-5">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  Status
                </span>

                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <ShieldCheck size={14} />
                  {order.paymentInfo?.status || "PAID"}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  Payment ID
                </span>

                <p className="font-mono text-[10px] text-slate-600 mt-2 break-all">
                  {order.paymentInfo?.id || "N/A"}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  Paid At
                </span>

                <p className="text-xs text-slate-600 mt-2">
                  {order.paidAt
                    ? new Date(order.paidAt).toLocaleString("en-IN")
                    : "N/A"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* =================================
              STATUS HISTORY
          ================================= */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Clock3 size={19} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">Status History</h2>

                <p className="text-[11px] text-slate-400">
                  Order activity timeline
                </p>
              </div>
            </div>

            <div className="p-6">
              {order.statusHistory?.length > 0 ? (
                <div className="relative">
                  <div className="absolute left-[9px] top-3 bottom-3 w-px bg-slate-200" />

                  <div className="space-y-7">
                    {[...order.statusHistory]
                      .reverse()
                      .map((history, index) => {
                        const config = getStatusConfig(history.status);

                        return (
                          <motion.div
                            key={index}
                            initial={{
                              opacity: 0,
                              x: -10,
                            }}
                            animate={{
                              opacity: 1,
                              x: 0,
                            }}
                            transition={{
                              delay: 0.3 + index * 0.06,
                            }}
                            className="relative flex gap-4"
                          >
                            <div
                              className={`relative z-10 w-[19px] h-[19px] rounded-full border-4 border-white ring-1 ring-slate-200 flex items-center justify-center ${config.classes}`}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-current" />
                            </div>

                            <div className="flex-1 -mt-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <strong className="text-sm text-slate-800">
                                  {history.status}
                                </strong>

                                <span className="text-[10px] text-slate-400">
                                  {history.updatedAt
                                    ? new Date(
                                        history.updatedAt,
                                      ).toLocaleString("en-IN")
                                    : ""}
                                </span>
                              </div>

                              <p className="text-xs text-slate-500 mt-1">
                                {history.comment || "Status updated"}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock3 size={28} className="mx-auto text-slate-300 mb-2" />

                  <p className="text-sm text-slate-400">
                    No status history available.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ===================================
            RIGHT SIDEBAR
        =================================== */}

        <div className="space-y-6">
          {/* =================================
              PRICE SUMMARY
          ================================= */}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden lg:sticky lg:top-6"
          >
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Price Summary</h2>

              <p className="text-[11px] text-slate-400 mt-1">
                Complete order breakdown
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Items Price</span>

                  <strong className="text-slate-800">
                    ₹{Number(order.itemsPrice || 0).toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tax</span>

                  <strong className="text-slate-800">
                    ₹{Number(order.taxPrice || 0).toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Shipping</span>

                  <strong className="text-slate-800">
                    ₹{Number(order.shippingPrice || 0).toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>

              <div className="my-5 border-t border-dashed border-slate-200" />

              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Total</span>

                <div className="flex items-center gap-1 text-orange-600">
                  <IndianRupee size={18} />

                  <strong className="text-2xl font-extrabold">
                    {Number(order.totalPrice || 0).toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <ShieldCheck size={16} className="text-emerald-600" />

                <span className="text-[11px] font-semibold text-emerald-700">
                  Payment secured
                </span>
              </div>
            </div>
          </motion.div>

          {/* =================================
              UPDATE STATUS
          ================================= */}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <RefreshCw size={18} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">Update Status</h2>

                  <p className="text-[11px] text-slate-400">
                    Manage order progress
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {isLocked ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
                  <div className="w-11 h-11 mx-auto rounded-xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center mb-3">
                    <Lock size={18} />
                  </div>

                  <h3 className="text-sm font-bold text-slate-700">
                    Order Locked
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {order.orderStatus === "Delivered"
                      ? "This order has already been delivered and cannot be updated."
                      : "This order has been cancelled and cannot be updated."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleStatusUpdate} className="space-y-5">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                      Order Status
                    </label>

                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      disabled={updating}
                      className="w-full mt-2 px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all disabled:opacity-60"
                    >
                      <option value="Processing">Processing</option>

                      <option value="Shipped">Shipped</option>

                      <option value="Delivered">Delivered</option>

                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
                      <MessageSquare size={12} />
                      Comment
                    </label>

                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Example: Order has been shipped."
                      rows={4}
                      disabled={updating}
                      className="w-full mt-2 px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none resize-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all disabled:opacity-60"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={updating}
                    whileHover={{
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold shadow-md shadow-orange-200 hover:shadow-lg hover:shadow-orange-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {updating ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        Update Status
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
