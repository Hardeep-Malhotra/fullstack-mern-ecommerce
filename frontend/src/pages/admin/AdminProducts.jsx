import { useEffect, useState, useMemo } from "react";
import axios from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
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
  AlertTriangle,
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

  // Delete confirm state
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
    });
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
    setImagePreviews(
      product.images ? product.images.map((img) => img.url || img) : [],
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditProduct(null);
  };

  // Image Selection & Preview
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    setImageFiles(selectedFiles);
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const data = new FormData();

      data.append("name", formData.name.trim());
      data.append("description", formData.description.trim());
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("category", formData.category.trim());

      if (Array.isArray(imageFiles) && imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          if (file instanceof File) {
            data.append("images", file);
          }
        });
      }

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (editProduct) {
        const res = await axios.put(
          `/admin/products/${editProduct._id}`,
          data,
          config,
        );

        if (res.data?.success) {
          toast.success("Product updated successfully!");
          await handleManualRefresh();
          closeModal();
        }
      } else {
        const res = await axios.post("/admin/products", data, config);

        if (res.data?.success) {
          toast.success("Product created successfully!");
          await handleManualRefresh();
          closeModal();
        }
      }
    } catch (err) {
      console.error("STATUS:", err.response?.status);
      console.error("BACKEND RESPONSE:", err.response?.data);

      const message = err.response?.data?.message || "Product operation failed";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================================
  // DELETE PRODUCT (now via confirm modal, not window.confirm)
  // ==========================================================
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setDeleteLoading(true);
      const { data } = await axios.delete(
        `/admin/products/${productToDelete._id}`,
      );
      if (data.success) {
        setProducts((prev) =>
          prev.filter((p) => p._id !== productToDelete._id),
        );
        toast.success("Product deleted successfully");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleteLoading(false);
      setProductToDelete(null);
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
      const matchesCat =
        selectedCategory === "All" || p.category === selectedCategory;
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
            <div
              key={i}
              className="h-12 bg-slate-100 animate-pulse rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <AlertCircle size={40} className="text-red-500 mb-3" />
        <h2 className="text-xl font-bold text-slate-800">
          Error Loading Products
        </h2>
        <p className="text-slate-500 text-sm mt-1 mb-4">{error}</p>
        <button
          onClick={handleManualRefresh}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-200 transition-all duration-200"
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
          <h1 className="text-2xl font-bold text-slate-900">
            Product Management
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Add, edit, manage stock, and delete store products
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-xl bg-white text-slate-700 font-medium hover:border-orange-300 hover:text-orange-600 disabled:opacity-50 transition-colors duration-200 shadow-sm"
            onClick={handleManualRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-200 transition-shadow duration-200"
            onClick={openAddModal}
          >
            <Plus size={18} /> Add Product
          </motion.button>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 w-full sm:w-80 shadow-sm focus-within:ring-2 focus-within:ring-orange-100 focus-within:border-orange-400 transition-colors">
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
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 shadow-sm cursor-pointer transition-colors"
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
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-orange-50/40 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
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
                    <td
                      colSpan="5"
                      className="py-12 text-center text-slate-400"
                    >
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
                      className="hover:bg-orange-50/20 transition-colors duration-150"
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
                              ID: #{p._id ? p._id.slice(-6) : "N/A"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 bg-orange-50 text-orange-600 rounded-md text-xs font-medium">
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
                            className="p-1.5 rounded-md bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors duration-200"
                            onClick={() => openEditModal(p)}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
                            onClick={() => setProductToDelete(p)}
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

      {/* ADD/EDIT MODAL */}
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
                    maxLength={100}
                    disabled={submitting}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-colors disabled:opacity-60 disabled:bg-slate-50 disabled:cursor-not-allowed"
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
                      disabled={submitting}
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-colors disabled:opacity-60 disabled:bg-slate-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      required
                      disabled={submitting}
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-colors disabled:opacity-60 disabled:bg-slate-50 disabled:cursor-not-allowed"
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
                    disabled={submitting}
                    placeholder="e.g. Electronics, Footwear"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-colors disabled:opacity-60 disabled:bg-slate-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    required
                    disabled={submitting}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-colors disabled:opacity-60 disabled:bg-slate-50 disabled:cursor-not-allowed"
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
                      disabled={submitting}
                      onChange={handleImageChange}
                      hidden
                    />
                    <label
                      htmlFor="product-images"
                      className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl transition-colors duration-200 ${
                        submitting
                          ? "border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed pointer-events-none"
                          : "border-orange-200 bg-orange-50/40 hover:bg-orange-50 cursor-pointer text-orange-500"
                      }`}
                    >
                      <Upload size={22} className="mb-1" />
                      <span className="text-xs font-medium">
                        Click to Upload Images
                      </span>
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
                          className={`w-12 h-12 object-cover rounded-lg border border-slate-200 transition-opacity ${
                            submitting ? "opacity-50" : "opacity-100"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={submitting}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-200 disabled:opacity-50 transition-all duration-200 text-sm flex items-center gap-2"
                  >
                    {submitting && (
                      <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    )}
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

      {/* DELETE CONFIRM MODAL — replaces window.confirm / alert */}
      <AnimatePresence>
        {productToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !deleteLoading && setProductToDelete(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 z-10"
            >
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                  <AlertTriangle size={20} />
                </div>
                <button
                  onClick={() => !deleteLoading && setProductToDelete(null)}
                  className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <h2 className="text-lg font-bold text-gray-900 mt-4">
                Delete this product?
              </h2>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                <span className="font-semibold text-gray-700">
                  {productToDelete?.name}
                </span>{" "}
                will be permanently removed from the store. This action cannot
                be undone.
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setProductToDelete(null)}
                  disabled={deleteLoading}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 disabled:opacity-50 transition-all shadow-sm"
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminProducts;
