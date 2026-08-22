import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import API from "../../api/axios";
import { clearCart } from "../../redux/slices/cartSlice";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [showTestInfo, setShowTestInfo] = useState(false);

  // 🔒 Prevent duplicate payment/order processing
  const isProcessingRef = useRef(false);

  const amount = Number(location.state?.amount || 0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: "/process/payment" },
        replace: true,
      });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  if (!amount || amount <= 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-orange-50/40 via-white to-slate-50">
        <div className="text-center animate-[fadeUp_0.4s_ease-out]">
          <div className="text-5xl mb-4 animate-[float_3s_ease-in-out_infinite]">
            💳
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Invalid Payment Amount
          </h2>
          <button
            onClick={() => navigate("/order/confirm")}
            className="mt-5 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            Back to Order
          </button>
        </div>
        <style>{`
          @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        `}</style>
      </div>
    );
  }

  // ==========================================================
  // ACTUAL RAZORPAY ORDER CREATION (runs after Test Info modal confirm)
  // ==========================================================
  const createPaymentOrder = async () => {
    // 🔒 Already processing → stop duplicate request
    if (isProcessingRef.current) {
      console.log("Duplicate payment attempt blocked");
      return;
    }

    try {
      setLoading(true);

      // Lock immediately
      isProcessingRef.current = true;

      // ======================================================
      // 1. CREATE RAZORPAY TEST ORDER
      // ======================================================
      const { data } = await API.post("/payment/create-order", { amount });

      if (!data.success) {
        throw new Error("Unable to create payment order");
      }

      // ======================================================
      // 2. RAZORPAY CHECKOUT OPTIONS
      // ======================================================
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Shopzy",
        description: "Shopzy Order Payment",
        order_id: data.order.id,

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: shippingInfo?.phoneNo || shippingInfo?.phone || "",
        },

        notes: { address: shippingInfo?.address || "" },
        theme: { color: "#f97316" },

        // ====================================================
        // 3. PAYMENT SUCCESS HANDLER
        // ====================================================
        handler: async function (response) {
          // 🔒 Extra protection against duplicate handler execution
          if (isProcessingRef.current === "completed") {
            console.log("Duplicate Razorpay handler blocked");
            return;
          }

          try {
            setLoading(true);
            console.log("Razorpay payment success:", response);

            // ================================================
            // 4. VERIFY PAYMENT SIGNATURE
            // ================================================
            const verifyResponse = await API.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!verifyResponse.data.success) {
              throw new Error("Payment verification failed");
            }

            console.log("Payment verified successfully");

            // ================================================
            // 5. CREATE DATABASE ORDER
            // ================================================
            const orderData = {
              shippingInfo: {
                address: shippingInfo.address,
                city: shippingInfo.city,
                state: shippingInfo.state,
                country: shippingInfo.country || "India",
                pinCode: shippingInfo.pinCode || shippingInfo.postalCode,
                phoneNo: shippingInfo.phoneNo || shippingInfo.phone,
              },
              orderItems: cartItems.map((item) => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                product: item.product || item._id,
              })),
              paymentInfo: {
                id: response.razorpay_payment_id,
                status: "PAID",
              },
              itemsPrice: amount,
              taxPrice: 0,
              shippingPrice: 0,
              totalPrice: amount,
            };

            console.log("Creating database order...");

            const { data: orderRes } = await API.post("/order/new", orderData);

            // ================================================
            // 6. ORDER SUCCESS
            // ================================================
            if (orderRes.success) {
              console.log("Order created successfully:", orderRes.order);

              // 🔒 Mark completely processed
              isProcessingRef.current = "completed";

              // 🛒 Clear Redux + LocalStorage cart
              dispatch(clearCart());

              toast.success("Order placed successfully! 🎉");

              // Redirect to My Orders
              navigate("/orders", { replace: true });
            }
          } catch (error) {
            console.error("ORDER ERROR:", error);
            toast.error(
              error.response?.data?.message ||
                "Payment ho gayi par order save nahi hua",
            );

            // Error hua to retry allow
            isProcessingRef.current = false;
          } finally {
            setLoading(false);
          }
        },

        // ====================================================
        // PAYMENT MODAL CLOSED BY USER
        // ====================================================
        modal: {
          ondismiss: function () {
            console.log("Razorpay payment modal closed");
            setLoading(false);

            // User cancelled payment -> release lock for retry
            isProcessingRef.current = false;
            toast.error("Payment cancelled");
          },
        },
      };

      // ======================================================
      // 7. CHECK RAZORPAY SDK
      // ======================================================
      if (!window.Razorpay) {
        toast.error("Razorpay SDK failed to load. Please refresh.");
        isProcessingRef.current = false;
        setLoading(false);
        return;
      }

      // ======================================================
      // 8. OPEN RAZORPAY MODAL
      // ======================================================
      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.log("Payment failed:", response.error);
        toast.error(response.error?.description || "Payment failed");

        // Failed payment -> user can retry
        isProcessingRef.current = false;
        setLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error("CREATE PAYMENT ERROR:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to start payment",
      );

      // Allow retry on failure
      isProcessingRef.current = false;
      setLoading(false);
    }
  };

  const proceedToPay = () => {
    if (isProcessingRef.current) return;
    setShowTestInfo(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/40 via-slate-50 to-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-[fadeUp_0.4s_ease-out]">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-3xl mb-4 shadow-lg shadow-orange-200 animate-[pulse_2.5s_ease-in-out_infinite]">
            💳
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Secure Payment
          </h1>
          <p className="text-slate-500 mt-2">
            Complete your payment securely with Razorpay
          </p>
        </div>

        {/* Steps */}
        <div className="flex justify-center items-center mb-10 animate-[fadeUp_0.4s_ease-out_0.05s_backwards]">
          <div className="flex items-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold animate-[popIn_0.4s_ease-out]">
                ✓
              </div>
              <span className="text-xs mt-2 text-slate-600">Cart</span>
            </div>
            <div className="w-12 md:w-24 h-[2px] bg-emerald-500" />
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold animate-[popIn_0.4s_ease-out_0.1s_backwards]">
                ✓
              </div>
              <span className="text-xs mt-2 text-slate-600">Shipping</span>
            </div>
            <div className="w-12 md:w-24 h-[2px] bg-emerald-500" />
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold animate-[popIn_0.4s_ease-out_0.2s_backwards]">
                ✓
              </div>
              <span className="text-xs mt-2 text-slate-600">Confirm</span>
            </div>
            <div className="w-12 md:w-24 h-[2px] bg-orange-500" />
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center font-bold shadow-md shadow-orange-200 animate-[pulse_2s_ease-in-out_infinite]">
                4
              </div>
              <span className="text-xs mt-2 font-semibold text-orange-500">
                Payment
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 hover:shadow-md transition-shadow duration-300 animate-[fadeUp_0.4s_ease-out_0.1s_backwards]">
              <h2 className="text-2xl font-bold text-slate-900">
                Choose Payment Method
              </h2>
              <p className="text-slate-500 mt-1">
                Your payment is processed securely by Razorpay.
              </p>

              <div className="mt-8 border-2 border-orange-300 bg-orange-50/50 rounded-2xl p-6 shadow-sm shadow-orange-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl">
                    💳
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      Razorpay
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                        Recommended
                      </span>
                    </h3>
                    <p className="text-sm text-slate-500">
                      UPI • Cards • Net Banking • Wallets
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3 text-sm text-slate-600">
                  <span>🔒</span>
                  <span>Secure encrypted payment</span>
                </div>
              </div>

              <button
                onClick={proceedToPay}
                disabled={loading}
                className="mt-8 w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {loading && (
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}
                {loading
                  ? "Processing..."
                  : `Pay ₹${amount.toLocaleString("en-IN")}`}
              </button>

              <p className="text-center text-xs text-slate-400 mt-4">
                🧪 Test Mode • No real money will be charged
              </p>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-24 animate-[fadeUp_0.4s_ease-out_0.15s_backwards]">
              <h2 className="text-xl font-bold text-slate-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Items</span>
                  <span className="font-semibold">{cartItems.length}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Shipping</span>
                  <span className="text-green-600 font-semibold">Included</span>
                </div>

                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="text-2xl font-extrabold text-orange-500">
                    ₹{amount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="mt-6 bg-slate-50 rounded-xl p-4 flex items-start gap-2">
                <span className="text-emerald-500">🔐</span>
                <p className="text-xs text-slate-500">
                  Your payment details are securely processed by Razorpay.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TEST PAYMENT INFO MODAL */}
      {showTestInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 animate-[scaleIn_0.25s_ease-out]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  🔐 Test Payment
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Razorpay Test Mode
                </p>
              </div>
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700 animate-[pulse_2s_ease-in-out_infinite]">
                TEST
              </span>
            </div>

            <div className="mt-5 p-4 rounded-2xl bg-orange-50 border border-orange-100">
              <p className="text-sm font-semibold text-slate-700">
                🧪 Test Card
              </p>

              <div className="mt-2 flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3">
                <span className="font-mono font-bold tracking-wide text-slate-800">
                  4100 2800 0000 1007
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("41002800001007");
                    toast.success("Card number copied!");
                  }}
                  className="text-orange-500 hover:text-orange-600 font-semibold text-sm transition-colors duration-200"
                >
                  Copy
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                <div className="bg-white border border-slate-100 rounded-xl p-3">
                  <p className="text-slate-400">Expiry</p>
                  <p className="font-semibold text-slate-800">
                    Any future date
                  </p>
                </div>
                <div className="bg-white border border-slate-100 rounded-xl p-3">
                  <p className="text-slate-400">CVV</p>
                  <p className="font-semibold text-slate-800">Any 3 digits</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-4 text-center">
              No real money will be charged. This is a simulated test payment.
            </p>

            <button
              onClick={() => {
                setShowTestInfo(false);
                createPaymentOrder();
              }}
              className="mt-5 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Continue to Razorpay →
            </button>

            <button
              onClick={() => setShowTestInfo(false)}
              className="mt-2 w-full py-3 text-slate-500 hover:text-slate-700 font-semibold transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.6); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Payment;
