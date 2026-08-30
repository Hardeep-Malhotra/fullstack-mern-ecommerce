import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  Zap,
} from "lucide-react";
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
    (state) => state.auth || { isAuthenticated: false },
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
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-200"
          >
            <ShoppingCart size={34} />
          </motion.div>
          <h1 className="text-3xl font-black text-slate-900">
            Your Cart is Empty
          </h1>
          <p className="mt-2 text-slate-500">
            Looks like you haven't added anything to your cart yet.
          </p>
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block"
          >
            <Link
              to="/products"
              className="inline-block mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-7 py-3.5 rounded-xl font-bold shadow-lg shadow-orange-200"
            >
              Continue Shopping
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // CALCULATIONS
  const subtotal = cartItems.reduce(
    (total, item) => total + (item?.price || 0) * (item?.quantity || 1),
    0,
  );

  const totalItems = cartItems.reduce(
    (total, item) => total + (item?.quantity || 1),
    0,
  );

  const shipping = subtotal >= 500 ? 0 : 99;
  const total = subtotal + shipping;

  const formatPrice = (price) => `₹${price.toLocaleString("en-IN")}`;

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8 flex justify-between items-end"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
              Shopping Cart
            </h1>
            <p className="mt-2 text-slate-500">
              {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          {typeof clearCart === "function" && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleClearCart}
              className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors duration-200"
            >
              Clear Cart
            </motion.button>
          )}
        </motion.div>

        {/* HYPERLOCAL DELIVERY BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800"
        >
          <div className="w-9 h-9 shrink-0 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Zap size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold">Fast Hyperlocal Delivery</p>
            <p className="text-xs text-emerald-600">
              Orders placed now will be delivered directly to your doorstep
              within 24–48 hours.
            </p>
          </div>
        </motion.div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CART ITEMS LIST */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item, i) => {
                const productId = item.product || item._id || item.id;
                return (
                  <motion.div
                    key={productId || i}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm hover:shadow-lg hover:border-orange-200 transition-shadow duration-300"
                  >
                    <div className="flex flex-col sm:flex-row gap-5">
                      {/* PRODUCT IMAGE */}
                      <div className="w-full sm:w-32 h-32 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden p-2">
                        <motion.img
                          src={item.image}
                          alt={item.name}
                          whileHover={{ scale: 1.06 }}
                          transition={{ duration: 0.25 }}
                          className="w-full h-full object-contain"
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
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => dispatch(removeCartItem(productId))}
                            className="text-slate-400 hover:text-red-500 transition-colors duration-200 self-start"
                            title="Remove item"
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        </div>

                        {/* QUANTITY & ITEM TOTAL */}
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                dispatch(decreaseQuantity(productId))
                              }
                              disabled={item.quantity <= 1}
                              className="w-9 h-9 flex items-center justify-center hover:bg-orange-100 hover:text-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                              <Minus size={14} />
                            </motion.button>
                            <span className="w-10 text-center font-semibold text-slate-900">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                dispatch(increaseQuantity(productId))
                              }
                              disabled={item.quantity >= item.stock}
                              className="w-9 h-9 flex items-center justify-center hover:bg-orange-100 hover:text-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                              <Plus size={14} />
                            </motion.button>
                          </div>

                          <p className="text-xl font-extrabold text-slate-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <motion.div whileHover={{ x: -3 }} className="inline-block">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold mt-4 transition-colors duration-200"
              >
                <ArrowLeft size={16} /> Continue Shopping
              </Link>
            </motion.div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-24"
            >
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
                      <span className="text-green-600 font-semibold">FREE</span>
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

              <AnimatePresence>
                {subtotal < 500 && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-5 text-sm text-slate-600 bg-orange-50 border border-orange-100 rounded-xl p-3 overflow-hidden"
                  >
                    Add{" "}
                    <span className="font-semibold text-orange-600">
                      {formatPrice(500 - subtotal)}
                    </span>{" "}
                    more to get free shipping.
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCheckout}
                className="w-full mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-orange-200"
              >
                Proceed to Checkout
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
