import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../redux/slices/productSlice";

const categories = [
  {
    name: "Electronics",
    icon: "💻",
    description: "Latest tech & gadgets",
  },
  {
    name: "Fashion",
    icon: "👕",
    description: "Style for every day",
  },
  {
    name: "Footwear",
    icon: "👟",
    description: "Step up your style",
  },
  {
    name: "Beauty",
    icon: "✨",
    description: "Beauty essentials",
  },
  {
    name: "Gaming",
    icon: "🎮",
    description: "Level up your setup",
  },
  {
    name: "Home",
    icon: "🏠",
    description: "Make it feel like home",
  },
  {
    name: "Accessories",
    icon: "⌚",
    description: "Complete your look",
  },
];

const Home = () => {
  const dispatch = useDispatch();

  const { products = [], loading, error } = useSelector(
    (state) => state.product || {},
  );

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  useEffect(() => {
    dispatch(getProducts({ page: 1 }));
  }, [dispatch]);

  // ==========================================
  // FEATURED PRODUCTS
  // ==========================================

  const featuredProducts = products.slice(0, 4);

  // ==========================================
  // PRODUCT CARD
  // ==========================================

  const ProductCard = ({ product }) => {
    const image = product.images?.[0]?.url;

    return (
      <Link
        to={`/product/${product._id}`}
        className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        {/* Product Image */}
        <div className="relative h-64 bg-slate-50 flex items-center justify-center overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="text-slate-400 text-sm">
              No Image Available
            </div>
          )}

          {/* Rating */}
          {product.ratings > 0 && (
            <div className="absolute top-4 left-4 bg-white px-2.5 py-1 rounded-full shadow-sm text-xs font-semibold text-slate-700">
              ⭐ {product.ratings}
            </div>
          )}

          {/* Stock */}
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

        {/* Product Info */}
        <div className="p-5">
          <p className="text-xs uppercase tracking-wider font-semibold text-indigo-600 mb-2">
            {product.category}
          </p>

          <h3 className="font-bold text-slate-900 line-clamp-2 min-h-[48px] group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xl font-extrabold text-slate-900">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </p>

            <span className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              →
            </span>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="bg-slate-50 text-slate-900">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                Smarter shopping starts here
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-slate-900">
                Everything you need.
                <span className="block text-indigo-600 mt-2">
                  All in one cart.
                </span>
              </h1>

              <p className="mt-6 text-lg text-slate-600 max-w-xl leading-relaxed">
                Discover trending products, explore premium collections,
                and enjoy a smarter shopping experience with InfinityCart.
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all"
                >
                  Shop Now
                  <span>→</span>
                </Link>

                <a
                  href="#featured"
                  className="inline-flex items-center justify-center border border-slate-300 hover:border-indigo-600 hover:text-indigo-600 bg-white px-7 py-3.5 rounded-xl font-bold transition-all"
                >
                  Explore Products
                </a>
              </div>

              {/* Trust Stats */}
              <div className="mt-10 flex flex-wrap gap-8">
                <div>
                  <p className="text-2xl font-black text-slate-900">
                    10K+
                  </p>
                  <p className="text-sm text-slate-500">
                    Products
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-black text-slate-900">
                    4.8/5
                  </p>
                  <p className="text-sm text-slate-500">
                    Customer Rating
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-black text-slate-900">
                    24/7
                  </p>
                  <p className="text-sm text-slate-500">
                    Support
                  </p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-70"></div>

              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-70"></div>

              <div className="relative bg-slate-900 rounded-[2rem] p-8 sm:p-10 shadow-2xl overflow-hidden">
                
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/20 rounded-full blur-2xl"></div>

                <div className="relative">
                  <p className="text-indigo-400 font-semibold text-sm uppercase tracking-widest">
                    InfinityCart
                  </p>

                  <h2 className="text-white text-3xl sm:text-4xl font-black mt-4 leading-tight">
                    Shop smarter.
                    <br />
                    Live better.
                  </h2>

                  <p className="text-slate-400 mt-4 leading-relaxed">
                    Electronics, fashion, footwear, beauty, gaming and
                    everything your lifestyle needs.
                  </p>

                  <div className="mt-8 grid grid-cols-2 gap-4">

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                      <div className="text-3xl">🛍️</div>
                      <p className="text-white font-bold mt-3">
                        Easy Shopping
                      </p>
                      <p className="text-slate-500 text-xs mt-1">
                        Simple & secure
                      </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                      <div className="text-3xl">⚡</div>
                      <p className="text-white font-bold mt-3">
                        Fast Delivery
                      </p>
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

      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
                Explore
              </p>

              <h2 className="text-3xl sm:text-4xl font-black mt-2">
                Shop by Category
              </h2>
            </div>

            <Link
              to="/products"
              className="hidden sm:block text-sm font-bold text-indigo-600 hover:text-indigo-700"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">

            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${encodeURIComponent(
                  category.name,
                )}`}
                className="group bg-white border border-slate-200 rounded-2xl p-5 text-center hover:border-indigo-300 hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl group-hover:bg-indigo-600 group-hover:scale-105 transition-all">
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

      {/* =====================================================
          FEATURED PRODUCTS
      ===================================================== */}

      <section id="featured" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
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
              className="hidden sm:block font-bold text-indigo-600 hover:text-indigo-700"
            >
              View All Products →
            </Link>
          </div>

          {/* Loading */}
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

          {/* Error */}
          {!loading && error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <p className="text-red-600 font-semibold">
                {error}
              </p>

              <button
                onClick={() => dispatch(getProducts({ page: 1 }))}
                className="mt-4 bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Products */}
          {!loading && !error && featuredProducts.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && featuredProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🛍️</div>

              <h3 className="text-xl font-bold">
                No products available
              </h3>

              <p className="text-slate-500 mt-2">
                Products will appear here once they are added.
              </p>
            </div>
          )}

          {/* Mobile View All */}
          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-indigo-600 font-bold"
            >
              View All Products →
            </Link>
          </div>

        </div>
      </section>

      {/* =====================================================
          WHY INFINITYCART
      ===================================================== */}

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
              Why InfinityCart
            </p>

            <h2 className="text-3xl sm:text-4xl font-black mt-2">
              Built for a better shopping experience
            </h2>

            <p className="text-slate-500 mt-4">
              Everything you need for a simple, reliable and modern
              online shopping experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="bg-white border border-slate-200 rounded-2xl p-7">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl">
                🔒
              </div>

              <h3 className="text-xl font-bold mt-5">
                Secure Shopping
              </h3>

              <p className="text-slate-500 mt-2 leading-relaxed">
                Your account and shopping experience are protected
                with secure authentication.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-7">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl">
                🚚
              </div>

              <h3 className="text-xl font-bold mt-5">
                Fast Delivery
              </h3>

              <p className="text-slate-500 mt-2 leading-relaxed">
                Get your favourite products delivered quickly and
                conveniently.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-7">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl">
                💬
              </div>

              <h3 className="text-xl font-bold mt-5">
                Customer Support
              </h3>

              <p className="text-slate-500 mt-2 leading-relaxed">
                We're here to help whenever you need assistance
                with your orders.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-5 text-center">

          <p className="text-indigo-400 font-bold uppercase tracking-widest text-sm">
            Start Shopping
          </p>

          <h2 className="text-3xl sm:text-5xl font-black text-white mt-3">
            Your next favourite product
            <span className="text-indigo-400"> is waiting.</span>
          </h2>

          <p className="text-slate-400 mt-5 max-w-2xl mx-auto">
            Explore our collection and find products you'll love.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 mt-8 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-900/30"
          >
            Explore Products
            <span>→</span>
          </Link>

        </div>
      </section>

    </div>
  );
};

export default Home;