import { useEffect, useState, useCallback } from "react";
import axios from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Zap,
  Database,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Clock,
  Ban,
} from "lucide-react";

const SystemHealth = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastChecked, setLastChecked] = useState(null);

  const fetchHealth = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const { data } = await axios.get("/admin/system-health");
      if (data.success) {
        setHealth(data.services);
        setLastChecked(new Date());
        setError("");
      }
    } catch (err) {
      console.error("System health fetch error:", err);
      setError(err.response?.data?.message || "Failed to fetch system health");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 0ms timeout puts the execution in the event queue, preventing synchronous setState inside effect
    const timer = setTimeout(() => {
      fetchHealth(true);
    }, 0);

    // Auto-refresh every 15 seconds
    const interval = setInterval(() => fetchHealth(true), 15000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [fetchHealth]);

  const getStatusStyle = (status) => {
    if (status?.includes("HEALTHY") || status === "CONNECTED") {
      return {
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
        icon: <CheckCircle2 size={16} />,
        dot: "bg-emerald-500",
      };
    }
    if (status?.includes("RECOVERING")) {
      return {
        badge: "bg-amber-50 text-amber-700 border-amber-200/60",
        icon: <AlertTriangle size={16} />,
        dot: "bg-amber-500",
      };
    }
    return {
      badge: "bg-red-50 text-red-700 border-red-200/60",
      icon: <XCircle size={16} />,
      dot: "bg-red-500",
    };
  };

  if (loading && !health) {
    return (
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
        <div className="h-7 w-56 bg-slate-200 animate-pulse rounded-md" />
        <div className="grid sm:grid-cols-2 gap-5">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-40 bg-slate-100 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error && !health) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8">
        <XCircle size={40} className="text-red-500 mb-3" />
        <h2 className="text-xl font-bold text-slate-800">
          Unable to Load System Health
        </h2>
        <p className="text-slate-500 text-sm mt-1 mb-4">{error}</p>
        <button
          onClick={() => fetchHealth()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-200 transition-all duration-200"
        >
          <RefreshCw size={16} /> Try Again
        </button>
      </div>
    );
  }

  const razorpay = health?.razorpayGateway;
  const db = health?.database;
  const razorpayStyle = getStatusStyle(razorpay?.status);
  const dbStyle = getStatusStyle(db?.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 md:p-8 max-w-5xl mx-auto"
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-200">
            <Activity size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">System Health</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Live status of critical services
              {lastChecked && (
                <span className="text-slate-400">
                  {" "}
                  • Updated {lastChecked.toLocaleTimeString("en-IN")}
                </span>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchHealth()}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-xl bg-white text-slate-700 font-medium hover:border-orange-300 hover:text-orange-600 disabled:opacity-50 transition-colors duration-200 shadow-sm self-start sm:self-auto"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* SERVICE CARDS */}
      <div className="grid sm:grid-cols-2 gap-5 mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={razorpay?.status}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-orange-100 transition-shadow duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Razorpay Gateway
                  </h3>
                  <p className="text-xs text-slate-400">Payment processing</p>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${razorpayStyle.badge}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${razorpayStyle.dot} animate-pulse`}
                />
                {razorpay?.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center shrink-0">
                  <Activity size={13} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Total Fires
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {razorpay?.stats?.totalFires ?? 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <TrendingUp size={13} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Successful
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {razorpay?.stats?.successful ?? 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <TrendingDown size={13} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Failed
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {razorpay?.stats?.failed ?? 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock size={13} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Timeouts
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {razorpay?.stats?.timeouts ?? 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 col-span-2">
                <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center shrink-0">
                  <Ban size={13} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Rejected (Circuit Open)
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {razorpay?.stats?.rejects ?? 0}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-orange-100 transition-shadow duration-300"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                <Database size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Database</h3>
                <p className="text-xs text-slate-400">MongoDB connection</p>
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${dbStyle.badge}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${dbStyle.dot} animate-pulse`}
              />
              {db?.status}
            </span>
          </div>

          <div className="mt-6 flex items-center justify-center py-6">
            <div
              className={`w-16 h-16 rounded-2xl ${dbStyle.badge} border flex items-center justify-center`}
            >
              {dbStyle.icon}
            </div>
          </div>
        </motion.div>
      </div>

      <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
        Auto-refreshing every 15 seconds
      </p>
    </motion.div>
  );
};

export default SystemHealth;
