import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  AlertCircle,
  X,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

import axiosInstance from "../../api/axios";

import Loader from "../../components/common/Loader";
import OrderStatus from "../../components/order/OrderStatus";
import OrderTimeline from "../../components/order/OrderTimeline";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    let isMounted = true;

    const getOrderData = async () => {
      try {
        const { data } = await axiosInstance.get(`/order/${id}`);

        if (isMounted && data.success) {
          setOrder(data.order);
        }
      } catch (error) {
        if (isMounted) {
          console.error("FETCH ORDER DETAILS ERROR:", error);
          toast.error(error?.response?.data?.message || "Failed to load order details");
          navigate("/orders");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getOrderData();

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  const handleOpenCancelModal = () => {
    setCancelReason("");
    setShowCancelModal(true);
  };

  const handleCloseCancelModal = () => {
    if (cancelLoading) return;
    setShowCancelModal(false);
    setCancelReason("");
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please select a cancellation reason");
      return;
    }

    try {
      setCancelLoading(true);
      const { data } = await axiosInstance.put(`/order/cancel/${id}`, {
        reason: cancelReason,
      });

      if (data.success) {
        setOrder(data.order);
        setShowCancelModal(false);
        setCancelReason("");
        toast.success("Order cancelled successfully");
      }
    } catch (error) {
      console.error("CANCEL ORDER ERROR:", error);
      toast.error(error?.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50/50">
        <Loader />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-orange-50/40 via-gray-50 to-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-sm"
        >
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3 stroke-[1.5]" />
          <h2 className="text-xl font-bold text-gray-900">Order Not Found</h2>
          <p className="text-sm text-gray-500 mt-1 mb-6">
            We couldn't retrieve the details for this order.
          </p>
          <button
            onClick={() => navigate("/orders")}
            className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all duration-200"
          >
            Back to Orders
          </button>
        </motion.div>
      </div>
    );
  }

  const canCancel =
    order.orderStatus !== "Delivered" &&
    order.orderStatus !== "Shipped" &&
    order.orderStatus !== "Cancelled";

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 via-gray-50 to-gray-100/60 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-5xl mx-auto"
      >
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <button
              onClick={() => navigate("/orders")}
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-orange-600 transition-colors mb-3 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to My Orders
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Order Details
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center gap-1.5">
              <span>Order ID:</span>
              <span className="font-mono font-medium text-gray-800 bg-gray-200/60 px-2 py-0.5 rounded text-xs">
                #{order._id}
              </span>
            </p>
          </div>

          <div className="self-start sm:self-auto">
            <OrderStatus status={order.orderStatus} />
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            {/* ORDERED ITEMS */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md hover:border-orange-100">
              <div className="flex items-center gap-2 mb-5">
                <Package className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-bold text-gray-900">Ordered Items</h2>
              </div>

              <div className="divide-y divide-gray-100">
                {order.orderItems?.map((item, index) => (
                  <motion.div
                    key={`${item.product}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex flex-row gap-4 py-4 first:pt-0 last:pb-0 items-center"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-gray-100 shadow-sm flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Quantity: <span className="font-medium text-gray-700">{item.quantity}</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Unit Price: ₹{item.price?.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-gray-900 text-base sm:text-lg">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* SHIPPING INFO */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md hover:border-orange-100">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-bold text-gray-900">Shipping Details</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-orange-50/40 p-4 rounded-xl border border-orange-100/60">
                <div>
                  <p className="text-xs text-gray-400 font-medium">Street Address</p>
                  <p className="font-semibold text-gray-800 mt-0.5">
                    {order.shippingInfo?.address}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">City & State</p>
                  <p className="font-semibold text-gray-800 mt-0.5">
                    {order.shippingInfo?.city}, {order.shippingInfo?.state}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Pincode & Country</p>
                  <p className="font-semibold text-gray-800 mt-0.5">
                    {order.shippingInfo?.pinCode}, {order.shippingInfo?.country}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Contact Phone</p>
                  <p className="font-semibold text-gray-800 mt-0.5">
                    {order.shippingInfo?.phoneNo}
                  </p>
                </div>
              </div>
            </div>

            {/* TIMELINE */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md hover:border-orange-100">
              <div className="flex items-center gap-2 mb-5">
                <Clock className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-bold text-gray-900">Order Progress</h2>
              </div>
              <OrderTimeline statusHistory={order.statusHistory || []} />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            {/* PRICE SUMMARY */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md hover:border-orange-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                Price Breakup
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Items Total</span>
                  <span className="font-medium text-gray-900">
                    ₹{order.itemsPrice?.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST / Tax</span>
                  <span className="font-medium text-gray-900">
                    ₹{order.taxPrice?.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span className="font-medium text-gray-900">
                    {order.shippingPrice === 0 ? (
                      <span className="text-emerald-600 font-semibold">FREE</span>
                    ) : (
                      `₹${order.shippingPrice?.toLocaleString("en-IN")}`
                    )}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-base">Grand Total</span>
                  <span className="font-extrabold text-orange-600 text-xl">
                    ₹{order.totalPrice?.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* PAYMENT INFORMATION */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md hover:border-orange-100">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <CreditCard className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-bold text-gray-900">Payment Status</h2>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {order.paymentInfo?.status || "PAID"}
                  </span>
                </div>

                {order.paymentInfo?.id && (
                  <div>
                    <p className="text-xs text-gray-400">Transaction ID</p>
                    <p className="font-mono text-xs font-semibold text-gray-700 mt-0.5 break-all">
                      {order.paymentInfo?.id}
                    </p>
                  </div>
                )}

                {order.paidAt && (
                  <div>
                    <p className="text-xs text-gray-400">Transaction Date</p>
                    <p className="font-medium text-gray-700 text-xs mt-0.5">
                      {new Date(order.paidAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ACTION / STATUS MESSAGES */}
            {canCancel && (
              <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-5 bg-gradient-to-b from-white to-red-50/20">
                <div className="flex items-center gap-2 text-red-600 mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <h3 className="font-bold text-sm">Need to cancel?</h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  You can request immediate cancellation before order gets shipped.
                </p>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOpenCancelModal}
                  disabled={cancelLoading}
                  className="w-full mt-4 py-2.5 rounded-xl border border-red-200 bg-white text-red-600 font-bold text-sm hover:bg-red-600 hover:text-white transition-all shadow-xs"
                >
                  Cancel Order
                </motion.button>
              </div>
            )}

            {order.orderStatus === "Shipped" && (
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-amber-800 mb-1">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <h3 className="font-bold text-sm">Cancellation Unavailable</h3>
                </div>
                <p className="text-xs text-amber-700 leading-relaxed">
                  This order has already been handed over to our courier partner and is on its way.
                  Direct cancellation is no longer available.
                </p>
                <p className="text-xs font-medium text-amber-900 mt-2">
                  Need help? You can reject the delivery at your doorstep or initiate a return after
                  receiving the package.
                </p>
              </div>
            )}

            {order.orderStatus === "Delivered" && (
              <div className="bg-orange-50/80 border border-orange-200/80 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-orange-700 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-orange-600" />
                  <h3 className="font-bold text-sm">Order Delivered</h3>
                </div>
                <p className="text-xs text-orange-700 leading-relaxed">
                  This item has been successfully delivered. If you faced any issues with the order,
                  you can request a return or replacement via support.
                </p>
              </div>
            )}

            {order.orderStatus === "Cancelled" && (
              <div className="bg-red-50/80 border border-red-200 rounded-2xl p-5 text-center">
                <ShieldCheck className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <h3 className="font-bold text-red-800 text-sm">Order Cancelled</h3>
                <p className="text-xs text-red-600 mt-1">
                  This order was cancelled. Refund (if applicable) will be processed automatically.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* CANCEL MODAL */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseCancelModal}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 z-10 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Cancel Order</h2>
                <button
                  onClick={handleCloseCancelModal}
                  disabled={cancelLoading}
                  className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Please let us know why you are cancelling this order:
              </p>

              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-1">
                {[
                  "I ordered by mistake",
                  "I found a better price elsewhere",
                  "Need to change shipping address",
                  "Want to change ordered item/color",
                  "Delivery estimate time is too long",
                  "Other reason",
                ].map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-sm cursor-pointer transition-all ${
                      cancelReason === reason
                        ? "border-red-500 bg-red-50/50 text-red-900 font-medium"
                        : "border-gray-100 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      checked={cancelReason === reason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <span className="text-xs sm:text-sm">{reason}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCloseCancelModal}
                  disabled={cancelLoading}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Keep Order
                </button>

                <button
                  onClick={handleCancelOrder}
                  disabled={!cancelReason || cancelLoading}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 disabled:opacity-50 transition-all shadow-sm"
                >
                  {cancelLoading ? "Processing..." : "Confirm Cancellation"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderDetails;