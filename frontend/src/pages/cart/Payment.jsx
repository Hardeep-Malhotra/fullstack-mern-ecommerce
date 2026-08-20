import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Amount ConfirmOrder se aa raha hai
  const amount = location.state?.amount;

  // ==========================================================
  // AUTH CHECK
  // ==========================================================

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: "/process/payment" },
        replace: true,
      });
    }
  }, [isAuthenticated, navigate]);

  // ==========================================================
  // EMPTY CART CHECK
  // ==========================================================

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-5">🛒</div>

          <h2 className="text-2xl font-bold text-slate-900">
            Your cart is empty
          </h2>

          <p className="text-slate-500 mt-2">
            Add some products before making a payment.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="mt-6 px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // ==========================================================
  // PAYMENT METHOD
  // ==========================================================

  const handlePayment = () => {
    // Razorpay baad mein yahan integrate hoga
    console.log("Payment amount:", amount);

    alert("Razorpay payment integration will be added here.");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Secure Payment
          </h1>

          <p className="text-slate-500 mt-2">
            Complete your payment securely to place your order.
          </p>
        </div>

        {/* ======================================================
            CHECKOUT STEPS
        ====================================================== */}

        <div className="flex justify-center mb-10 overflow-x-auto">
          <div className="flex items-center min-w-max">

            {/* Cart */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                ✓
              </div>

              <span className="text-xs mt-2 text-slate-600">
                Cart
              </span>
            </div>

            <div className="w-10 sm:w-20 h-[2px] bg-orange-500" />

            {/* Shipping */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                ✓
              </div>

              <span className="text-xs mt-2 text-slate-600">
                Shipping
              </span>
            </div>

            <div className="w-10 sm:w-20 h-[2px] bg-orange-500" />

            {/* Confirm */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                ✓
              </div>

              <span className="text-xs mt-2 text-slate-600">
                Confirm
              </span>
            </div>

            <div className="w-10 sm:w-20 h-[2px] bg-orange-500" />

            {/* Payment */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold shadow-lg shadow-orange-200">
                4
              </div>

              <span className="text-xs mt-2 font-semibold text-orange-500">
                Payment
              </span>
            </div>

          </div>
        </div>

        {/* ======================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ====================================================
              LEFT
          ==================================================== */}

          <div className="lg:col-span-2 space-y-6">

            {/* Payment Method */}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center text-xl">
                  💳
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Payment Method
                  </h2>

                  <p className="text-sm text-slate-500">
                    Choose your preferred payment method.
                  </p>
                </div>

              </div>

              {/* Razorpay Card */}

              <div className="border-2 border-orange-400 bg-orange-50/40 rounded-2xl p-5">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl">
                      💳
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        Razorpay
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        UPI, Cards, Net Banking & Wallets
                      </p>
                    </div>

                  </div>

                  <div className="w-5 h-5 rounded-full border-4 border-orange-500" />

                </div>

              </div>

              {/* Secure Info */}

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">

                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <div className="text-xl">🔒</div>
                  <p className="text-xs font-semibold text-slate-700 mt-2">
                    Secure Payment
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <div className="text-xl">🛡️</div>
                  <p className="text-xs font-semibold text-slate-700 mt-2">
                    Protected
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <div className="text-xl">⚡</div>
                  <p className="text-xs font-semibold text-slate-700 mt-2">
                    Fast Checkout
                  </p>
                </div>

              </div>

            </div>

            {/* Shipping Summary */}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

              <div className="flex justify-between items-center mb-5">

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    📦 Delivery Address
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Your order will be delivered here.
                  </p>
                </div>

                <button
                  onClick={() => navigate("/shipping")}
                  className="text-sm font-semibold text-orange-500 hover:text-orange-600"
                >
                  Edit
                </button>

              </div>

              <div className="bg-slate-50 rounded-xl p-5">

                <p className="font-bold text-slate-900">
                  {shippingInfo?.name}
                </p>

                <p className="text-sm text-slate-600 mt-2">
                  {shippingInfo?.address}
                </p>

                <p className="text-sm text-slate-600">
                  {shippingInfo?.city}, {shippingInfo?.state} -{" "}
                  {shippingInfo?.pinCode}
                </p>

                <p className="text-sm text-slate-600 mt-2">
                  📞 {shippingInfo?.phoneNo || shippingInfo?.phone}
                </p>

              </div>

            </div>

          </div>

          {/* ====================================================
              RIGHT - SUMMARY
          ==================================================== */}

          <div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-24">

              <h2 className="text-xl font-bold text-slate-900">
                Order Summary
              </h2>

              {/* Products */}

              <div className="mt-5 space-y-4">

                {cartItems.map((item) => (

                  <div
                    key={item.product}
                    className="flex items-center gap-3"
                  >

                    <div className="w-14 h-14 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0">

                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />

                    </div>

                    <div className="flex-1 min-w-0">

                      <p className="text-sm font-semibold text-slate-800 line-clamp-1">
                        {item.name}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        Qty: {item.quantity}
                      </p>

                    </div>

                    <p className="text-sm font-bold text-slate-900">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>

                  </div>

                ))}

              </div>

              {/* Divider */}

              <div className="border-t border-slate-200 my-5" />

              {/* Amount */}

              <div className="flex justify-between items-center">

                <span className="text-slate-600 font-medium">
                  Amount Payable
                </span>

                <span className="text-2xl font-extrabold text-orange-500">
                  ₹
                  {Number(amount || 0).toLocaleString("en-IN")}
                </span>

              </div>

              {/* Payment Button */}

              <button
                onClick={handlePayment}
                className="mt-6 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-200 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
              >
                Pay ₹{Number(amount || 0).toLocaleString("en-IN")} →
              </button>

              {/* Security */}

              <div className="mt-5 text-center">

                <p className="text-xs text-slate-400">
                  🔒 100% Secure Checkout
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Payment details are securely processed.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Payment;