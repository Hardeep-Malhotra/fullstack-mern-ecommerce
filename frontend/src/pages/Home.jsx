import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../redux/slices/productSlice";
// Assuming you have a cart slice action
// import { addToCart } from "../redux/slices/cartSlice"; 

const categories = [
  { name: "Electronics", icon: "💻", description: "Latest tech & gadgets" },
  { name: "Fashion", icon: "👕", description: "Style for every day" },
  { name: "Footwear", icon: "👟", description: "Step up your style" },
  { name: "Beauty", icon: "✨", description: "Beauty essentials" },
  { name: "Gaming", icon: "🎮", description: "Level up your setup" },
  { name: "Home", icon: "🏠", description: "Make it feel like home" },
  { name: "Accessories", icon: "⌚", description: "Complete your look" },
];

const features = [
  {
    icon: "🔒",
    title: "Secure Shopping",
    desc: "Bank-grade encryption on every order and login, your data always protected.",
  },
  {
    icon: "🚚",
    title: "Fast Delivery",
    desc: "Real-time tracking from checkout to doorstep, most orders in 2-4 days.",
  },
  {
    icon: "🤖",
    title: "AI Support 24/7",
    desc: "Ask in plain language and get instant help finding the right product.",
  },
];

const ProductCard = ({ product, index, onAddToCart }) => {
  const image = product?.images?.[0]?.url;

  return (
    <div
      style={{ animationDelay: `${index * 80}ms` }}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-orange-200 hover:-translate-y-1 transition-all duration-300 animate-[fadeUp_0.5s_ease-out_backwards] flex flex-col justify-between"
    >
      <div>
        <div className="relative h-64 bg-slate-50 flex items-center justify-center overflow-hidden">
          <Link to={`/product/${product._id}`} className="w-full h-full">
            {image ? (
              <img
                src={image}
                alt={product.name || "Product"}
                className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                No Image Available
              </div>
            )}
          </Link>

          {Number(product.ratings) > 0 && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm text-xs font-semibold text-slate-700">
              ⭐ {product.ratings}
            </div>
          )}

          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-4 right-4 bg-red-50 text-red-600 px-2.5 py-1 rounded-full text-xs font-semibold">
              Only {product.stock} left
            </div>
          )}

          {product.stock === 0 && (
            <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Out of Stock
            </div>
          )}
        </div>

        <div className="p-5">
          <p className="text-xs uppercase tracking-wider font-semibold text-orange-500 mb-2">
            {product.category}
          </p>

          <Link to={`/product/${product._id}`}>
            <h3 className="font-bold text-slate-900 line-clamp-2 min-h-[48px] group-hover:text-orange-500 transition-colors">
              {product.name}
            </h3>
          </Link>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xl font-extrabold text-slate-900">
              ₹{Number(product.price || 0).toLocaleString("en-IN")}
            </p>

            <button
              disabled={product.stock === 0}
              onClick={() => onAddToCart(product)}
              title="Add to Cart"
              className="w-9 h-9 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🛒
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    // dispatch(addToCart({ product, quantity: 1 }));
    console.log("Added to cart:", product);
  };

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="bg-slate-50 text-slate-900">
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT */}
            <div className="animate-[fadeUp_0.6s_ease-out]">
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                Smart shopping, powered by AI
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-slate-900">
                Everything you need.
                <span className="block text-orange-500 mt-2">
                  All in one cart.
                </span>
              </h1>

              <p className="mt-6 text-lg text-slate-600 max-w-xl leading-relaxed">
                Discover trending products, explore premium collections, and
                enjoy a smarter shopping experience with{" "}
                <span className="font-semibold text-slate-800">Shopzy AI</span>.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-7 py-3.5 rounded-xl font-bold shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Shop Now <span>→</span>
                </Link>

                <a
                  href="#featured"
                  className="inline-flex items-center justify-center border border-slate-300 hover:border-orange-400 hover:text-orange-500 bg-white px-7 py-3.5 rounded-xl font-bold transition-all duration-200"
                >
                  Explore Products
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-8">
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
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative animate-[fadeUp_0.6s_ease-out_0.1s_backwards]">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-70"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-70"></div>

              <div className="relative bg-slate-900 rounded-[2rem] p-8 sm:p-10 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/20 rounded-full blur-2xl"></div>

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
                      <div className="text-3xl">🛍️</div>
                      <p className="text-white font-bold mt-3">Easy Shopping</p>
                      <p className="text-slate-500 text-xs mt-1">
                        Simple & secure
                      </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                      <div className="text-3xl">⚡</div>
                      <p className="text-white font-bold mt-3">Fast Delivery</p>
                      <p className="text-slate-500 text-xs mt-1">
                        At your doorstep
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CATEGORIES ===================== */}
      <section className="py-16">
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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {categories.map((category, i) => (
              <Link
                key={category.name}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                style={{ animationDelay: `${i * 60}ms` }}
                className="group bg-white border border-slate-200 rounded-2xl p-5 text-center hover:border-orange-300 hover:shadow-lg transition-all duration-300 animate-[fadeUp_0.5s_ease-out_backwards]"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-50 flex items-center justify-center text-2xl group-hover:bg-orange-500 group-hover:scale-110 transition-all duration-300">
                  {category.icon}
                </div>

                <h3 className="mt-4 font-bold text-slate-900 text-sm">
                  {category.name}
                </h3>

                <p className="text-xs text-slate-400 mt-1 hidden lg:block">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== AI HIGHLIGHT ===================== */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 sm:px-12 py-12 shadow-xl shadow-orange-200">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative flex flex-col lg:flex-row items-center gap-8 text-center lg:text-left">
              <div className="w-20 h-20 shrink-0 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-4xl">
                🤖
              </div>

              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Search naturally. Shop instantly.
                </h2>

                <p className="text-orange-50 mt-2 max-w-2xl">
                  Just type what you're looking for — "affordable running shoes
                  under ₹2000" — and our AI finds the closest match, with smart
                  recommendations tailored to you.
                </p>
              </div>

              <Link
                to="/products"
                className="shrink-0 inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-orange-50 transition-colors"
              >
                Try AI Search →
              </Link>
            </div>
          </div>
        </div>
      </section>

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
                  <div className="h-64 bg-slate-200"></div>
                  <div className="p-5">
                    <div className="h-3 bg-slate-200 rounded w-20"></div>
                    <div className="h-5 bg-slate-200 rounded mt-4"></div>
                    <div className="h-5 bg-slate-200 rounded mt-2 w-3/4"></div>
                    <div className="h-7 bg-slate-200 rounded mt-6 w-24"></div>
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

          {/* PRODUCT LIST */}
          {!loading && !error && featuredProducts.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, i) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  index={i}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && !error && featuredProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🛍️</div>
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
      <section className="py-16 bg-slate-50">
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

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                style={{ animationDelay: `${i * 100}ms` }}
                className="bg-white border border-slate-200 rounded-2xl p-7 hover:border-orange-200 hover:shadow-lg transition-all duration-300 animate-[fadeUp_0.5s_ease-out_backwards]"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl">
                  {f.icon}
                </div>

                <h3 className="text-xl font-bold mt-5">{f.title}</h3>
                <p className="text-slate-500 mt-2 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FINAL CTA ===================== */}
      <section className="py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto px-5 text-center">
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
            Explore Products <span>→</span>
          </Link>
        </div>
      </section>

      {/* Keyframe fallback */}
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;