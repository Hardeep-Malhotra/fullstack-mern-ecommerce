import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import {
  Heart,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

import {
  getWishlist,
  removeFromWishlist,
} from "../redux/slices/wishlistSlice";

// ==========================================
// WISHLIST
// ==========================================

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    items = [],
    loading,
    error,
  } = useSelector((state) => state.wishlist || {});

  // ==========================================
  // FETCH WISHLIST
  // ==========================================

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  // ==========================================
  // REMOVE
  // ==========================================

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  // ==========================================
  // GET PRODUCT IMAGE
  // ==========================================

  const getProductImage = (product) => {
    // 1. product.image = string
    if (typeof product?.image === "string" && product.image) {
      return product.image;
    }

    // 2. product.image = { url: "..." }
    if (product?.image?.url) {
      return product.image.url;
    }

    // 3. product.images = ["url"]
    if (
      Array.isArray(product?.images) &&
      typeof product.images[0] === "string"
    ) {
      return product.images[0];
    }

    // 4. product.images = [{ url: "..." }]
    if (
      Array.isArray(product?.images) &&
      product.images[0]?.url
    ) {
      return product.images[0].url;
    }

    return null;
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-[80vh] bg-gradient-to-br from-orange-50 via-white to-slate-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-10 w-56 bg-slate-200 rounded-xl animate-pulse mb-3" />

          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-8" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm animate-pulse"
              >
                <div className="h-64 bg-slate-200 rounded-2xl" />

                <div className="h-5 bg-slate-200 rounded mt-5 w-4/5" />

                <div className="h-7 bg-slate-200 rounded mt-3 w-2/5" />

                <div className="h-11 bg-slate-200 rounded-xl mt-5" />
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-red-100 shadow-lg p-8 text-center">

          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-red-50 flex items-center justify-center">
            <Heart className="w-8 h-8 text-red-500" />
          </div>

          <h2 className="text-2xl font-black text-slate-900">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>

          <button
            onClick={() => dispatch(getWishlist())}
            className="mt-6 px-7 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-bold shadow-lg shadow-orange-200 transition-all cursor-pointer"
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  // ==========================================
  // EMPTY WISHLIST
  // ==========================================

  if (!items.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[75vh] bg-gradient-to-br from-orange-50 via-white to-slate-50 flex items-center justify-center px-4"
      >
        <div className="text-center max-w-md">

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: "easeInOut",
            }}
            className="w-24 h-24 mx-auto mb-7 rounded-3xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-xl shadow-orange-200"
          >
            <Heart
              size={45}
              className="text-white"
              strokeWidth={2}
            />
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            Your Wishlist is Empty
          </h1>

          <p className="mt-3 text-slate-500 leading-relaxed">
            Save products you love and easily find them later.
          </p>

          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block"
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-2 mt-7 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-7 py-3.5 rounded-xl font-bold shadow-lg shadow-orange-200 transition-all"
            >
              Explore Products
              <ArrowRight size={18} />
            </Link>
          </motion.div>

        </div>
      </motion.div>
    );
  }

  // ==========================================
  // MAIN WISHLIST
  // ==========================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-slate-50 py-8 sm:py-10">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ======================================
            HEADER
        ====================================== */}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >

          <div>

            <div className="flex items-center gap-3">

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                My Wishlist
              </h1>

              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <Heart
                  className="w-6 h-6 text-orange-600 fill-orange-600"
                />
              </div>

            </div>

            <p className="mt-2 text-slate-500">
              {items.length}{" "}
              {items.length === 1 ? "item" : "items"} saved
            </p>

          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold transition-colors"
          >
            <ArrowLeft size={17} />
            Continue Shopping
          </Link>

        </motion.div>

        {/* ======================================
            DIVIDER
        ====================================== */}

        <div className="h-px bg-slate-200 mb-8" />

        {/* ======================================
            PRODUCT GRID
        ====================================== */}

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >

          <AnimatePresence mode="popLayout">

            {items.map((product) => {

              const image = getProductImage(product);

              return (
                <motion.div
                  key={product._id}
                  layout
                  initial={{
                    opacity: 0,
                    y: 20,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    x: -20,
                  }}
                  whileHover={{
                    y: -6,
                  }}
                  transition={{
                    duration: 0.3,
                  }}

                  className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300"
                >

                  {/* ==================================
                      IMAGE
                  ================================== */}

                  <div className="relative h-64 sm:h-60 bg-slate-50 overflow-hidden">

                    {image ? (
                      <img
                        src={image}
                        alt={product.name || "Product"}
                        className="w-full h-full object-contain p-5 group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <ShoppingBag
                          size={40}
                          className="mb-2 text-orange-400"
                        />
                        <span className="text-sm">
                          No Image Available
                        </span>
                      </div>
                    )}

                    {/* SALE / WISHLIST BADGE */}

                    <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                      SAVED
                    </div>

                    {/* REMOVE */}

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        handleRemove(product._id)
                      }
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-slate-500 hover:text-red-500 shadow-md transition-colors cursor-pointer"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={17} />
                    </motion.button>

                  </div>

                  {/* ==================================
                      PRODUCT INFO
                  ================================== */}

                  <div className="p-5">

                    <h2 className="font-bold text-lg text-slate-900 line-clamp-1">
                      {product.name}
                    </h2>

                    {product.category && (
                      <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">
                        {product.category}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3">

                      <p className="text-2xl font-black text-slate-900">
                        ₹
                        {product.price?.toLocaleString(
                          "en-IN"
                        )}
                      </p>

                      <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center">
                        <Heart
                          size={17}
                          className="text-orange-500 fill-orange-500"
                        />
                      </div>

                    </div>

                    {/* ==================================
                        MOVE TO BAG
                    ================================== */}

                    <motion.button
                      whileHover={{
                        y: -2,
                      }}
                      whileTap={{
                        scale: 0.97,
                      }}
                      onClick={() => {
                        // Cart integration yahan add kar sakte hain
                        handleRemove(product._id);
                      }}
                      className="w-full mt-5 py-3.5 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-200 transition-all duration-300 cursor-pointer"
                    >
                      <ShoppingBag size={17} />
                      Move to Bag
                    </motion.button>

                  </div>

                </motion.div>
              );
            })}

          </AnimatePresence>

        </motion.div>

        {/* ======================================
            BOTTOM INFO
        ====================================== */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 bg-white border border-orange-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm"
        >

          <div className="w-11 h-11 shrink-0 rounded-xl bg-orange-100 flex items-center justify-center">
            <Sparkles
              size={20}
              className="text-orange-600"
            />
          </div>

          <div>
            <p className="font-semibold text-slate-900">
              Keep your favorites close
            </p>

            <p className="text-sm text-slate-500 mt-0.5">
              Products saved here will stay in your wishlist
              until you remove them.
            </p>
          </div>

        </motion.div>

      </div>
    </div>
  );
};

export default Wishlist;