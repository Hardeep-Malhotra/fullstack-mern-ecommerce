import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  Bot,
  Star,
  ShoppingCart,
} from "lucide-react";
import { getProducts } from "../redux/slices/productSlice";
import { addItemToCart } from "../redux/slices/cartSlice";

// ============================================================
// STATIC CONTENT
// ============================================================

const categories = [
  { name: "Electronics", image: "/Electronic_category.png" },
  { name: "Fashion", image: "/Fashion_category.png" },
  { name: "Footwear", image: "/Footeware_category.png" },
  { name: "Beauty", image: "/Beauty_actegory.png" },
  { name: "Gaming", image: "/Gamming_category.png" },
  { name: "Home", image: "/Home_category.png" },
  { name: "Accessories", image: "/Accessories_category.png" },
];

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Shopping",
    desc: "Bank-grade encryption on every order and login — your data stays protected, always.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "Real-time tracking from checkout to doorstep, most orders arrive in 2-4 days.",
  },
  {
    icon: Bot,
    title: "AI Shopping Assistant",
    desc: "Describe what you need in plain words — it finds, compares, and recommends instantly.",
  },
];

// A few example exchanges the AI spotlight section cycles through,
// purely illustrative — not wired to the real assistant.
const aiDemoMessages = [
  { from: "user", text: "Running shoes under ₹2000, size 9" },
  { from: "ai", text: "Found 6 matches — best-rated one is ₹1,749, in stock." },
  { from: "user", text: "Any wireless earbuds with good bass?" },
  { from: "ai", text: "Yes — 3 options, all under ₹3,000 with 4★+ ratings." },
];

// Text items for the top auto-scrolling offer strip
const marqueeItems = [
  "10,000+ Products",
  "Free Shipping over ₹999",
  "AI Shopping Assistant",
  "Secure Payments",
  "24/7 Customer Support",
  "New Arrivals Every Week",
  "Premium Collection",
  "4.8★ Customer Rating",
];

// ============================================================
// MOTION VARIANTS — one orchestrated reveal per section
// ============================================================

const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const heroItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const sectionReveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const gridContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const gridItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// ============================================================
// TOP MARQUEE — premium auto-scrolling announcement strip
// ============================================================

