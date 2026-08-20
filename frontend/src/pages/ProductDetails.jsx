import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getProductDetails,
  clearProduct,
} from "../redux/slices/productSlice";
import { addItemToCart } from "../redux/slices/cartSlice";

// Cloudinary URL ko dynamically High Quality (HD) URL banane ka function
const getHighResImage = (url) => {
  if (!url) return "/placeholder.png";
  if (url.includes("cloudinary.com")) {
    return url.replace("/upload/", "/upload/w_2000,q_100,f_auto/");
  }
  return url;
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ==========================================
  // REDUX STATE
  // ==========================================
  const { product, productLoading, productError } = useSelector(
    (state) => state.product
  );

  const { loading: cartLoading, error: cartError } = useSelector(
    (state) => state.cart
  );

  // ==========================================
  // LOCAL STATES
  // ==========================================
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [prevId, setPrevId] = useState(id);

  // Zoom States
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageRef = useRef(null);

  // Route change hone par image selection aur quantity reset karna
  if (id !== prevId) {
    setPrevId(id);
    setSelectedImage(0);
    setQuantity(1);
  }

  // ==========================================
  // FETCH PRODUCT & CLEANUP
  // ==========================================
  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
    }

    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch, id]);

  // ==========================================
  // CART ERROR TOAST
  // ==========================================
  useEffect(() => {
    if (cartError) {
      toast.error(cartError);
    }
  }, [cartError]);

  // ==========================================
  // ZOOM HANDLERS
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

  // ==========================================
  // QUANTITY HANDLERS
  // ==========================================
  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(product?.stock || 1, prev + 1));
  };

  // ==========================================
  // ADD TO CART HANDLER
  // ==========================================
  const handleAddToCart = async () => {
    if (product.stock <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} item(s) available`);
      return;
    }

    const result = await dispatch(
      addItemToCart({
        id: product._id,
        quantity,
      })
    );

    if (addItemToCart.fulfilled.match(result)) {
      toast.success("Product added to cart 🛒");
    }
  };

  // ==========================================
  // BUY NOW HANDLER
  // ==========================================
  const handleBuyNow = async () => {
    if (product.stock <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    const result = await dispatch(
      addItemToCart({
        id: product._id,
        quantity,
      })
    );

    if (addItemToCart.fulfilled.match(result)) {
      navigate("/cart");
    }
  };

  // ==========================================
  // LOADING STATE
  // ==========================================
  if (productLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================
  if (productError) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-slate-500 mt-2">{productError}</p>
        <Link
          to="/products"
          className="mt-6 px-5 py-2.5 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  if (!product || !product._id) {
    return null;
  }

  const images = product.images || [];
  const currentImage =
    images[selectedImage]?.url || images[0]?.url || "/placeholder.png";
  const hdImage = getHighResImage(currentImage);

  // ==========================================
  // MAIN UI
  // ==========================================
  return (
    <div key={id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      
      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8">
        <Link to="/" className="hover:text-orange-500">
          Home
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-orange-500">
          Products
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium truncate max-w-[150px] sm:max-w-xs">
          {product.name}
        </span>
      </div>

      {/* PRODUCT MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* LEFT - IMAGES WITH ADVANCED ZOOM */}
        <div className="relative">
          <div
            ref={imageRef}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsZooming(true)}
            onTouchEnd={() => setIsZooming(false)}
            onTouchMove={handleTouchMove}
            className="relative h-[350px] sm:h-[450px] bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden cursor-crosshair group select-none touch-none"
          >
            <img
              src={currentImage}
              alt={product.name}
              className={`w-full h-full object-contain p-4 sm:p-8 transition-opacity duration-200 ${
                isZooming ? "lg:opacity-100 opacity-0" : "opacity-100"
              }`}
            />

            {/* DESKTOP LENS OVERLAY */}
            {isZooming && (
              <div
                className="hidden lg:block absolute w-32 h-32 border-2 border-orange-500/80 bg-orange-500/10 pointer-events-none rounded-lg shadow-md"
                style={{
                  left: `${zoomPos.x}%`,
                  top: `${zoomPos.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}

            {/* MOBILE IN-PLACE ZOOM */}
            {isZooming && (
              <div
                className="lg:hidden absolute inset-0 w-full h-full pointer-events-none bg-slate-50"
                style={{
                  backgroundImage: `url(${hdImage})`,
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  backgroundSize: "170%",
                  backgroundRepeat: "no-repeat",
                }}
              />
            )}

            {!isZooming && (
              <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 shadow-sm flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                🔍 Hover / Touch to zoom
              </span>
            )}
          </div>

          {/* DESKTOP SIDE ZOOM PREVIEW PANEL */}
          {isZooming && (
            <div
              className="hidden lg:block absolute top-0 left-[103%] w-[100%] h-[450px] z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden pointer-events-none"
              style={{
                backgroundImage: `url(${hdImage})`,
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                backgroundSize: "160%",
                backgroundRepeat: "no-repeat",
              }}
            />
          )}

          {/* THUMBNAILS */}
          {images.length > 0 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-thin">
              {images.map((image, index) => (
                <button
                  key={image._id || index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === index
                      ? "border-orange-500 ring-2 ring-orange-500/20"
                      : "border-slate-200 hover:border-orange-300"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-contain p-1 bg-slate-50"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT - PRODUCT INFO */}
        <div className="flex flex-col">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-orange-500">
            {product.category}
          </p>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-1 leading-tight">
            {product.name}
          </h1>

          {/* RATING */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1 bg-green-600 text-white px-2.5 py-0.5 rounded-md text-xs sm:text-sm font-semibold">
              ⭐ {product.ratings || 0}
            </div>
            <span className="text-xs sm:text-sm text-slate-500 font-medium">
              {product.numberOfReviews || 0} Reviews
            </span>
          </div>

          {/* PRICE */}
          <div className="mt-5 sm:mt-6">
            <span className="text-3xl sm:text-4xl font-black text-slate-900">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
          </div>

          {/* STOCK STATUS */}
          <div className="mt-4">
            {product.stock > 0 ? (
              <p className="text-green-600 font-semibold text-sm sm:text-base">
                ✓ In Stock
                <span className="text-slate-500 font-normal ml-2">
                  ({product.stock} available)
                </span>
              </p>
            ) : (
              <p className="text-red-500 font-semibold text-sm sm:text-base">
                Out of Stock
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="mt-6 border-t border-slate-200 pt-5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Description
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* QUANTITY CONTROLLER */}
          {product.stock > 0 && (
            <div className="mt-6">
              <p className="text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Quantity
              </p>
              <div className="flex items-center border border-slate-300 rounded-xl w-fit overflow-hidden bg-slate-50">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="w-10 h-10 text-lg font-bold hover:bg-slate-200 transition disabled:opacity-40"
                >
                  −
                </button>
                <span className="w-12 text-center font-bold text-slate-800">
                  {quantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 text-lg font-bold hover:bg-slate-200 transition disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0 || cartLoading}
              className="flex-1 py-3.5 rounded-xl border-2 border-orange-500 text-orange-500 font-bold hover:bg-orange-50 transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cartLoading ? "Adding..." : "🛒 Add to Cart"}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0 || cartLoading}
              className="flex-1 py-3.5 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition active:scale-[0.98] shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
          </div>

          <button className="mt-3 w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition">
            ♡ Add to Wishlist
          </button>
        </div>
      </div>

      {/* BOTTOM METRICS PANEL */}
      <div className="mt-12 sm:mt-16 border-t border-slate-200 pt-8 sm:pt-10">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Product Information
        </h2>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-xs sm:text-sm text-slate-500">Category</p>
            <p className="mt-1 font-bold text-slate-900">{product.category}</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-xs sm:text-sm text-slate-500">Availability</p>
            <p className="mt-1 font-bold text-slate-900">
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-xs sm:text-sm text-slate-500">
              Customer Reviews
            </p>
            <p className="mt-1 font-bold text-slate-900">
              {product.numberOfReviews || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;