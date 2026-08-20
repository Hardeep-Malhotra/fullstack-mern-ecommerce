import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const ConfirmOrder = () => {
  const navigate = useNavigate();

  const { cartItems = [], shippingInfo = {} } = useSelector(
    (state) => state.cart || {},
  );

  const { isAuthenticated } = useSelector((state) => state.auth || {});

  // ==========================================================
  // AUTH CHECK
  // ==========================================================

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: "/order/confirm" },
        replace: true,
      });
    }
  }, [isAuthenticated, navigate]);

  // ==========================================================
  // EMPTY CART
  // ==========================================================

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[75vh] bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center animate-[fadeUp_.5s_ease-out]">
          <div className="mx-auto w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center text-5xl shadow-inner">
            🛒
          </div>

          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
            Your cart is empty
          </h2>

          <p className="mt-2 text-slate-500">
            Add some products before confirming your order.
          </p>

          <Link
            to="/products"
            className="inline-flex mt-7 px-7 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-lg shadow-orange-200 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          >
            Continue Shopping →
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================================
  // SHIPPING CHECK
  // ==========================================================

  if (!shippingInfo?.address) {
    return (
      <div className="min-h-[75vh] bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md animate-[fadeUp_.5s_ease-out]">
          <div className="mx-auto w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center text-5xl">
            📦
          </div>

          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
            Shipping information required
          </h2>

          <p className="mt-2 text-slate-500">
            Please add your delivery address before confirming your order.
          </p>

          <Link
            to="/shipping"
            className="inline-flex mt-7 px-7 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-200 hover:-translate-y-1 transition-all duration-300"
          >
            Add Shipping Address →
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================================
  // PRICE CALCULATION
  // ==========================================================

  const itemsPrice = cartItems.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0,
  );

  const shippingPrice = itemsPrice >= 1000 ? 0 : 100;

  const taxPrice = Number((itemsPrice * 0.18).toFixed(2));

  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // ==========================================================
  // PROCEED TO PAYMENT
  // ==========================================================

  const proceedToPayment = () => {
    if (!shippingInfo?.address) {
      toast.error("Please add shipping information first.");
      navigate("/shipping");
      return;
    }

    navigate("/process/payment", {
      state: {
        amount: totalPrice,
      },
    });
  };

  // ==========================================================
  // FORMAT PRICE
  // ==========================================================

  const formatPrice = (price) => Number(price).toLocaleString("en-IN");

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/40 py-8 md:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-8 animate-[fadeUp_.45s_ease-out]">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
            <Link to="/cart" className="hover:text-orange-500 transition">
              Cart
            </Link>

            <span>›</span>

            <Link to="/shipping" className="hover:text-orange-500 transition">
              Shipping
            </Link>

            <span>›</span>

            <span className="text-orange-500 font-semibold">Confirm Order</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-slate-900">
            Confirm Your Order
          </h1>

          <p className="text-slate-500 mt-2">
            Review everything carefully before proceeding to payment.
          </p>
        </div>

        {/* ======================================================
            CHECKOUT PROGRESS
        ====================================================== */}

         {/* CHECKOUT STEPS */}
        <div className="flex items-center justify-center mb-10 animate-[fadeUp_0.4s_ease-out_0.05s_backwards]">
          <div className="flex items-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold animate-[popIn_0.4s_ease-out]">
                ✓
              </div>
              <span className="text-xs mt-2 font-medium text-slate-600">Cart</span>
            </div>

            <div className="w-12 md:w-24 h-[2px] bg-emerald-500" />

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold animate-[popIn_0.4s_ease-out_0.1s_backwards]">
                ✓
              </div>
              <span className="text-xs mt-2 font-medium text-slate-600">Shipping</span>
            </div>

            <div className="w-12 md:w-24 h-[2px] bg-orange-500" />

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center font-bold shadow-md shadow-orange-200 animate-[pulse_2s_ease-in-out_infinite]">
                3
              </div>
              <span className="text-xs mt-2 font-semibold text-orange-500">Confirm</span>
            </div>

            <div className="w-12 md:w-24 h-[2px] bg-slate-300" />

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold">
                4
              </div>
              <span className="text-xs mt-2 font-medium text-slate-500">Payment</span>
            </div>
          </div>
        </div>


        {/* ======================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          {/* ====================================================
              LEFT
          ==================================================== */}

          <div className="lg:col-span-2 space-y-6">
            {/* ==================================================
                SHIPPING CARD
            ================================================== */}

            <section className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden animate-[fadeUp_.6s_ease-out]">
              <div className="h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />

              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex gap-4">
                    <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
                      📦
                    </div>

                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900">
                        Shipping Information
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        Your order will be delivered here.
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/shipping"
                    className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 text-sm font-bold hover:bg-orange-100 transition"
                  >
                    Edit
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoItem label="Name" value={shippingInfo.name} />

                  <InfoItem
                    label="Phone"
                    value={shippingInfo.phoneNo || shippingInfo.phone}
                  />

                  <InfoItem label="Address" value={shippingInfo.address} full />

                  <InfoItem label="City" value={shippingInfo.city} />

                  <InfoItem label="State" value={shippingInfo.state} />

                  <InfoItem label="PIN Code" value={shippingInfo.pinCode} />
                </div>
              </div>
            </section>

            {/* ==================================================
                DELIVERY CARD
            ================================================== */}

            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-lg transition-all duration-300 animate-[fadeUp_.7s_ease-out]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">
                  🚚
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-extrabold text-slate-900">
                      Standard Delivery
                    </h2>

                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase">
                      Available
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 mt-1">
                    Estimated delivery in 3–5 business days
                  </p>
                </div>

                <div className="hidden sm:block text-right">
                  <p className="text-xs text-slate-400">Shipping</p>

                  <p className="font-bold text-green-600">
                    {shippingPrice === 0 ? "FREE" : `₹${shippingPrice}`}
                  </p>
                </div>
              </div>
            </section>

            {/* ==================================================
                ORDER ITEMS
            ================================================== */}

            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-lg transition-all duration-300 animate-[fadeUp_.8s_ease-out]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    🛍️ Order Items
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    {cartItems.length} product
                    {cartItems.length !== 1 ? "s" : ""} in your order
                  </p>
                </div>

                <Link
                  to="/cart"
                  className="text-sm font-bold text-orange-500 hover:text-orange-600 transition"
                >
                  Edit Cart
                </Link>
              </div>

              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={item.product}
                    className="group flex gap-4 p-4 rounded-2xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 hover:shadow-sm transition-all duration-300"
                    style={{
                      animation: `fadeUp .4s ease-out ${index * 0.08}s both`,
                    }}
                  >
                    {/* IMAGE */}

                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-50 overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* DETAILS */}

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 line-clamp-2 group-hover:text-orange-600 transition">
                        {item.name}
                      </h3>

                      <p className="text-sm text-slate-500 mt-2">
                        ₹{formatPrice(item.price)} × {item.quantity}
                      </p>

                      <span className="inline-flex mt-2 px-2 py-1 rounded-md bg-slate-100 text-xs font-semibold text-slate-600">
                        Qty: {item.quantity}
                      </span>
                    </div>

                    {/* TOTAL */}

                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-extrabold text-slate-900">
                        ₹{formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ====================================================
              RIGHT - SUMMARY
          ==================================================== */}

          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <div className="relative bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-[slideIn_.7s_ease-out]">
                {/* TOP ACCENT */}

                <div className="h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />

                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center text-xl">
                      🧾
                    </div>

                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900">
                        Order Summary
                      </h2>

                      <p className="text-xs text-slate-400">Final amount</p>
                    </div>
                  </div>

                  {/* PRICE DETAILS */}

                  <div className="mt-7 space-y-4">
                    <PriceRow
                      label={`Subtotal (${cartItems.length} item${
                        cartItems.length !== 1 ? "s" : ""
                      })`}
                      value={`₹${formatPrice(itemsPrice)}`}
                    />

                    <PriceRow
                      label="Shipping"
                      value={shippingPrice === 0 ? "FREE" : `₹${shippingPrice}`}
                      valueClass={shippingPrice === 0 ? "text-green-600" : ""}
                    />

                    <PriceRow
                      label="GST (18%)"
                      value={`₹${formatPrice(taxPrice)}`}
                    />
                  </div>

                  {/* FREE SHIPPING MESSAGE */}

                  {shippingPrice === 0 && (
                    <div className="mt-5 rounded-xl bg-green-50 border border-green-100 p-3 flex gap-2 items-center animate-pulse">
                      <span>🎉</span>

                      <p className="text-xs font-semibold text-green-700">
                        Congratulations! You unlocked free shipping.
                      </p>
                    </div>
                  )}

                  {/* TOTAL */}

                  <div className="border-t border-slate-200 mt-6 pt-5">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm text-slate-500">Total Amount</p>

                        <p className="text-xs text-slate-400 mt-1">
                          Inclusive of GST
                        </p>
                      </div>

                      <p className="text-2xl md:text-3xl font-black text-orange-500">
                        ₹{formatPrice(totalPrice)}
                      </p>
                    </div>
                  </div>

                  {/* PAYMENT BUTTON */}

                  <button
                    onClick={proceedToPayment}
                    className="relative overflow-hidden mt-7 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-xl font-extrabold shadow-lg shadow-orange-200 hover:shadow-2xl hover:shadow-orange-200 hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Proceed to Payment
                      <span className="text-lg">→</span>
                    </span>

                    <span className="absolute inset-0 bg-white/10 -translate-x-full hover:translate-x-full transition-transform duration-700" />
                  </button>

                  {/* SECURITY */}

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                        🔒
                      </span>

                      <span>Secure & encrypted checkout</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        🛡️
                      </span>

                      <span>Your information is protected</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* BACK TO SHIPPING */}

              <Link
                to="/shipping"
                className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-orange-500 transition"
              >
                ← Back to Shipping
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* ======================================================
          ANIMATIONS
      ====================================================== */}

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(25px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

// ==========================================================
// INFO ITEM
// ==========================================================

const InfoItem = ({ label, value, full = false }) => {
  return (
    <div
      className={`${full ? "sm:col-span-2" : ""} rounded-xl bg-slate-50 border border-slate-100 p-4 hover:bg-orange-50/50 hover:border-orange-100 transition-colors duration-200`}
    >
      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 font-semibold text-slate-800 break-words">
        {value || "N/A"}
      </p>
    </div>
  );
};

// ==========================================================
// PRICE ROW
// ==========================================================

const PriceRow = ({ label, value, valueClass = "text-slate-900" }) => {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-slate-500">s{label}</span>

      <span className={`font-bold ${valueClass}`}>{value}</span>
    </div>
  );
};

export default ConfirmOrder;
