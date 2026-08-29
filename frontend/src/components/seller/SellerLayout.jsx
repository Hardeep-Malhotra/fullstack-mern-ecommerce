import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ShoppingBag, X } from "lucide-react";

import SellerSidebar from "./SellerSidebar";
import API from "../../api/axios";

// =====================================================
// SELLER LAYOUT
// =====================================================

const SellerLayout = () => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // =====================================================
  // STATE MANAGEMENT
  // =====================================================

  const [orders, setOrders] = useState([]);
  const [newOrders, setNewOrders] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // =====================================================
  // Shared "process fetched orders" logic — pure-ish, no
  // hooks inside, so both the mount effect and the polling
  // interval can reuse it without duplicating the last-seen
  // comparison logic.
  // =====================================================

  const applyFetchedOrders = useCallback((fetchedOrders) => {
    const sortedOrders = [...fetchedOrders].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    setOrders(sortedOrders);

    const lastSeenOrderId = localStorage.getItem("seller_last_seen_order");

    if (!lastSeenOrderId) {
      if (sortedOrders.length > 0) {
        localStorage.setItem("seller_last_seen_order", sortedOrders[0]._id);
      }
      setNewOrders([]);
      return;
    }

    const lastSeenIndex = sortedOrders.findIndex(
      (order) => order._id === lastSeenOrderId,
    );

    if (lastSeenIndex > 0) {
      setNewOrders(sortedOrders.slice(0, lastSeenIndex));
    } else {
      setNewOrders([]);
    }
  }, []);

  // =====================================================
  // FETCH SELLER ORDERS (MEMOIZED)
  // Used by the polling interval's callback — that's fine to
  // call directly since setInterval's callback fires later,
  // decoupled from the effect body's own execution.
  // =====================================================

  const fetchSellerOrders = useCallback(async () => {
    try {
      const { data } = await API.get("/seller/orders");
      if (!data?.success) return;
      applyFetchedOrders(data.orders || []);
    } catch (error) {
      console.error("SELLER ORDERS NOTIFICATION ERROR:", error);
    }
  }, [applyFetchedOrders]);

  // =====================================================
  // MOUNT LOAD + POLLING
  // The very first load is kept inline inside the effect
  // (with its own `ignore` guard) instead of calling
  // fetchSellerOrders() directly from the effect body — an
  // effect invoking an externally defined function that sets
  // state gets flagged by the set-state-in-effect rule even
  // after an `await`. The `await Promise.resolve()` this used
  // to have didn't actually avoid that, since it's still the
  // same synchronous call chain from the effect. The recurring
  // poll below is unaffected — setInterval's callback firing
  // later is a genuinely separate callback frame, which the
  // rule allows.
  // =====================================================

  useEffect(() => {
    let ignore = false;

    const loadInitialOrders = async () => {
      try {
        const { data } = await API.get("/seller/orders");
        if (ignore || !data?.success) return;
        applyFetchedOrders(data.orders || []);
      } catch (error) {
        if (!ignore) {
          console.error("SELLER ORDERS NOTIFICATION ERROR:", error);
        }
      }
    };

    loadInitialOrders();

    const interval = setInterval(() => {
      if (!ignore) fetchSellerOrders();
    }, 15000);

    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, [applyFetchedOrders, fetchSellerOrders]);

  // =====================================================
  // NOTIFICATION ACTIONS
  // =====================================================

  const handleNotificationClick = () => {
    setShowNotifications(false);

    if (orders.length > 0) {
      localStorage.setItem("seller_last_seen_order", orders[0]._id);
    }

    setNewOrders([]);
    // Client-side navigation — a full page reload here (the previous
    // window.location.href) would throw away the whole SPA session
    // just to go to a route that's already inside this same layout.
    navigate("/seller/orders");
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <SellerSidebar />

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-y-auto bg-slate-50">
          {/* Header containing ONLY "+ New Orders" on top right */}
          <header className="sticky top-0 z-40 h-16 bg-transparent px-4 sm:px-8 flex items-center justify-end">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowNotifications((prev) => !prev)}
                className={`relative group flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  newOrders.length > 0
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 hover:brightness-105"
                    : "bg-slate-100/80 hover:bg-orange-50 text-slate-700 hover:text-orange-600 border border-slate-200/60"
                }`}
              >
                <Bell
                  size={16}
                  className={`${
                    newOrders.length > 0
                      ? "animate-bounce"
                      : "group-hover:scale-110"
                  } transition-transform`}
                />

                <span>+ New Orders</span>

                {/* UNREAD COUNT BADGE */}
                {newOrders.length > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-white text-orange-600 text-[10px] font-extrabold shadow-xs">
                    {newOrders.length > 9 ? "9+" : newOrders.length}
                  </span>
                )}
              </button>

              {/* NOTIFICATION DROPDOWN CARD */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 top-12 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 text-slate-800"
                  >
                    {/* DROPDOWN HEADER */}
                    <div className="flex items-center justify-between px-4 py-3.5 bg-slate-50 border-b border-slate-100">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Recent Notifications
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {newOrders.length > 0
                            ? `You have ${newOrders.length} unread order requests`
                            : "No new pending orders"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowNotifications(false)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    {/* ORDER LIST */}
                    {newOrders.length > 0 ? (
                      <div className="max-h-[320px] divide-y divide-slate-100 overflow-y-auto">
                        {newOrders.slice(0, 10).map((order) => (
                          <button
                            key={order._id}
                            type="button"
                            onClick={handleNotificationClick}
                            className="w-full text-left p-3.5 flex items-start gap-3 hover:bg-orange-50/50 transition group"
                          >
                            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                              <ShoppingBag size={15} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-slate-800">
                                  Order #{order._id?.slice(-6).toUpperCase()}
                                </span>
                                <span className="text-[11px] font-extrabold text-emerald-600">
                                  ₹
                                  {Number(order.totalPrice || 0).toLocaleString(
                                    "en-IN",
                                  )}
                                </span>
                              </div>

                              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                                New order received for processing
                              </p>

                              <span className="text-[10px] text-slate-400 block mt-1">
                                {formatDate(order.createdAt)}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      /* EMPTY STATE */
                      <div className="py-10 px-4 text-center">
                        <div className="w-10 h-10 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                          <Bell size={18} />
                        </div>
                        <p className="text-xs font-semibold text-slate-700">
                          All caught up!
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          No new unread orders right now.
                        </p>
                      </div>
                    )}

                    {/* FOOTER */}
                    <div className="p-2 bg-slate-50 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleNotificationClick}
                        className="w-full py-2 rounded-xl bg-white hover:bg-orange-50 border border-slate-200 text-xs font-bold text-orange-600 shadow-2xs transition active:scale-[0.98]"
                      >
                        View All Orders
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </header>

          {/* PAGE CONTENT CONTAINER */}
          <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;