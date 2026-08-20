import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  removeCartItem,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "../redux/slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Top Level Redux Selectors
  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });
  const { isAuthenticated } = useSelector(
    (state) => state.auth || { isAuthenticated: false }
  );

  const handleClearCart = () => {
    if (typeof clearCart === "function") {
      dispatch(clearCart());
    } else {
      console.warn("clearCart action is not defined in cartSlice.");
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: "/shipping",
        },
      });
      return;
    }

    navigate("/shipping");
  };

  // EMPTY CART UI
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gradient-to-br from-orange-50 via-white to-slate-50">
        <div className="text-center animate-[fadeUp_0.5s_ease-out]">
          <div className="text-7xl mb-5 animate-[float_3s_ease-in-out_infinite]">
            🛒
          </div>
          <h1 className="text-3xl font-black text-slate-900">
            Your Cart is Empty
          </h1>
          <p className="mt-2 text-slate-500">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link
            to="/products"
            className="inline-block mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-7 py-3.5 rounded-xl font-bold shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // CALCULATIONS
  const subtotal = cartItems.reduce(
    (total, item) => total + (item?.price || 0) * (item?.quantity || 1),
    0
  );

  const totalItems = cartItems.reduce(
    (total, item) => total + (item?.quantity || 1),
    0
  );

  const shipping = subtotal >= 500 ? 0 : 99;
  const total = subtotal + shipping;

  const formatPrice = (price) => `₹${price.toLocaleString("en-IN")}`;

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div className="mb-8 flex justify-between items-end animate-[fadeUp_0.4s_ease-out]">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
              Shopping Cart
            </h1>
            <p className="mt-2 text-slate-500">
              {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          {typeof clearCart === "function" && (
            <button
              onClick={handleClearCart}
              className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors duration-200"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* HYPERLOCAL DELIVERY BANNER */}
        <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 animate-[fadeUp_0.4s_ease-out_0.05s_backwards]">
          <span className="text-2xl">⚡</span>
          <div>
            <p className="text-sm font-semibold">Fast Hyperlocal Delivery</p>
            <p className="text-xs text-emerald-600">
              Orders placed now will be delivered directly to your doorstep
              within 24–48 hours.
            </p>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CART ITEMS LIST */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, i) => {
              const productId = item.product || item._id || item.id;
              return (
                <div
                  key={productId || i}
                  style={{ animationDelay: `${i * 70}ms` }}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300 animate-[fadeUp_0.4s_ease-out_backwards]"
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* PRODUCT IMAGE */}
                    <div className="w-full sm:w-32 h-32 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden p-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    {/* PRODUCT INFO */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between gap-4">
                        <div>
                          <h2 className="text-lg font-semibold text-slate-900 line-clamp-1">
                            {item.name}
                          </h2>
                          <p className="mt-1 text-sm text-slate-500">
                            {formatPrice(item.price)} per item
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            Stock: {item.stock}
                          </p>
                        </div>

                        {/* REMOVE ITEM */}
                        <button
                          onClick={() => dispatch(removeCartItem(productId))}
                          className="text-slate-400 hover:text-red-500 hover:scale-110 transition-all duration-200 text-xl self-start"
                          title="Remove item"
                        >
                          🗑️
                        </button>
                      </div>

                      {/* QUANTITY & ITEM TOTAL */}
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                          <button
                            onClick={() =>
                              dispatch(decreaseQuantity(productId))
                            }
                            disabled={item.quantity <= 1}
                            className="w-9 h-9 flex items-center justify-center text-lg font-semibold hover:bg-orange-100 hover:text-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            −
                          </button>
                          <span className="w-10 text-center font-semibold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              dispatch(increaseQuantity(productId))
                            }
                            disabled={item.quantity >= item.stock}
                            className="w-9 h-9 flex items-center justify-center text-lg font-semibold hover:bg-orange-100 hover:text-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            +
                          </button>
                        </div>

                        <p className="text-xl font-extrabold text-slate-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 hover:gap-3 font-semibold mt-4 transition-all duration-200"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-24 animate-[fadeUp_0.4s_ease-out_0.1s_backwards]">
              <h2 className="text-xl font-bold text-slate-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600 font-semibold">
                        FREE
                      </span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-slate-900">
                      Total
                    </span>
                    <span className="text-2xl font-black text-orange-500">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              {subtotal < 500 && (
                <p className="mt-5 text-sm text-slate-600 bg-orange-50 border border-orange-100 rounded-xl p-3 animate-[fadeUp_0.3s_ease-out]">
                  Add{" "}
                  <span className="font-semibold text-orange-600">
                    {formatPrice(500 - subtotal)}
                  </span>{" "}
                  more to get free shipping.
                </p>
              )}

              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;