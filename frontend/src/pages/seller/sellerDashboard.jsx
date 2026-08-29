import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";

const SellerDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalSoldItems: 0,
  });

  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH SELLER STATS
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const fetchSellerStats = async () => {
      try {
        console.log("🟠 SELLER STATS API CALL");

        const response = await API.get("/seller/stats");

        console.log("🟢 SELLER STATS RESPONSE:", response.data);

        if (!mounted) return;

        if (response.data?.success) {
          setStats({
            totalRevenue: Number(
              response.data.stats?.totalRevenue || 0
            ),
            totalOrders: Number(
              response.data.stats?.totalOrders || 0
            ),
            totalProducts: Number(
              response.data.stats?.totalProducts || 0
            ),
            totalSoldItems: Number(
              response.data.stats?.totalSoldItems || 0
            ),
          });
        }
      } catch (error) {
        console.error(
          "🔴 SELLER STATS ERROR:",
          error
        );

        console.error(
          "🔴 RESPONSE:",
          error.response?.data
        );

        if (mounted) {
          toast.error(
            error.response?.data?.message ||
              "Failed to load seller stats"
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchSellerStats();

    return () => {
      mounted = false;
    };
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading Seller Analytics...
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Seller Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Overview of your store performance and sales.
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

          {/* REVENUE */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Revenue
            </p>

            <h3 className="mt-2 text-2xl font-bold text-emerald-600">
              ₹{stats.totalRevenue.toLocaleString("en-IN")}
            </h3>
          </div>

          {/* ORDERS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Orders
            </p>

            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              {stats.totalOrders}
            </h3>
          </div>

          {/* PRODUCTS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Listed Products
            </p>

            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              {stats.totalProducts}
            </h3>
          </div>

          {/* UNITS SOLD */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Units Sold
            </p>

            <h3 className="mt-2 text-2xl font-bold text-orange-600">
              {stats.totalSoldItems}
            </h3>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;