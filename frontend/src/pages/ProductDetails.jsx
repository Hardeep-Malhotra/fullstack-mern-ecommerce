import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  CheckCircle2,
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  Search,
} from "lucide-react";

import {
  getProductDetails,
  clearProduct,
} from "../redux/slices/productSlice";
import { addItemToCart } from "../redux/slices/cartSlice";

const getHighResImage = (url) => {
  if (!url) return "/placeholder.png";
  if (url.includes("cloudinary.com")) {
    return url.replace("/upload/", "/upload/w_1200,q_90,f_auto/");
  }
  return url;
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { product, productLoading, productError } = useSelector(
    (state) => state.product
  );
  const { loading: cartLoading, error: cartError } = useSelector(
    (state) => state.cart
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  // Zoom States
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageRef = useRef(null);

  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
    }
    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (cartError) {
      toast.error(cartError);
    }
  }, [cartError]);

  // ==========================================
  // ZOOM HANDLERS — mouse (desktop) + touch (mobile)
  // ==========================================
  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  };

  const handleTouchMove = (e) => {
    if (!imageRef.current || !e.touches[0]) return;
    const rect = imageRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    setZoomPos({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  };

  const handleAddToCart = async () => {
    if (product.stock <= 0) return toast.error("Product is out of stock");
    if (quantity > product.stock)
      return toast.error(`Only ${product.stock} items available`);

    const result = await dispatch(
      addItemToCart({ id: product._id, quantity })
    );

    if (addItemToCart.fulfilled.match(result)) {
      toast.success("Added to cart");
    }
  };

  const handleBuyNow = async () => {
    if (product.stock <= 0) return toast.error("Product is out of stock");

    const result = await dispatch(
      addItemToCart({ id: product._id, quantity })
    );

    if (addItemToCart.fulfilled.match(result)) {
      navigate("/cart");
    }
  };

  if (productLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
          className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (productError || !product?._id) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[60vh] flex flex-col items-center justify-center px-4"
      >
        <p className="text-slate-500 font-medium">Product not found</p>
        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
          <Link
            to="/products"
            className="mt-4 inline-block text-xs font-semibold bg-slate-900 text-white px-4 py-2 rounded-lg"
          >
            Return to Shop
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  const images = product.images || [];
  const currentImage = images[selectedImage]?.url || "/placeholder.png";
  const hdImage = getHighResImage(currentImage);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8 font-sans antialiased text-slate-800">

      {/* BREADCRUMB */}
      <motion.nav
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2 text-xs text-slate-400 mb-6"
      >
        <Link to="/" className="hover:text-slate-700 transition">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-slate-700 transition">Shop</Link>
        <span>/</span>
        <span className="text-slate-700 font-medium truncate max-w-[200px]">{product.name}</span>
      </motion.nav>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

        {/* GALLERY */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-6 space-y-3 relative"
        >
          <div
            ref={imageRef}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsZooming(true)}
            onTouchEnd={() => setIsZooming(false)}
            onTouchMove={handleTouchMove}
            className="relative h-[340px] sm:h-[420px] rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/60 border border-slate-200/80 overflow-hidden cursor-zoom-in group select-none touch-none"
          >
            <img
              src={currentImage}
              alt={product.name}
              className={`w-full h-full object-contain p-6 transition-opacity duration-150 ${
                isZooming ? "opacity-0" : "opacity-100"
              }`}
            />

            {/* DESKTOP LENS BOX — marks where you're zoomed into */}
            {isZooming && (
              <div
                className="hidden lg:block absolute w-28 h-28 border-2 border-orange-500/80 bg-orange-500/10 pointer-events-none rounded-lg shadow-sm"
                style={{
                  left: `${zoomPos.x}%`,
                  top: `${zoomPos.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}

            {/* MOBILE — zoom stays INSIDE this same card, no separate popup */}
            <div
              className="lg:hidden absolute inset-0 w-full h-full bg-no-repeat pointer-events-none bg-slate-50 transition-opacity duration-150"
              style={{
                opacity: isZooming ? 1 : 0,
                backgroundImage: `url(${hdImage})`,
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                backgroundSize: "200%",
              }}
            />

            {!isZooming && (
              <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-semibold text-slate-600 shadow-sm flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <Search size={12} /> Hover / touch to zoom
              </span>
            )}
          </div>

          {/* DESKTOP SIDE ZOOM PANEL — only shows on lg+, mobile never gets this */}
          <AnimatePresence>
            {isZooming && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="hidden lg:block absolute top-0 left-[103%] w-full h-[420px] z-40 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden pointer-events-none"
                style={{
                  backgroundImage: `url(${hdImage})`,
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  backgroundSize: "190%",
                  backgroundRepeat: "no-repeat",
                }}
              />
            )}
          </AnimatePresence>

          {/* THUMBNAILS */}
          {images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <motion.button
                  key={img._id || idx}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-16 h-16 rounded-xl border-2 transition-all shrink-0 bg-slate-50 overflow-hidden ${
                    selectedImage === idx
                      ? "border-orange-500 shadow-sm"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-contain p-1" />
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>

        {/* DETAILS */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-orange-600 uppercase bg-orange-50 px-2.5 py-1 rounded-md border border-orange-100">
                {product.category}
              </span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setWishlisted(!wishlisted)}
                className="p-2 text-slate-400 hover:text-rose-500 rounded-full hover:bg-slate-50 transition"
              >
                <Heart size={18} className={wishlisted ? "fill-rose-500 text-rose-500" : ""} />
              </motion.button>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 leading-snug">
              {product.name}
            </h1>

            {/* RATING & REVIEWS */}
            <div className="flex items-center gap-2 mt-2 text-xs">
              <div className="flex items-center gap-1 bg-amber-500 text-white px-2 py-0.5 rounded font-bold">
                <Star size={11} className="fill-white" />
                <span>{product.ratings || "4.8"}</span>
              </div>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 font-medium">
                {product.numberOfReviews || 0} reviews
              </span>
            </div>

            {/* PRICING */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-slate-400">Inclusive of all taxes</span>
            </div>

            {/* IN STOCK BAR */}
            <div className="mt-3 flex items-center gap-2">
              {product.stock > 0 ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 px-2.5 py-1 rounded-md">
                  <CheckCircle2 size={13} /> In Stock ({product.stock} units)
                </div>
              ) : (
                <div className="text-xs text-rose-600 font-medium bg-rose-50 px-2.5 py-1 rounded-md">
                  Out of Stock
                </div>
              )}
            </div>

            {/* QUANTITY PICKER */}
            {product.stock > 0 && (
              <div className="mt-5 flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Qty:
                </span>
                <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-slate-200/60 disabled:opacity-30 text-slate-600"
                  >
                    <Minus size={14} />
                  </motion.button>
                  <span className="w-8 text-center text-xs font-bold text-slate-800">
                    {quantity}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-slate-200/60 disabled:opacity-30 text-slate-600"
                  >
                    <Plus size={14} />
                  </motion.button>
                </div>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || cartLoading}
                className="w-full py-3 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-slate-800 text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <ShoppingCart size={16} /> Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleBuyNow}
                disabled={product.stock <= 0 || cartLoading}
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Zap size={16} /> Buy Now
              </motion.button>
            </div>

            {/* PERKS / TRUST BADGES */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.35 }}
              className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-slate-100 text-[11px] text-slate-500 font-medium"
            >
              <div className="flex flex-col items-center text-center gap-1">
                <Truck size={16} className="text-slate-400" />
                <span>Free Express Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <RotateCcw size={16} className="text-slate-400" />
                <span>7-Day Return Guarantee</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <ShieldCheck size={16} className="text-slate-400" />
                <span>100% Genuine Guarantee</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* TABS (DESCRIPTION & SPECS) */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.35 }}
        className="mt-12 pt-6 border-t border-slate-200"
      >
        <div className="flex gap-6 border-b border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("description")}
            className={`relative pb-3 transition ${
              activeTab === "description"
                ? "text-orange-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Description
            {activeTab === "description" && (
              <motion.div
                layoutId="tabUnderline"
                className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-orange-500"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`relative pb-3 transition ${
              activeTab === "specs"
                ? "text-orange-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Specifications
            {activeTab === "specs" && (
              <motion.div
                layoutId="tabUnderline"
                className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-orange-500"
              />
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="py-4 text-xs leading-relaxed text-slate-600"
          >
            {activeTab === "description" ? (
              <p className="max-w-3xl">{product.description}</p>
            ) : (
              <div className="max-w-md grid grid-cols-2 gap-y-2 text-slate-700">
                <span className="font-medium text-slate-400">Category</span>
                <span>{product.category}</span>
                <span className="font-medium text-slate-400">Stock Available</span>
                <span>{product.stock} items</span>
                <span className="font-medium text-slate-400">Product ID</span>
                <span className="font-mono text-[10px]">{product._id}</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

    </div>
  );
};

export default ProductDetails;