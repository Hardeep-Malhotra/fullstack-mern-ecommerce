
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axios";
import { motion } from "framer-motion";

import {
  ArrowLeft,
  Package,
  User,
  Mail,
  MapPin,
  Phone,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock3,
  XCircle,
  RefreshCw,
  AlertCircle,
  CalendarDays,
  IndianRupee,
  ShieldCheck,
  Navigation,
  Lock,
} from "lucide-react";

const SellerOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // =====================================================
  // FETCH ORDER
  // =====================================================

  const loadOrder = async (showRefreshToast = false) => {
    if (!id) return;

    try {
      if (showRefreshToast) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const { data } = await axiosInstance.get(
        `/seller/orders/${id}`
      );

      if (!data?.success || !data?.order) {
        throw new Error(
          data?.message || "Failed to fetch order details"
        );
      }

      setOrder(data.order);

      if (showRefreshToast) {
        toast.success("Order details refreshed");
      }
    } catch (error) {
      console.error(
        "SELLER ORDER DETAILS ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch order details"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    let ignore = false;

    const fetchInitialOrder = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await axiosInstance.get(
          `/seller/orders/${id}`
        );

        if (ignore) return;

        if (!data?.success || !data?.order) {
          throw new Error(
            data?.message ||
              "Failed to fetch order details"
          );
        }

        setOrder(data.order);
      } catch (error) {
        if (!ignore) {
          console.error(
            "SELLER ORDER DETAILS ERROR:",
            error
          );

          toast.error(
            error?.response?.data?.message ||
              error?.message ||
              "Failed to fetch order details"
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchInitialOrder();

    return () => {
      ignore = true;
    };
  }, [id]);

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = () => {
    loadOrder(true);
  };

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const updateStatus = async (status) => {
    if (!id || updating) return;

    try {
      setUpdating(true);

      const { data } = await axiosInstance.put(
        `/seller/orders/${id}`,
        {
          status,
        }
      );

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Failed to update order status"
        );
      }

      if (data?.order) {
        setOrder(data.order);
      } else {
        await loadOrder(false);
      }

      toast.success(
        `Order marked as ${status}`
      );
    } catch (error) {
      console.error(
        "UPDATE STATUS ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdating(false);
    }
  };

  // =====================================================
  // STATUS CONFIG
  // =====================================================

  const getStatusConfig = (status) => {
    switch (status) {
      case "Processing":
        return {
          className:
            "bg-amber-50 text-amber-700 border-amber-200",
          icon: <Clock3 size={16} />,
        };

      case "Shipped":
        return {
          className:
            "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Truck size={16} />,
        };

      case "Delivered":
        return {
          className:
            "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <CheckCircle2 size={16} />,
        };

      case "Cancelled":
        return {
          className:
            "bg-rose-50 text-rose-700 border-rose-200",
          icon: <XCircle size={16} />,
        };

      default:
        return {
          className:
            "bg-slate-50 text-slate-700 border-slate-200",
          icon: <Package size={16} />,
        };
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-3">
            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />

            <div className="h-8 w-64 bg-slate-200 rounded-lg animate-pulse" />

            <div className="h-4 w-48 bg-slate-100 rounded animate-pulse" />
          </div>

          <div className="h-10 w-10 bg-slate-200 rounded-xl animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-60 bg-white rounded-2xl border border-slate-200 animate-pulse" />

              <div className="h-60 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            </div>

            <div className="h-80 bg-white rounded-2xl border border-slate-200 animate-pulse" />

            <div className="h-56 bg-white rounded-2xl border border-slate-200 animate-pulse" />

            <div className="h-72 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          </div>

          <div className="space-y-6">
            <div className="h-80 bg-white rounded-2xl border border-slate-200 animate-pulse" />

            <div className="h-72 bg-white rounded-2xl border border-slate-200 animate-pulse" />

            <div className="h-48 bg-slate-900 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // ORDER NOT FOUND
  // =====================================================

  if (!order) {
    return (
      <motion.div
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="min-h-[60vh] flex items-center justify-center px-4"
      >
        <div className="text-center bg-white border border-slate-200 rounded-2xl p-10 max-w-sm shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-5">
            <AlertCircle size={30} />
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            Order Not Found
          </h2>

          <p className="text-sm text-slate-500 mt-2 mb-6">
            This order could not be found.
          </p>

          <button
            onClick={() =>
              navigate("/seller/orders")
            }
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </button>
        </div>
      </motion.div>
    );
  }

  // =====================================================
  // DATA
  // =====================================================

  const statusConfig = getStatusConfig(
    order.orderStatus
  );

  const sellerItems = order.orderItems || [];

  const itemsTotal = sellerItems.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  const isLocked =
    order.orderStatus === "Delivered" ||
    order.orderStatus === "Cancelled";

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: -15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <button
              onClick={() =>
                navigate("/seller/orders")
              }
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-orange-600 transition mb-4"
            >
              <ArrowLeft size={17} />
              Back to Orders
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-200">
                <Package size={23} />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Order #
                  {order._id
                    ?.slice(-8)
                    ?.toUpperCase()}
                </h1>

                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  <CalendarDays size={13} />

                  <span>
                    Placed on{" "}
                    {order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleString(
                          "en-IN"
                        )
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* STATUS BADGE */}

            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold ${statusConfig.className}`}
            >
              {statusConfig.icon}

              {order.orderStatus || "N/A"}
            </div>

            {/* REFRESH */}

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-orange-200 transition disabled:opacity-50"
              title="Refresh order details"
            >
              <RefreshCw
                size={18}
                className={
                  refreshing
                    ? "animate-spin text-orange-500"
                    : "text-slate-600"
                }
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* =================================================
            LEFT COLUMN
        ================================================= */}

        <div className="lg:col-span-2 space-y-6">

          {/* =================================================
              CUSTOMER + SHIPPING
          ================================================= */}

          <div className="grid md:grid-cols-2 gap-6">

            {/* CUSTOMER */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.05,
              }}
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

                  <p className="text-[11px] text-slate-400">
                    Customer details
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Name
                  </span>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {order.user?.name ||
                      "N/A"}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Mail
                    size={16}
                    className="text-slate-400 mt-0.5 shrink-0"
                  />

                  <div className="min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                      Email
                    </span>

                    <p className="text-sm text-slate-700 truncate mt-1">
                      {order.user?.email ||
                        "N/A"}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    User ID
                  </span>

                  <p className="font-mono text-[10px] text-slate-500 mt-1 break-all">
                    {order.user?._id ||
                      "N/A"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* SHIPPING */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.1,
              }}
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

                  <p className="text-[11px] text-slate-400">
                    Delivery address
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex gap-3">
                  <Navigation
                    size={15}
                    className="text-slate-400 mt-0.5 shrink-0"
                  />

                  <p className="text-sm text-slate-700">
                    {order.shippingInfo
                      ?.address || "N/A"}
                  </p>
                </div>

                <p className="text-sm text-slate-600">
                  {order.shippingInfo?.city ||
                    "N/A"}
                  ,{" "}
                  {order.shippingInfo?.state ||
                    "N/A"}
                </p>

                <p className="text-sm text-slate-600">
                  {order.shippingInfo
                    ?.country || "N/A"}{" "}
                  -{" "}
                  {order.shippingInfo
                    ?.pinCode || "N/A"}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-sm text-slate-600">
                  <Phone size={15} />

                  {order.shippingInfo
                    ?.phoneNo || "N/A"}
                </div>
              </div>
            </motion.div>
          </div>

          {/* =================================================
              ORDER ITEMS
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.15,
            }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Package size={19} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Ordered Products
                  </h2>

                  <p className="text-[11px] text-slate-400">
                    Products in this order
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full">
                {sellerItems.length}{" "}
                {sellerItems.length === 1
                  ? "Item"
                  : "Items"}
              </span>
            </div>

            {sellerItems.length === 0 ? (
              <div className="p-10 text-center">
                <Package
                  size={30}
                  className="mx-auto text-slate-300 mb-2"
                />

                <p className="text-sm text-slate-500">
                  No products found in
                  this order.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {sellerItems.map(
                  (item, index) => (
                    <motion.div
                      key={
                        item.product?._id ||
                        item.product ||
                        index
                      }
                      initial={{
                        opacity: 0,
                        x: -10,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay:
                          0.18 +
                          index * 0.05,
                      }}
                      className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-orange-50/20 transition-colors"
                    >
                      <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={
                            item.name ||
                            "Product"
                          }
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 text-sm sm:text-base line-clamp-2">
                          {item.name ||
                            "Product"}
                        </h3>

                        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2">
                          <span className="text-xs text-slate-500">
                            Qty:{" "}
                            <strong className="text-slate-700">
                              {item.quantity ||
                                0}
                            </strong>
                          </span>

                          <span className="text-xs text-slate-500">
                            Price: ₹
                            {Number(
                              item.price ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="sm:text-right">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                          Subtotal
                        </span>

                        <strong className="text-base font-extrabold text-slate-900">
                          ₹
                          {(
                            Number(
                              item.price ||
                                0
                            ) *
                            Number(
                              item.quantity ||
                                0
                            )
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            )}

            {sellerItems.length > 0 && (
              <div className="px-6 py-5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600">
                  Your Products Total
                </span>

                <span className="text-lg font-bold text-orange-600">
                  ₹
                  {itemsTotal.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>
            )}
          </motion.div>

          {/* =================================================
              PAYMENT INFORMATION
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
            }}
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

                  {order.paymentInfo
                    ?.status || "N/A"}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  Payment ID
                </span>

                <p className="font-mono text-[10px] text-slate-600 mt-2 break-all">
                  {order.paymentInfo?.id ||
                    "N/A"}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  Paid At
                </span>

                <p className="text-xs text-slate-600 mt-2">
                  {order.paidAt
                    ? new Date(
                        order.paidAt
                      ).toLocaleString(
                        "en-IN"
                      )
                    : "N/A"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* =================================================
              STATUS HISTORY TIMELINE
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.25,
            }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Clock3 size={19} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Status History
                </h2>

                <p className="text-[11px] text-slate-400">
                  Order activity timeline
                </p>
              </div>
            </div>

            <div className="p-6">
              {order.statusHistory?.length >
              0 ? (
                <div className="relative">
                  {/* TIMELINE LINE */}

                  <div className="absolute left-[9px] top-3 bottom-3 w-px bg-slate-200" />

                  <div className="space-y-7">
                    {[
                      ...order.statusHistory,
                    ]
                      .reverse()
                      .map(
                        (
                          history,
                          index
                        ) => {
                          const config =
                            getStatusConfig(
                              history.status
                            );

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
                                delay:
                                  0.3 +
                                  index *
                                    0.06,
                              }}
                              className="relative flex gap-4"
                            >
                              {/* DOT */}

                              <div
                                className={`relative z-10 w-[19px] h-[19px] rounded-full border-4 border-white ring-1 ring-slate-200 flex items-center justify-center ${config.className}`}
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                              </div>

                              {/* CONTENT */}

                              <div className="flex-1 -mt-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${config.className}`}
                                  >
                                    {config.icon}

                                    {history.status ||
                                      "N/A"}
                                  </span>

                                  <span className="text-[10px] text-slate-400">
                                    {history.updatedAt
                                      ? new Date(
                                          history.updatedAt
                                        ).toLocaleString(
                                          "en-IN"
                                        )
                                      : ""}
                                  </span>
                                </div>

                                <p className="text-xs text-slate-500 mt-2">
                                  {history.comment ||
                                    `Order status updated to ${
                                      history.status ||
                                      "N/A"
                                    }`}
                                </p>
                              </div>
                            </motion.div>
                          );
                        }
                      )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock3
                    size={28}
                    className="mx-auto text-slate-300 mb-2"
                  />

                  <p className="text-sm text-slate-400">
                    No status history
                    available.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* =================================================
            RIGHT COLUMN
        ================================================= */}

        <div className="space-y-6">

          {/* =================================================
              PRICE SUMMARY
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.1,
            }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden lg:sticky lg:top-6"
          >
            <div className="px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <IndianRupee size={19} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Price Summary
                  </h2>

                  <p className="text-[11px] text-slate-400 mt-1">
                    Complete order breakdown
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Items Price
                  </span>

                  <strong className="text-slate-800">
                    ₹
                    {Number(
                      order.itemsPrice ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Tax
                  </span>

                  <strong className="text-slate-800">
                    ₹
                    {Number(
                      order.taxPrice ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Shipping
                  </span>

                  <strong className="text-slate-800">
                    ₹
                    {Number(
                      order.shippingPrice ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>
              </div>

              <div className="my-5 border-t border-dashed border-slate-200" />

              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">
                  Total
                </span>

                <div className="flex items-center gap-1 text-orange-600">
                  <IndianRupee size={18} />

                  <strong className="text-2xl font-extrabold">
                    {Number(
                      order.totalPrice ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <ShieldCheck
                  size={16}
                  className="text-emerald-600"
                />

                <span className="text-[11px] font-semibold text-emerald-700">
                  Payment secured
                </span>
              </div>
            </div>
          </motion.div>

          {/* =================================================
              UPDATE STATUS
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.2,
            }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <RefreshCw size={18} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Update Status
                  </h2>

                  <p className="text-[11px] text-slate-400">
                    Manage order progress
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">

              {/* LOCKED */}

              {isLocked ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
                  <div className="w-11 h-11 mx-auto rounded-xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center mb-3">
                    <Lock size={18} />
                  </div>

                  <h3 className="text-sm font-bold text-slate-700">
                    Order Locked
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {order.orderStatus ===
                    "Delivered"
                      ? "This order has already been delivered and cannot be updated."
                      : "This order has been cancelled and cannot be updated."}
                  </p>
                </div>
              ) : (
                <>
                  {/* CURRENT STATUS */}

                  <div className="mb-4">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">
                      Current Status
                    </p>

                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${statusConfig.className}`}
                    >
                      {statusConfig.icon}

                      {order.orderStatus ||
                        "N/A"}
                    </div>
                  </div>

                  {/* BUTTONS */}

                  <div className="space-y-2">
                    {[
                      "Processing",
                      "Shipped",
                      "Delivered",
                    ].map((status) => {
                      const isCurrent =
                        order.orderStatus ===
                        status;

                      return (
                        <button
                          key={status}
                          type="button"
                          disabled={
                            updating ||
                            isCurrent
                          }
                          onClick={() =>
                            updateStatus(
                              status
                            )
                          }
                          className={`w-full py-3 rounded-xl text-sm font-bold transition-all border ${
                            isCurrent
                              ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                              : "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500 hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5"
                          } ${
                            updating
                              ? "opacity-60 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <span className="flex items-center justify-center gap-2">
                            {status ===
                              "Processing" && (
                              <Clock3
                                size={16}
                              />
                            )}

                            {status ===
                              "Shipped" && (
                              <Truck
                                size={16}
                              />
                            )}

                            {status ===
                              "Delivered" && (
                              <CheckCircle2
                                size={16}
                              />
                            )}

                            {isCurrent
                              ? `Current: ${status}`
                              : `Mark as ${status}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {updating && (
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mt-4">
                      <RefreshCw
                        size={14}
                        className="animate-spin"
                      />

                      Updating order...
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>

          {/* =================================================
              ORDER META
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.3,
            }}
            className="bg-slate-900 rounded-2xl p-6 text-white"
          >
            <div className="flex items-center gap-2 mb-5">
              <Package
                size={17}
                className="text-orange-400"
              />

              <h2 className="font-bold">
                Order Information
              </h2>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Order Created
              </p>

              <p className="font-semibold mt-1 text-sm">
                {order.createdAt
                  ? new Date(
                      order.createdAt
                    ).toLocaleString(
                      "en-IN"
                    )
                  : "N/A"}
              </p>
            </div>

            <div className="mt-5">
              <p className="text-xs text-slate-400">
                Payment ID
              </p>

              <p className="text-sm font-medium mt-1 break-all">
                {order.paymentInfo?.id ||
                  "N/A"}
              </p>
            </div>

            <div className="mt-5">
              <p className="text-xs text-slate-400">
                Payment Status
              </p>

              <p className="text-sm font-semibold mt-1">
                {order.paymentInfo
                  ?.status || "N/A"}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SellerOrderDetails;
