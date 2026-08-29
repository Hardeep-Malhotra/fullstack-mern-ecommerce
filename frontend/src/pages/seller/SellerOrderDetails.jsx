import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import axiosInstance from "../../api/axios";
// NOTE: adjust this import path if your project structure differs —
// it should point to the same shared axios instance (baseURL + withCredentials)
// that the rest of your app uses. Using plain `axios` here was the core bug:
// no baseURL meant the request never reached your API.

import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock3,
  XCircle,
  RefreshCw,
  AlertCircle,
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

  // =====================================================
  // FETCH SELLER ORDER DETAILS (shared by initial load,
  // manual refresh, and after a status update)
  // =====================================================

  // Reusable fetch — used by the refresh button and after a status update.
  // Deliberately NOT called directly from an effect (see below) — only
  // from click handlers, where calling setState is completely normal.
  const fetchOrderDetails = useCallback(
    async (isRefresh = false) => {
      if (!id) return;

      try {
        const { data } = await axiosInstance.get(`/seller/orders/${id}`);

        if (!data?.success || !data?.order) {
          throw new Error(data?.message || "Failed to fetch order details");
        }

        setOrder(data.order);

        if (isRefresh) {
          toast.success("Order details refreshed");
        }
      } catch (error) {
        console.error("SELLER ORDER DETAILS ERROR:", error);

        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch order details"
        );
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  // Initial load on mount / when `id` changes — kept fully inline inside the
  // effect (React's recommended data-fetching pattern) instead of calling
  // the shared `fetchOrderDetails` above. An effect calling an externally
  // defined function that sets state gets flagged by the set-state-in-effect
  // rule even when the state update happens after an `await`; defining the
  // async function inline, with its own `ignore` guard, is the pattern React
  // itself documents and it also protects against a race if `id` changes
  // again before the first request resolves.
 useEffect(() => {
  let ignore = false;

  const loadOrder = async () => {
    if (!id) return;

    try {
      const { data } = await axiosInstance.get(
        `/seller/orders/${id}`
      );

      if (ignore) return;

      if (!data?.success || !data?.order) {
        throw new Error(
          data?.message || "Failed to fetch order details"
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
      if (!ignore) setLoading(false);
    }
  };

  loadOrder();

  return () => {
    ignore = true;
  };
}, [id]);

  // =====================================================
  // MANUAL REFRESH
  // =====================================================

  const handleRefresh = () => {
    // Safe here — this runs from a button's onClick, not from an effect body.
    setLoading(true);
    fetchOrderDetails(true);
  };

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const updateStatus = async (status) => {
    if (!id || updating) return;

    try {
      setUpdating(true);

      const { data } = await axiosInstance.put(`/seller/orders/${id}`, {
        status,
      });

      if (!data?.success) {
        throw new Error(data?.message || "Failed to update order status");
      }

      if (data.order) {
        setOrder(data.order);
      } else {
        // Agar backend updated order return nahi karta to latest order dobara fetch kar lo.
        await fetchOrderDetails();
      }

      toast.success(`Order marked as ${status}`);
    } catch (error) {
      console.error("UPDATE STATUS ERROR:", error);

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
          className: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <Clock3 size={16} />,
        };
      case "Shipped":
        return {
          className: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Truck size={16} />,
        };
      case "Delivered":
        return {
          className: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <CheckCircle2 size={16} />,
        };
      case "Cancelled":
        return {
          className: "bg-rose-50 text-rose-700 border-rose-200",
          icon: <XCircle size={16} />,
        };
      default:
        return {
          className: "bg-slate-50 text-slate-700 border-slate-200",
          icon: <Package size={16} />,
        };
    }
  };

  // =====================================================
  // LOADING UI
  // =====================================================

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
            <div className="h-8 w-52 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-4 w-40 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="w-10 h-10 bg-slate-200 rounded-xl animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div className="h-24 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          <div className="h-24 bg-white rounded-2xl border border-slate-200 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-40 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            <div className="h-56 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            <div className="h-72 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="h-72 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            <div className="h-56 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // NO ORDER
  // =====================================================

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} className="text-slate-500" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Order Not Found</h2>
          <p className="text-sm text-slate-500 mt-1 mb-5">
            This order could not be found.
          </p>
          <button
            onClick={() => navigate("/seller/orders")}
            className="px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // DATA
  // =====================================================

  const statusConfig = getStatusConfig(order.orderStatus);

  // Backend should already send seller's items only.
  const sellerItems = order.orderItems || [];

  const itemsTotal = sellerItems.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <button
            onClick={() => navigate("/seller/orders")}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-orange-600 transition mb-3"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </button>

          <h1 className="text-2xl font-bold text-slate-900">Order Details</h1>

          <p className="text-sm text-slate-500 mt-1">
            Order #{order._id?.slice(-8)?.toUpperCase()}
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 transition"
          title="Refresh order details"
        >
          <RefreshCw
            size={18}
            className={loading ? "animate-spin text-slate-500" : "text-slate-600"}
          />
        </button>
      </div>

      {/* STATUS + PAYMENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Package size={21} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Order Status</p>
              <div
                className={`mt-1 inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${statusConfig.className}`}
              >
                {statusConfig.icon}
                {order.orderStatus || "N/A"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard size={21} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Payment Status</p>
              <p className="mt-1 text-sm font-bold text-emerald-600">
                {order.paymentInfo?.status || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* CUSTOMER */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-5">
              <User size={19} className="text-orange-500" />
              <h2 className="font-bold text-slate-900">Customer Information</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Name</p>
                <p className="font-semibold text-slate-900 mt-1">
                  {order.user?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="font-semibold text-slate-900 mt-1 break-all">
                  {order.user?.email || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* SHIPPING */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-5">
              <MapPin size={19} className="text-orange-500" />
              <h2 className="font-bold text-slate-900">Shipping Information</h2>
            </div>

            <div className="text-sm text-slate-600 space-y-2">
              <p>
                <span className="font-semibold text-slate-900">Address:</span>{" "}
                {order.shippingInfo?.address || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-slate-900">City:</span>{" "}
                {order.shippingInfo?.city || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-slate-900">State:</span>{" "}
                {order.shippingInfo?.state || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Country:</span>{" "}
                {order.shippingInfo?.country || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Pin Code:</span>{" "}
                {order.shippingInfo?.pinCode || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Phone:</span>{" "}
                {order.shippingInfo?.phoneNo || "N/A"}
              </p>
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package size={19} className="text-orange-500" />
                  <h2 className="font-bold text-slate-900">Ordered Products</h2>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {sellerItems.length} {sellerItems.length === 1 ? "Item" : "Items"}
                </span>
              </div>
            </div>

            {sellerItems.length === 0 ? (
              <div className="p-8 text-center">
                <Package size={30} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm text-slate-500">No products found in this order.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {sellerItems.map((item, index) => (
                  <div key={item.product?._id || item.product || index} className="p-5 flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name || "Product"}
                      className="w-20 h-20 rounded-xl object-cover border border-slate-200 bg-slate-50"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 line-clamp-2">
                        {item.name || "Product"}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Quantity: {item.quantity || 0}
                      </p>
                      <p className="text-sm font-bold text-orange-600 mt-2">
                        ₹{Number(item.price || 0).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs text-slate-500">Subtotal</p>
                      <p className="font-bold text-slate-900 mt-1">
                        ₹{(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {sellerItems.length > 0 && (
              <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600">Your Products Total</span>
                <span className="text-lg font-bold text-orange-600">
                  ₹{itemsTotal.toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* ORDER SUMMARY */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-bold text-slate-900 mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Items Price</span>
                <span className="font-medium">
                  ₹{Number(order.itemsPrice || 0).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Tax</span>
                <span className="font-medium">
                  ₹{Number(order.taxPrice || 0).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Shipping</span>
                <span className="font-medium">
                  ₹{Number(order.shippingPrice || 0).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between gap-4">
                <span className="font-bold text-slate-900">Total</span>
                <span className="font-bold text-lg text-orange-600">
                  ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* UPDATE STATUS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-bold text-slate-900 mb-4">Update Order Status</h2>

            <div className="space-y-2">
              {["Processing", "Shipped", "Delivered"].map((status) => {
                const isCurrent = order.orderStatus === status;
                const isCancelled = order.orderStatus === "Cancelled";

                return (
                  <button
                    key={status}
                    disabled={updating || isCurrent || isCancelled}
                    onClick={() => updateStatus(status)}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition border ${
                      isCurrent
                        ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                        : "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
                    } ${updating ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>

            {order.orderStatus === "Cancelled" && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-100">
                <p className="text-xs font-semibold text-rose-700">
                  This order has been cancelled.
                </p>
                {order.cancelReason && (
                  <p className="text-xs text-rose-600 mt-1">Reason: {order.cancelReason}</p>
                )}
              </div>
            )}

            {updating && (
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mt-4">
                <RefreshCw size={14} className="animate-spin" />
                Updating order...
              </div>
            )}
          </div>

          {/* ORDER META */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white">
            <p className="text-xs text-slate-400">Order Created</p>
            <p className="font-semibold mt-1">
              {order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN") : "N/A"}
            </p>

            <p className="text-xs text-slate-400 mt-4">Payment ID</p>
            <p className="text-sm font-medium mt-1 break-all">
              {order.paymentInfo?.id || "N/A"}
            </p>

            <p className="text-xs text-slate-400 mt-4">Payment Status</p>
            <p className="text-sm font-semibold mt-1">{order.paymentInfo?.status || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerOrderDetails;