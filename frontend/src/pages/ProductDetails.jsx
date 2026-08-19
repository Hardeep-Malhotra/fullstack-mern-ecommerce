import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getProductDetails, clearProduct } from "../redux/slices/productSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { product, productLoading, productError } = useSelector(
    (state) => state.product,
  );

  const [selectedImage, setSelectedImage] = useState(0);

  // ==========================================
  // ZOOM STATE
  // ==========================================
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageRef = useRef(null);

  // ==========================================
  // FETCH PRODUCT
  // ==========================================
  useEffect(() => {
    dispatch(getProductDetails(id));

    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch, id]);

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

  // ==========================================
  // LOADING
  // ==========================================
  if (productLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (productError) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>

        <p className="text-slate-500 mt-2">{productError}</p>

        <Link
          to="/products"
          className="mt-6 px-5 py-2.5 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const images = product.images || [];

  const currentImage = images[selectedImage]?.url || "/placeholder.png";

  return (
    <div key={id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ====================================== */}
      {/* BREADCRUMB */}
      {/* ====================================== */}

      <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link to="/" className="hover:text-orange-500">
          Home
        </Link>

        <span>/</span>

        <Link to="/products" className="hover:text-orange-500">
          Products
        </Link>

        <span>/</span>

        <span className="text-slate-800 font-medium truncate">
          {product.name}
        </span>
      </div>

      {/* ====================================== */}
      {/* PRODUCT */}
      {/* ====================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* ==================================== */}
        {/* LEFT - IMAGES WITH AMAZON ZOOM */}
        {/* ==================================== */}

        <div className="relative">
          {/* MAIN IMAGE CONTAINER */}
          <div
            ref={imageRef}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={handleMouseMove}
            className="relative h-[450px] bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden cursor-crosshair group select-none"
          >
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-contain p-8"
            />

            {/* CURSOR OVERLAY LENS */}
            {isZooming && (
              <div
                className="absolute w-36 h-36 border-2 border-orange-500/80 bg-orange-500/15 pointer-events-none rounded-lg shadow-sm"
                style={{
                  left: `${zoomPos.x}%`,
                  top: `${zoomPos.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}

            {/* HOVER HINT */}
            {!isZooming && (
              <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 shadow-sm flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                🔍 Hover to zoom
              </span>
            )}
          </div>
          {/* AMAZON SIDE ZOOM PREVIEW PANEL */}
          
          {isZooming && (
            <div
              className="hidden lg:block absolute top-0 left-[104%] w-[100%] h-[450px] z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden pointer-events-none"
              style={{
                backgroundImage: `url(${currentImage})`,
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                backgroundSize: "200%", // 👈 280% ki jagah 200% ya 220% karein
                backgroundRepeat: "no-repeat",
                imageRendering: "-webkit-optimize-contrast",
              }}
            />
          )}
          {/* THUMBNAILS */}
          {images.length > 0 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={image._id || index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === index
                      ? "border-orange-500"
                      : "border-slate-200 hover:border-orange-300"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-contain bg-slate-50"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ==================================== */}
        {/* RIGHT - PRODUCT INFO */}
        {/* ==================================== */}

        <div className="flex flex-col">
          {/* CATEGORY */}

          <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">
            {product.category}
          </p>

          {/* NAME */}

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
            {product.name}
          </h1>

          {/* RATINGS */}

          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1 bg-green-600 text-white px-2.5 py-1 rounded-md text-sm font-semibold">
              ⭐ {product.ratings || 0}
            </div>

            <span className="text-sm text-slate-500">
              {product.numberOfReviews || 0} Reviews
            </span>
          </div>

          {/* PRICE */}

          <div className="mt-6">
            <span className="text-3xl font-bold text-slate-900">
              ₹{product.price?.toLocaleString("en-IN")}
            </span>
          </div>

          {/* STOCK */}

          <div className="mt-5">
            {product.stock > 0 ? (
              <p className="text-green-600 font-semibold">
                ✓ In Stock
                <span className="text-slate-500 font-normal ml-2">
                  ({product.stock} available)
                </span>
              </p>
            ) : (
              <p className="text-red-500 font-semibold">Out of Stock</p>
            )}
          </div>

          {/* DESCRIPTION */}

          <div className="mt-7 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">Description</h2>

            <p className="mt-3 text-slate-600 leading-7">
              {product.description}
            </p>
          </div>

          {/* ================================= */}
          {/* QUANTITY */}
          {/* ================================= */}

          {product.stock > 0 && (
            <div className="mt-7">
              <p className="text-sm font-semibold text-slate-800 mb-2">
                Quantity
              </p>

              <div className="flex items-center border border-slate-300 rounded-lg w-fit overflow-hidden">
                <button className="w-10 h-10 text-lg hover:bg-slate-100">
                  −
                </button>

                <span className="w-12 text-center font-semibold">1</span>

                <button className="w-10 h-10 text-lg hover:bg-slate-100">
                  +
                </button>
              </div>
            </div>
          )}

          {/* ================================= */}
          {/* ACTION BUTTONS */}
          {/* ================================= */}

          <div className="flex gap-3 mt-8">
            <button
              disabled={product.stock <= 0}
              className="flex-1 py-3.5 rounded-xl border-2 border-orange-500 text-orange-500 font-bold hover:bg-orange-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🛒 Add to Cart
            </button>

            <button
              disabled={product.stock <= 0}
              className="flex-1 py-3.5 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
          </div>

          {/* WISHLIST */}

          <button className="mt-3 w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition">
            ♡ Add to Wishlist
          </button>
        </div>
      </div>

      {/* ====================================== */}
      {/* PRODUCT INFORMATION */}
      {/* ====================================== */}

      <div className="mt-16 border-t border-slate-200 pt-10">
        <h2 className="text-2xl font-bold text-slate-900">
          Product Information
        </h2>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-slate-50">
            <p className="text-sm text-slate-500">Category</p>

            <p className="mt-1 font-semibold text-slate-900">
              {product.category}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50">
            <p className="text-sm text-slate-500">Availability</p>

            <p className="mt-1 font-semibold text-slate-900">
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50">
            <p className="text-sm text-slate-500">Customer Reviews</p>

            <p className="mt-1 font-semibold text-slate-900">
              {product.numberOfReviews || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