const TopMarquee = () => {
  // Tripled so the loop never shows a gap, however wide the screen is
  const loopItems = [...marqueeItems, ...marqueeItems, ...marqueeItems];

  return (
    <div className="relative bg-slate-950 border-b border-white/10 overflow-hidden">
      {/* fade edges so the strip doesn't cut off harshly */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-slate-950 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-slate-950 to-transparent z-10" />

      <div className="flex w-max py-2.5 marquee-track">
        {loopItems.map((item, idx) => (
          <span
            key={idx}
            className="flex items-center gap-2 px-6 sm:px-8 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 whitespace-nowrap"
          >
            <Sparkles size={12} className="text-orange-400 shrink-0" />
            {item}
            <span className="text-slate-700 ml-6 sm:ml-8">•</span>
          </span>
        ))}
      </div>

      <style>{`
        .marquee-track {
          animation: marquee-scroll 28s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-33.3333%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </div>
  );
};

// ============================================================
// FULL-WIDTH IMAGE SLIDER — one image visible at a time, auto-advances
// ============================================================

const heroSlides = categories.map((c) => ({ name: c.name, image: c.image }));

const ImageSlider = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % heroSlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[42vh] sm:h-[55vh] md:h-[65vh] lg:h-[70vh] min-h-[240px] sm:min-h-[320px] md:min-h-[380px] overflow-hidden bg-slate-950">
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {heroSlides.map((slide, i) => (
          <div key={i} className="relative w-full h-full shrink-0">
            <img
              src={slide.image}
              alt={slide.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent" />
            <div className="absolute bottom-4 sm:bottom-10 md:bottom-12 left-4 sm:left-10 md:left-14 right-4 sm:right-auto">
              <p className="text-orange-300 font-semibold text-[10px] sm:text-sm uppercase tracking-widest mb-1 sm:mb-1.5">
                Featured Category
              </p>
              <h3 className="text-white text-xl sm:text-3xl md:text-5xl font-black tracking-tight leading-tight">
                {slide.name}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* nav dots */}
      <div className="absolute bottom-3 sm:bottom-5 right-3 sm:right-10 flex gap-1.5 sm:gap-2 z-10">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
              i === index ? "w-5 sm:w-7 bg-orange-500" : "w-1.5 sm:w-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

// ============================================================
// PRODUCT CARD
// ============================================================

const ProductCard = ({ product, onAddToCart }) => {
  const image = product?.images?.[0]?.url;

  return (
    <motion.div
      variants={gridItem}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-orange-200 transition-shadow duration-300 flex flex-col"
    >
      <div className="relative h-56 sm:h-64 bg-slate-50 flex items-center justify-center overflow-hidden">
        <Link to={`/products/${product._id}`} className="w-full h-full block">
          {image ? (
            <img
              src={image}
              alt={product.name || "Product"}
              className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
              No image available
            </div>
          )}
        </Link>

        {Number(product.ratings) > 0 && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm text-xs font-semibold text-slate-700 flex items-center gap-1">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            {Number(product.ratings).toFixed(1)}
          </div>
        )}

        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-3 right-3 bg-red-50 text-red-600 px-2.5 py-1 rounded-full text-xs font-semibold">
            Only {product.stock} left
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute top-3 right-3 bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Out of Stock
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs uppercase tracking-wide font-semibold text-orange-500 mb-1.5">
          {product.category}
        </p>

        <Link to={`/products/${product._id}`}>
          <h3 className="font-bold text-slate-900 line-clamp-2 min-h-[48px] group-hover:text-orange-500 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <p className="text-xl font-extrabold text-slate-900">
            ₹{Number(product.price || 0).toLocaleString("en-IN")}
          </p>

          <motion.button
            whileTap={{ scale: 0.9 }}
            disabled={product.stock === 0}
            onClick={() => onAddToCart(product)}
            title="Add to Cart"
            className="w-9 h-9 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================
// AI ASSISTANT SPOTLIGHT — animated chat preview
// ============================================================

const AISpotlight = () => {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= aiDemoMessages.length) {
      const resetTimer = setTimeout(() => setVisibleCount(0), 1800);
      return () => clearTimeout(resetTimer);
    }
    const timer = setTimeout(() => setVisibleCount((c) => c + 1), 1100);
    return () => clearTimeout(timer);
  }, [visibleCount]);

  return (
    <section className="py-20 bg-slate-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />

      <motion.div
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 grid lg:grid-cols-2 gap-12 items-center"
      >
        <div>
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-orange-300 px-3.5 py-1.5 rounded-full text-xs font-semibold">
            <Sparkles size={13} />
            Built into every page
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white mt-5 leading-tight">
            Shopping gets a lot faster when you can just{" "}
            <span className="text-orange-400">ask</span>.
          </h2>

          <p className="text-slate-400 mt-4 max-w-lg leading-relaxed">
            No filters to click through. Tell the assistant what you want in
            your own words — budget, size, use-case — and it searches the
            catalog, compares options, and recommends on the spot.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <span className="text-sm text-slate-300 bg-white/5 border border-white/10 px-3.5 py-2 rounded-lg">
              "gifts for my mom under ₹1500"
            </span>
            <span className="text-sm text-slate-300 bg-white/5 border border-white/10 px-3.5 py-2 rounded-lg">
              "best laptop for editing"
            </span>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Look for the chat icon in the corner — it's with you on every page.
          </p>
        </div>

        {/* Mock chat preview */}
        <div className="relative bg-slate-800/60 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-none">
                Shopzy Assistant
              </p>
              <p className="text-emerald-400 text-[11px] mt-1">● Online</p>
            </div>
          </div>

          <div className="space-y-3 min-h-[220px]">
            <AnimatePresence mode="popLayout">
              {aiDemoMessages.slice(0, visibleCount).map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.from === "user"
                        ? "bg-orange-500 text-white rounded-br-sm"
                        : "bg-white/10 text-slate-100 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

// ============================================================
// HOME
// ============================================================

const Home = () => {
  const dispatch = useDispatch();

  const {
    products = [],
    loading,
    error,
  } = useSelector((state) => state.product || {});

  useEffect(() => {
    dispatch(getProducts({ page: 1 }));
  }, [dispatch]);

  const handleAddToCart = (product) => {
    dispatch(addItemToCart({ id: product._id, quantity: 1 }));
  };

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="bg-white text-slate-900">
      {/* ===================== TOP MARQUEE ===================== */}
      <TopMarquee />

      {/* ===================== FULL-WIDTH IMAGE SLIDER ===================== */}
      <ImageSlider />

      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 lg:py-24">
          <motion.div
            variants={heroContainer}
            initial="hidden"
            animate="show"
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* LEFT */}
            <div>
              <motion.div
                variants={heroItem}
                className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                Smart shopping, powered by AI
              </motion.div>

              <motion.h1
                variants={heroItem}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-slate-900"
              >
                Everything you need.
                <span className="block text-orange-500 mt-2">
                  All in one cart.
                </span>
              </motion.h1>

              <motion.p
                variants={heroItem}
                className="mt-6 text-lg text-slate-600 max-w-xl leading-relaxed"
              >
                Discover trending products, explore premium collections, and
                shop faster with an assistant that actually understands what
                you're looking for.
              </motion.p>

              <motion.div variants={heroItem} className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-7 py-3.5 rounded-xl font-bold shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Shop Now <ArrowRight size={17} />
                </Link>

                <a
                  href="#featured"
                  className="inline-flex items-center justify-center border border-slate-300 hover:border-orange-400 hover:text-orange-500 bg-white px-7 py-3.5 rounded-xl font-bold transition-all duration-200"
                >
                  Explore Products
                </a>
              </motion.div>

              <motion.div variants={heroItem} className="mt-10 flex flex-wrap gap-8">
                {[
                  ["10K+", "Products"],
                  ["4.8/5", "Customer Rating"],
                  ["24/7", "AI Support"],
                ].map(([stat, label]) => (
                  <div key={label}>
                    <p className="text-2xl font-black text-slate-900">{stat}</p>
                    <p className="text-sm text-slate-500">{label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT */}
            <motion.div variants={heroItem} className="relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-70" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-70" />

              <div className="relative bg-slate-900 rounded-[2rem] p-8 sm:p-10 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/20 rounded-full blur-2xl" />

                <div className="relative">
                  <p className="text-orange-400 font-semibold text-sm uppercase tracking-widest">
                    Shopzy
                  </p>

                  <h2 className="text-white text-3xl sm:text-4xl font-black mt-4 leading-tight">
                    Shop smarter.
                    <br />
                    Live better.
                  </h2>

                  <p className="text-slate-400 mt-4 leading-relaxed">
                    Electronics, fashion, footwear, beauty, gaming and
                    everything your lifestyle needs — found instantly with AI
                    search.
                  </p>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                      <ShieldCheck size={24} className="text-orange-400" />
                      <p className="text-white font-bold mt-3">Easy Shopping</p>
                      <p className="text-slate-500 text-xs mt-1">Simple & secure</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                      <Truck size={24} className="text-orange-400" />
                      <p className="text-white font-bold mt-3">Fast Delivery</p>
                      <p className="text-slate-500 text-xs mt-1">At your doorstep</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===================== CATEGORIES ===================== */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="py-16"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
                Explore
              </p>
              <h2 className="text-3xl sm:text-4xl font-black mt-2">
                Shop by Category
              </h2>
            </div>

            <Link
              to="/products"
              className="hidden sm:block text-sm font-bold text-orange-500 hover:text-orange-600"
            >
              View All →
            </Link>
          </div>

          <motion.div
            variants={gridContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4"
          >
            {categories.map((category) => (
              <motion.div key={category.name} variants={gridItem}>
                <Link
                  to={`/products?category=${encodeURIComponent(category.name)}`}
                  className="group block bg-white border border-slate-200 rounded-2xl overflow-hidden text-center hover:border-orange-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-square bg-slate-50 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="py-3 font-bold text-slate-900 text-sm">
                    {category.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ===================== PREMIUM COLLECTION BANNER ===================== */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="py-4"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <Link
            to="/products"
            className="group relative block rounded-3xl overflow-hidden shadow-xl"
          >
            <img
              src="/perimum_collection.png"
              alt="Premium Collection"
              className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-14 max-w-xl">
              <p className="text-orange-300 font-semibold text-sm uppercase tracking-widest">
                New In
              </p>
              <h2 className="text-white text-3xl sm:text-4xl font-black mt-2 leading-tight">
                The Premium Collection
              </h2>
              <p className="text-slate-200 mt-3 leading-relaxed">
                Curated picks across every category — quality that stands out.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-white font-bold w-fit">
                Discover the collection <ArrowRight size={17} />
              </span>
            </div>
          </Link>
        </div>
      </motion.section>

      {/* ===================== AI ASSISTANT SPOTLIGHT ===================== */}
      <AISpotlight />

      {/* ===================== FEATURED PRODUCTS ===================== */}
      <section id="featured" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
                Featured Collection
              </p>
              <h2 className="text-3xl sm:text-4xl font-black mt-2">
                Trending Products
              </h2>
              <p className="text-slate-500 mt-2">
                Handpicked products from our latest collection.
              </p>
            </div>

            <Link
              to="/products"
              className="hidden sm:block font-bold text-orange-500 hover:text-orange-600"
            >
              View All Products →
            </Link>
          </div>

          {/* LOADING SKELETON */}
          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="h-64 bg-slate-200" />
                  <div className="p-5">
                    <div className="h-3 bg-slate-200 rounded w-20" />
                    <div className="h-5 bg-slate-200 rounded mt-4" />
                    <div className="h-5 bg-slate-200 rounded mt-2 w-3/4" />
                    <div className="h-7 bg-slate-200 rounded mt-6 w-24" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ERROR STATE */}
          {!loading && error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <p className="text-red-600 font-semibold">{error}</p>
              <button
                onClick={() => dispatch(getProducts({ page: 1 }))}
                className="mt-4 bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* PRODUCT GRID */}
          {!loading && !error && featuredProducts.length > 0 && (
            <motion.div
              variants={gridContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </motion.div>
          )}

          {/* EMPTY STATE */}
          {!loading && !error && featuredProducts.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-xl font-bold">No products available</h3>
              <p className="text-slate-500 mt-2">
                Products will appear here once they are added.
              </p>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-orange-500 font-bold"
            >
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== WHY SHOPZY ===================== */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="py-16 bg-slate-50"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
              Why Shopzy
            </p>
            <h2 className="text-3xl sm:text-4xl font-black mt-2">
              Built for a better shopping experience
            </h2>
            <p className="text-slate-500 mt-4">
              Everything you need for a simple, reliable and modern online
              shopping experience.
            </p>
          </div>

          <motion.div
            variants={gridContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  variants={gridItem}
                  className="bg-white border border-slate-200 rounded-2xl p-7 hover:border-orange-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                    <Icon size={22} className="text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold mt-5">{f.title}</h3>
                  <p className="text-slate-500 mt-2 leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* ===================== FINAL CTA ===================== */}
      <section className="py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />

        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto px-5 text-center"
        >
          <p className="text-orange-400 font-bold uppercase tracking-widest text-sm">
            Start Shopping
          </p>

          <h2 className="text-3xl sm:text-5xl font-black text-white mt-3">
            Your next favourite product
            <span className="text-orange-400"> is waiting.</span>
          </h2>

          <p className="text-slate-400 mt-5 max-w-2xl mx-auto">
            Explore our collection and find products you'll love.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 mt-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-orange-900/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            Explore Products <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;