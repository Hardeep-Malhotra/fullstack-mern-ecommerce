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
  XCircle,
  AlertCircle,
  PackageX,
  Upload,
  AlertTriangle,
  LayoutGrid,
  List,
  Tag,
  IndianRupee,
  Boxes,
  Package,
  SlidersHorizontal,
  ImageOff,
} from "lucide-react";

// ============================================================
// SORT OPTIONS
// ============================================================
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "stock-asc", label: "Stock: Low to High" },
  { value: "stock-desc", label: "Stock: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

const gridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.15 } },
};

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  // Tracks which previews came from already-saved images (edit mode) vs new
  // local file picks, so we know which ones are just strings to drop and
  // which need their matching File removed from imageFiles too.
  const [existingImageCount, setExistingImageCount] = useState(0);

  const formatNumber = (value = 0) => Number(value || 0).toLocaleString("en-IN");

  // ==========================================================
  // FETCH SELLER PRODUCTS
  // ==========================================================

  const fetchSellerProducts = async (isRefresh = false) => {
    try {
      const { data } = await axios.get("/seller/products");

      if (data?.success) {
        setProducts(Array.isArray(data.products) ? data.products : []);
      } else {
        setProducts([]);
      }

      setError("");

      if (isRefresh) {
        toast.success("Products refreshed");
      }
    } catch (err) {
      console.error("Fetch seller products error:", err);

      setError(err.response?.data?.message || "Failed to fetch seller products");

      setProducts([]);
    }
  };

  // ==========================================================
  // INITIAL LOAD — kept inline in the effect (not calling the shared
  // fetchSellerProducts above) so no setState-calling function is invoked
  // directly from an effect body.
  // ==========================================================

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const { data } = await axios.get("/seller/products");

        if (!isMounted) return;

        if (data?.success) {
          setProducts(Array.isArray(data.products) ? data.products : []);
        } else {
          setProducts([]);
        }

        setError("");
      } catch (err) {
        if (!isMounted) return;

        console.error("Fetch seller products error:", err);
        setError(err.response?.data?.message || "Failed to fetch seller products");
        setProducts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // ==========================================================
  // MANUAL REFRESH
  // ==========================================================

  const handleManualRefresh = async () => {
    try {
      setRefreshing(true);
      setError("");
      await fetchSellerProducts(true);
    } catch (err) {
      console.error("Refresh seller products error:", err);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  // ==========================================================
  // ADD PRODUCT MODAL
  // ==========================================================

  const openAddModal = () => {
    setEditProduct(null);
    setFormData({ name: "", description: "", price: "", stock: "", category: "" });
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImageCount(0);
    setError("");
    setIsModalOpen(true);
  };

  // ==========================================================
  // EDIT PRODUCT MODAL
  // ==========================================================

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

    const existing = Array.isArray(product.images)
      ? product.images.map((img) => img?.url || img)
      : [];

    setImagePreviews(existing);
    setExistingImageCount(existing.length);

    setError("");
    setIsModalOpen(true);
  };

  // ==========================================================
  // CLOSE MODAL
  // ==========================================================

  const closeModal = () => {
    if (submitting) return;

    setIsModalOpen(false);
    setEditProduct(null);
    setFormData({ name: "", description: "", price: "", stock: "", category: "" });
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImageCount(0);
  };

  // ==========================================================
  // IMAGE CHANGE / REMOVE
  // ==========================================================

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    setImageFiles((prev) => [...prev, ...selectedFiles]);

    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    // Reset the input so picking the same file again still fires onChange
    e.target.value = "";
  };

  const removePreviewAt = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));

    // Only new (locally picked) previews live in imageFiles — those sit
    // after the existing-image previews in the combined array.
    if (index >= existingImageCount) {
      const fileIndex = index - existingImageCount;
      setImageFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    } else {
      setExistingImageCount((prev) => prev - 1);
    }
  };

  // ==========================================================
  // CREATE / UPDATE PRODUCT
  // ==========================================================

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
        const res = await axios.put(`/seller/products/${editProduct._id}`, data, config);

        if (res.data?.success) {
          toast.success("Product updated successfully!");
          await fetchSellerProducts();
          closeModal();
        }
      } else {
        const res = await axios.post("/seller/products", data, config);

        if (res.data?.success) {
          toast.success("Product created successfully!");
          await fetchSellerProducts();
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
  // DELETE PRODUCT
  // ==========================================================

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setDeleteLoading(true);

      const { data } = await axios.delete(`/seller/products/${productToDelete._id}`);

      if (data?.success) {
        setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
        toast.success("Product deleted successfully");
      }
    } catch (err) {
      console.error("Delete product error:", err);
      toast.error(err.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleteLoading(false);
      setProductToDelete(null);
    }
  };

  // ==========================================================
  // CATEGORIES
  // ==========================================================

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [products]);

  // ==========================================================
  // STATS
  // ==========================================================

  const stats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter((p) => Number(p.stock) > 0).length;
    const outOfStock = total - inStock;
    const categoryCount = new Set(products.map((p) => p.category).filter(Boolean)).size;

    return { total, inStock, outOfStock, categoryCount };
  }, [products]);

  // ==========================================================
  // SEARCH + CATEGORY FILTER + SORT
  // ==========================================================

  const filteredProducts = useMemo(() => {
    const search = searchTerm.toLowerCase();

    const filtered = products.filter((p) => {
      const matchesSearch =
        p.name?.toLowerCase().includes(search) || p.category?.toLowerCase().includes(search);

      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    const sorted = [...filtered];

    switch (sortOption) {
      case "price-asc":
        sorted.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        break;
      case "price-desc":
        sorted.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        break;
      case "stock-asc":
        sorted.sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0));
        break;
      case "stock-desc":
        sorted.sort((a, b) => Number(b.stock || 0) - Number(a.stock || 0));
        break;
      case "name-asc":
        sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      default:
        break; // "newest" — keep API order as-is
    }

    return sorted;
  }, [products, searchTerm, selectedCategory, sortOption]);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        <div className="space-y-2">
          <div className="h-7 w-56 bg-slate-200 animate-pulse rounded-md" />
          <div className="h-4 w-72 bg-slate-200 animate-pulse rounded-md" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white border border-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-64 bg-white border border-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error && products.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-4">
          <AlertCircle size={30} className="text-red-500" />
        </div>

        <h2 className="text-xl font-bold text-slate-800">Error Loading Products</h2>
        <p className="text-slate-500 text-sm mt-1 mb-5">{error}</p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleManualRefresh}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-200 transition-all duration-200"
        >
          <RefreshCw size={16} />
          Try Again
        </motion.button>
      </div>
    );
  }

  // ==========================================================
  // MAIN UI
  // ==========================================================

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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-200">
              <Package size={23} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Product Management
            </h1>
          </div>

          <p className="text-sm text-slate-500 mt-1 ml-[3.25rem]">
            Add, edit, manage stock, and delete your products
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
            <Plus size={18} />
            Add Product
          </motion.button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Products", value: stats.total, icon: Boxes, tint: "orange" },
          { label: "In Stock", value: stats.inStock, icon: Package, tint: "emerald" },
          { label: "Out of Stock", value: stats.outOfStock, icon: PackageX, tint: "rose" },
          { label: "Categories", value: stats.categoryCount, icon: Tag, tint: "amber" },
        ].map((card) => {
          const Icon = card.icon;
          const tints = {
            orange: "bg-orange-50 text-orange-600 border-orange-100",
            emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
            rose: "bg-rose-50 text-rose-600 border-rose-100",
            amber: "bg-amber-50 text-amber-600 border-amber-100",
          };

          return (
            <div
              key={card.label}
              className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3"
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${tints[card.tint]}`}>
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-black text-slate-900 leading-none">{formatNumber(card.value)}</p>
                <p className="text-[11px] font-semibold text-slate-400 mt-1 truncate">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 w-full lg:w-80 shadow-sm focus-within:ring-2 focus-within:ring-orange-100 focus-within:border-orange-400 transition-colors">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-transparent border-none outline-none text-sm text-slate-800 placeholder-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 shadow-sm cursor-pointer transition-colors"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
          <SlidersHorizontal size={15} className="text-slate-400 shrink-0" />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-slate-700 cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:ml-auto flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm self-start">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === "grid" ? "bg-orange-500 text-white" : "text-slate-400 hover:text-slate-600"
            }`}
            title="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === "table" ? "bg-orange-500 text-white" : "text-slate-400 hover:text-slate-600"
            }`}
            title="Table view"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* EMPTY STATE */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl py-20 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
            <PackageX size={26} className="text-slate-400" />
          </div>
          <p className="font-semibold text-slate-700">No products found</p>
          <p className="text-xs text-slate-400 mt-1">
            {products.length === 0
              ? "You haven't added any products yet."
              : "Try a different search term or category."}
          </p>
          {products.length === 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openAddModal}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-orange-200 transition-all duration-200"
            >
              <Plus size={16} />
              Add your first product
            </motion.button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        // ================================================
        // GRID VIEW
        // ================================================
        <motion.div
          variants={gridVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((p) => {
              const image =
                p.images && p.images[0]?.url ? p.images[0].url : p.images && p.images[0] ? p.images[0] : null;

              const inStock = Number(p.stock) > 0;

              return (
                <motion.div
                  key={p._id}
                  layout
                  variants={cardVariants}
                  exit="exit"
                  className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="relative aspect-square bg-slate-50">
                    {image ? (
                      <img src={image} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ImageOff size={28} />
                      </div>
                    )}

                    <span
                      className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        inStock
                          ? "bg-emerald-50/95 text-emerald-700 border-emerald-200"
                          : "bg-rose-50/95 text-rose-700 border-rose-200"
                      }`}
                    >
                      {inStock ? `${p.stock} in stock` : "Out of stock"}
                    </span>

                    <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded-lg bg-white/95 text-orange-600 hover:bg-orange-500 hover:text-white shadow-sm transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setProductToDelete(p)}
                        className="p-1.5 rounded-lg bg-white/95 text-rose-600 hover:bg-rose-500 hover:text-white shadow-sm transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5">
                    <span className="inline-block px-2 py-0.5 bg-orange-50 text-orange-600 rounded-md text-[10px] font-bold uppercase tracking-wide mb-1.5">
                      {p.category || "General"}
                    </span>

                    <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
                      {p.name}
                    </h3>

                    <div className="flex items-center justify-between mt-2">
                      <span className="flex items-center text-sm font-bold text-slate-900">
                        <IndianRupee size={13} className="mr-0.5" />
                        {formatNumber(p.price)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        #{p._id ? p._id.slice(-6) : "N/A"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        // ================================================
        // TABLE VIEW
        // ================================================
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
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((p) => (
                    <motion.tr
                      key={p._id}
                      layout
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
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
                        ₹{formatNumber(p.price)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            p.stock > 0 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
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
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================
          ADD / EDIT MODAL
      ====================================================== */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 rounded-t-2xl" />

              <div className="p-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <h2 className="text-lg font-bold text-slate-900">
                    {editProduct ? "Edit Product" : "Add New Product"}
                  </h2>
                  <button
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition"
                    onClick={closeModal}
                    disabled={submitting}
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
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-colors disabled:opacity-60 disabled:bg-slate-50"
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
                        min="0"
                        disabled={submitting}
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-colors disabled:opacity-60"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        disabled={submitting}
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-colors disabled:opacity-60"
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
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-colors disabled:opacity-60"
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
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-colors disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Product Images
                    </label>

                    <input
                      type="file"
                      id="seller-product-images"
                      multiple
                      accept="image/*"
                      disabled={submitting}
                      onChange={handleImageChange}
                      hidden
                    />

                    <label
                      htmlFor="seller-product-images"
                      className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl transition-colors duration-200 ${
                        submitting
                          ? "border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed pointer-events-none"
                          : "border-orange-200 bg-orange-50/40 hover:bg-orange-50 cursor-pointer text-orange-500"
                      }`}
                    >
                      <Upload size={22} className="mb-1" />
                      <span className="text-xs font-medium">Click to Upload Images</span>
                    </label>

                    {imagePreviews.length > 0 && (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <AnimatePresence>
                          {imagePreviews.map((src, idx) => (
                            <motion.div
                              key={src + idx}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="relative group"
                            >
                              <img
                                src={src}
                                alt="Preview"
                                className={`w-14 h-14 object-cover rounded-lg border border-slate-200 ${
                                  submitting ? "opacity-50" : ""
                                }`}
                              />
                              {!submitting && (
                                <button
                                  type="button"
                                  onClick={() => removePreviewAt(idx)}
                                  className="absolute -top-1.5 -right-1.5 bg-white rounded-full shadow-sm text-rose-500 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Remove image"
                                >
                                  <XCircle size={18} />
                                </button>
                              )}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      disabled={submitting}
                      className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors text-sm disabled:opacity-50"
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
                      {submitting ? "Saving..." : editProduct ? "Update Product" : "Create Product"}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================
          DELETE MODAL
      ====================================================== */}
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

              <h2 className="text-lg font-bold text-gray-900 mt-4">Delete this product?</h2>

              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                <span className="font-semibold text-gray-700">{productToDelete?.name}</span> will be
                permanently removed from your store. This action cannot be undone.
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

export default SellerProducts;