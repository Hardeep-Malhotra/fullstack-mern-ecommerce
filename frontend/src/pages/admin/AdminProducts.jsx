import { useEffect, useState, useMemo } from "react";
import axios from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  RefreshCw,
  X,
  AlertCircle,
  PackageX,
  Upload,
} from "lucide-react";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Fetch Products (Initial Mount)
  useEffect(() => {
    let isMounted = true;

    axios
      .get("/products")
      .then(({ data }) => {
        if (isMounted) {
          if (data.success || Array.isArray(data)) {
            setProducts(data.products || data || []);
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Fetch products error:", err);
          setError(err.response?.data?.message || "Failed to fetch products");
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
          setRefreshing(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Manual Refresh Handler
  const handleManualRefresh = async () => {
    try {
      setRefreshing(true);
      setError("");
      const { data } = await axios.get("/products");
      if (data.success || Array.isArray(data)) {
        setProducts(data.products || data || []);
      }
    } catch (err) {
      console.error("Fetch products error:", err);
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  // Modal Handlers
  const openAddModal = () => {
    setEditProduct(null);
    setFormData({ name: "", description: "", price: "", stock: "", category: "" });
    setImageFiles([]);
    setImagePreviews([]);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
      category: product.category || "",
    });
    setImageFiles([]);
    setImagePreviews(product.images ? product.images.map((img) => img.url || img) : []);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditProduct(null);
  };

  // Image Selection & Preview
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Form Submit (Multer + Cloudinary Compatible)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("category", formData.category);

      imageFiles.forEach((file) => {
        data.append("images", file);
      });

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (editProduct) {
        const res = await axios.put(`/admin/product/${editProduct._id}`, data, config);
        if (res.data.success) {
          handleManualRefresh();
          closeModal();
        }
      } else {
        const res = await axios.post("/admin/product/new", data, config);
        if (res.data.success) {
          handleManualRefresh();
          closeModal();
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const { data } = await axios.delete(`/admin/product/${id}`);
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  // Filtered List
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, searchTerm, selectedCategory]);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="space-y-2">
          <div className="h-7 w-56 bg-slate-200 animate-pulse rounded-md" />
          <div className="h-4 w-72 bg-slate-200 animate-pulse rounded-md" />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-slate-100 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <AlertCircle size={40} className="text-red-500 mb-3" />
        <h2 className="text-xl font-bold text-slate-800">Error Loading Products</h2>
        <p className="text-slate-500 text-sm mt-1 mb-4">{error}</p>
        <button
          onClick={handleManualRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          <RefreshCw size={16} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 md:p-8 max-w-7xl mx-auto"
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Product Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Add, edit, manage stock, and delete store products
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 transition shadow-sm"
            onClick={handleManualRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-sm"
            onClick={openAddModal}
          >
            <Plus size={18} /> Add Product
          </motion.button>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 w-full sm:w-80 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-transparent border-none outline-none text-sm text-slate-800 placeholder-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              <AnimatePresence>
                {filteredProducts.length === 0 ? (
                  <tr key="no-products">
                    <td colSpan="5" className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <PackageX size={36} />
                        <p className="font-medium">No products found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <motion.tr
                      key={p._id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      layout
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              p.images && p.images[0]?.url
                                ? p.images[0].url
                                : p.images && p.images[0]
                                ? p.images[0]
                                : "https://via.placeholder.com/50"
                            }
                            alt={p.name}
                            className="w-11 h-11 object-cover rounded-lg bg-slate-100 border border-slate-200 shrink-0"
                          />
                          <div>
                            <strong className="block font-semibold text-slate-900 leading-tight">
                              {p.name}
                            </strong>
                            <span className="text-xs text-slate-400 font-mono">
                              ID: #{p._id.slice(-6)}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                          {p.category || "General"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        ₹{p.price}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            p.stock > 0
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {p.stock > 0 ? `${p.stock} units` : "Out of Stock"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1.5 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                            onClick={() => openEditModal(p)}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition"
                            onClick={() => handleDelete(p._id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD/EDIT MODAL WITH FRAMER MOTION */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h2 className="text-lg font-bold text-slate-900">
                  {editProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition"
                  onClick={closeModal}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Electronics, Footwear"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Product Images
                  </label>
                  <div>
                    <input
                      type="file"
                      id="product-images"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      hidden
                    />
                    <label
                      htmlFor="product-images"
                      className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer text-slate-500 transition"
                    >
                      <Upload size={22} className="mb-1" />
                      <span className="text-xs font-medium">Click to Upload Images</span>
                    </label>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {imagePreviews.map((src, idx) => (
                        <motion.img
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          key={idx}
                          src={src}
                          alt="Preview"
                          className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition text-sm"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition text-sm shadow-sm"
                  >
                    {submitting
                      ? "Saving..."
                      : editProduct
                      ? "Update Product"
                      : "Create Product"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminProducts;