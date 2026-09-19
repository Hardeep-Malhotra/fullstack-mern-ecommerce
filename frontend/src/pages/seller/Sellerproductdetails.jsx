import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  IndianRupee,
  Boxes,
  Tag,
  Star,
  ImageOff,
  PackageCheck,
  RefreshCw,
} from "lucide-react";

import axios from "../../api/axios";
import RatingSummary from "../../components/review/RatingSummary";
import SellerReviewCard from "../../components/seller/SellerReviewCard";

const listVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  show: {
    opacity: 1,
    y: 0,
  },
};

const SellerProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState(0);

  // ==========================================
  // FETCH PRODUCT + REVIEWS
  // ==========================================

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const fetchProductAndReviews = async () => {
      try {
        const config = {
          signal: controller.signal,
        };

        const [productRes, reviewsRes] = await Promise.all([
          axios.get(`/products/${id}`, config),
          axios.get(`/products/${id}/reviews`, config),
        ]);

        // Request cancel ho gayi ho to state update mat karo
        if (controller.signal.aborted) {
          return;
        }

        const productData = productRes.data?.product || productRes.data || null;

        const reviewsData = reviewsRes.data?.reviews || [];

        // IMPORTANT:
        // Ye sab API response ke BAAD ho raha hai
        setProduct(productData);
        setReviews(reviewsData);
        setError("");
        setSelectedImage(0);
        setLoading(false);
      } catch (err) {
        if (
          controller.signal.aborted ||
          err?.name === "CanceledError" ||
          err?.code === "ERR_CANCELED"
        ) {
          return;
        }

        console.error("Fetch seller product details error:", err);

        setError(
          err.response?.data?.message || "Failed to load product details",
        );

        setProduct(null);
        setReviews([]);
        setLoading(false);
      }
    };

    fetchProductAndReviews();

    return () => {
      controller.abort();
    };
  }, [id]);

  // ==========================================
  // RETRY
  // ==========================================

  const handleRetry = () => {
    window.location.reload();
  };
  // ==========================================
  // DELETE REVIEW
  // ==========================================

  const handleDeleteReview = async (reviewUserId) => {
    if (!reviewUserId) {
      toast.error("Reviewer ID is missing");
      return;
    }

    try {
      await axios.delete(`/seller/products/${id}/reviews/${reviewUserId}`);

      toast.success("Review deleted successfully");

      // ==========================================
      // REMOVE REVIEW
      // ==========================================

      setReviews((prevReviews) => {
        const remainingReviews = prevReviews.filter((review) => {
          const currentReviewUserId =
            typeof review.user === "object" ? review.user?._id : review.user;

          return String(currentReviewUserId) !== String(reviewUserId);
        });

        // ==========================================
        // RECALCULATE RATING
        // ==========================================

        const count = remainingReviews.length;

        const average =
          count > 0
            ? remainingReviews.reduce(
                (sum, review) => sum + Number(review.rating || 0),
                0,
              ) / count
            : 0;

        // ==========================================
        // UPDATE PRODUCT STATS
        // ==========================================

        setProduct((previousProduct) => {
          if (!previousProduct) {
            return previousProduct;
          }

          return {
            ...previousProduct,
            numberOfReviews: count,
            ratings: average,
          };
        });

        return remainingReviews;
      });
    } catch (err) {
      console.error("Delete review error:", err);

      toast.error(err.response?.data?.message || "Failed to delete review");
    }
  };

  // ==========================================
  // LOADING UI
  // ==========================================

  if (loading) {
    return (
      <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6">
        <div className="h-8 w-36 bg-slate-200 animate-pulse rounded-lg" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-80 bg-white border border-slate-100 rounded-3xl animate-pulse md:col-span-1" />

          <div className="h-80 bg-white border border-slate-100 rounded-3xl animate-pulse md:col-span-2" />
        </div>

        <div className="h-64 bg-white border border-slate-100 rounded-3xl animate-pulse" />
      </div>
    );
  }

  // ==========================================
  // ERROR UI
  // ==========================================

  if (error || !product) {
    return (
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8"
      >
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <ImageOff size={28} />
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-1">
          Unable to display product
        </h3>

        <p className="text-slate-500 text-sm max-w-sm mb-6">
          {error ||
            "The product you are looking for doesn't exist or was removed."}
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/seller/products")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition shadow-sm"
          >
            <ArrowLeft size={16} />
            Back to Products
          </button>

          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
          >
            <RefreshCw size={15} />
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  // ==========================================
  // PRODUCT IMAGES
  // ==========================================

  const imagesList = Array.isArray(product.images)
    ? product.images
        .map((img) => (typeof img === "string" ? img : img?.url))
        .filter(Boolean)
    : [];

  const activeImage = imagesList[selectedImage] || null;

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
      }}
      className="p-4 sm:p-6 md:p-10 max-w-6xl mx-auto space-y-8 bg-slate-50/50 min-h-screen"
    >
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <motion.button
          whileHover={{
            x: -2,
          }}
          whileTap={{
            scale: 0.97,
          }}
          onClick={() => navigate("/seller/products")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80 px-4 py-2 rounded-xl shadow-sm transition hover:bg-slate-50"
        >
          <ArrowLeft size={16} />
          Back to Products
        </motion.button>
      </div>

      {/* PRODUCT DETAILS */}

      <motion.div
        initial={{
          opacity: 0,
          y: 16,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
          delay: 0.05,
        }}
        className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
      >
        {/* GALLERY */}

        <div className="md:col-span-5 space-y-4">
          <div className="aspect-square rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden relative group flex items-center justify-center">
            <AnimatePresence mode="wait">
              {activeImage ? (
                <motion.img
                  key={activeImage}
                  initial={{
                    opacity: 0,
                    scale: 1.02,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  src={activeImage}
                  alt={product.name || "Product Image"}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-300">
                  <ImageOff size={40} />

                  <span className="text-xs text-slate-400 font-medium">
                    No Image
                  </span>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* THUMBNAILS */}

          {imagesList.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {imagesList.map((img, idx) => (
                <motion.button
                  key={`${img}-${idx}`}
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.93,
                  }}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 rounded-xl border-2 overflow-hidden shrink-0 transition-colors duration-200 ${
                    selectedImage === idx
                      ? "border-slate-900 shadow-sm"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* PRODUCT CONTENT */}

        <div className="md:col-span-7 space-y-5">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-3">
              <Tag size={12} />

              {product.category || "General"}
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {product.name}
            </h1>
          </div>

          {/* PRICE + INVENTORY */}

          <div className="flex flex-wrap items-center gap-6 py-4 border-y border-slate-100">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Price
              </p>

              <div className="flex items-center text-2xl font-bold text-slate-900 mt-0.5">
                <IndianRupee size={20} className="stroke-[2.5]" />

                {Number(product.price || 0).toLocaleString("en-IN")}
              </div>
            </div>

            <div className="h-8 w-px bg-slate-100 hidden sm:block" />

            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Inventory
              </p>

              <div className="flex items-center gap-1.5 text-base font-semibold text-slate-800 mt-1">
                <Boxes size={18} className="text-slate-500" />

                <span>{product.stock ?? 0} units</span>

                <span
                  className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${
                    product.stock > 10
                      ? "bg-emerald-50 text-emerald-600"
                      : product.stock > 0
                        ? "bg-amber-50 text-amber-600"
                        : "bg-red-50 text-red-600"
                  }`}
                >
                  {product.stock > 10
                    ? "In Stock"
                    : product.stock > 0
                      ? "Low Stock"
                      : "Out of Stock"}
                </span>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Description
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {product.description ||
                "No description provided for this product."}
            </p>
          </div>
        </div>
      </motion.div>

      {/* REVIEWS */}

      <motion.div
        initial={{
          opacity: 0,
          y: 16,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
          delay: 0.12,
        }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <Star size={20} className="text-amber-400 fill-amber-400" />
            Customer Reviews ({reviews.length})
          </h2>
        </div>

        {reviews.length === 0 ? (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm"
          >
            <PackageCheck size={36} className="mx-auto text-slate-300 mb-3" />

            <p className="text-base font-semibold text-slate-700">
              No reviews yet
            </p>

            <p className="text-sm text-slate-400 mt-1">
              When customers leave feedback on this product, it will appear
              here.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* RATING SUMMARY */}

            <RatingSummary reviews={reviews} />

            {/* REVIEW LIST */}

            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="show"
              className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm divide-y divide-slate-100"
            >
              <AnimatePresence>
                {reviews.map((review) => {
                  const reviewUserId =
                    typeof review.user === "object"
                      ? review.user?._id
                      : review.user;

                  const itemKey = review._id || reviewUserId;

                  return (
                    <motion.div
                      key={itemKey}
                      variants={itemVariants}
                      exit={{
                        opacity: 0,
                        height: 0,
                      }}
                      className="py-4 first:pt-0 last:pb-0"
                    >
                      <SellerReviewCard
                        review={review}
                        onDelete={handleDeleteReview}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SellerProductDetails;
