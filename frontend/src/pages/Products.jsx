import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../redux/slices/productSlice";

const Products = () => {
  const dispatch = useDispatch();

  const {
    products,
    loading,
    error,
  } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">
        All Products
      </h1>

      <p className="text-slate-500 mt-2">
        Explore our latest products
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm"
          >
            <img
              src={product.images?.[0]?.url}
              alt={product.name}
              className="w-full h-56 object-contain bg-slate-50"
            />

            <div className="p-4">
              <p className="text-xs text-indigo-600 font-semibold uppercase">
                {product.category}
              </p>

              <h2 className="mt-1 font-semibold text-slate-900 line-clamp-2">
                {product.name}
              </h2>

              <p className="mt-3 text-xl font-bold text-slate-900">
                ₹{product.price.toLocaleString("en-IN")}
              </p>

              <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
                View Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;