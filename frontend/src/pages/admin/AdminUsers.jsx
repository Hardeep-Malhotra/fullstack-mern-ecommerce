import { useEffect, useMemo, useState } from "react";
import axios from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Users,
  ShieldCheck,
  UserCheck,
  RefreshCw,
  Trash2,
  Mail,
  CalendarDays,
  AlertCircle,
  Search,
  UserX,
  User,
  UserCog,
  Database,
} from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // ==========================================
  // FETCH USERS
  // ==========================================

  const fetchUsers = async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const { data } = await axios.get("/admin/users");

      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Fetch admin users error:", err);

      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      if (isInitial) {
        setLoading(false);
      }

      setRefreshing(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    let mounted = true;

    const loadUsers = async () => {
      try {
        const { data } = await axios.get("/admin/users");

        if (mounted && data.success) {
          setUsers(data.users || []);
        }
      } catch (err) {
        if (mounted) {
          console.error("Fetch admin users error:", err);

          setError(err.response?.data?.message || "Failed to fetch users");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================
  // ROLE CHANGE
  // ==========================================

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingId(userId);

      const { data } = await axios.put(`/admin/users/${userId}`, {
        role: newRole,
      });

      if (data.success) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === userId
              ? {
                  ...user,
                  role: newRole,
                }
              : user,
          ),
        );

        toast.success(`User role changed to ${newRole}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Role update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // DELETE USER
  // ==========================================

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) return;

    try {
      setUpdatingId(userId);

      const { data } = await axios.delete(`/admin/users/${userId}`);

      if (data.success) {
        setUsers((prev) => prev.filter((user) => user._id !== userId));

        toast.success("User deleted successfully");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredUsers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return users;

    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search),
    );
  }, [users, searchTerm]);

  // ==========================================
  // STATS
  // ==========================================

  const stats = useMemo(() => {
    return users.reduce(
      (acc, user) => {
        if (user.role === "admin") {
          acc.admins++;
        } else {
          acc.customers++;
        }

        return acc;
      },
      {
        total: users.length,
        admins: 0,
        customers: 0,
      },
    );
  }, [users]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}

        <div className="flex justify-between items-center mb-8">
          <div className="space-y-3">
            <div className="h-8 w-64 bg-slate-200 rounded-lg animate-pulse" />

            <div className="h-4 w-52 bg-slate-100 rounded animate-pulse" />
          </div>

          <div className="h-10 w-28 bg-slate-200 rounded-xl animate-pulse" />
        </div>

        {/* Stats Skeleton */}

        <div className="grid sm:grid-cols-3 gap-5 mb-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white border border-slate-200 rounded-2xl p-5"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 animate-pulse" />

                <div className="space-y-2">
                  <div className="h-3 w-24 bg-slate-100 rounded" />

                  <div className="h-7 w-14 bg-slate-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <div className="h-10 w-80 bg-slate-100 rounded-xl animate-pulse" />
          </div>

          <div className="p-5 space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-14 bg-slate-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.97,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className="min-h-[60vh] flex items-center justify-center"
      >
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-10 text-center max-w-md">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-5">
            <AlertCircle size={30} />
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            Something went wrong
          </h2>

          <p className="text-sm text-slate-500 mt-2 mb-6">{error}</p>

          <button
            onClick={() => fetchUsers(false)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold shadow-md shadow-orange-200 hover:shadow-lg transition-all disabled:opacity-60"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  // ==========================================
  // MAIN
  // ==========================================

  return (
    <div className="max-w-7xl mx-auto">
      {/* =====================================
          HEADER
      ===================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: -15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-200">
              <Users size={23} />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                User Management
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Manage customers, roles and accounts
              </p>
            </div>
          </div>
        </div>

        {/* Refresh */}

        <motion.button
          whileHover={{
            scale: 1.03,
          }}
          whileTap={{
            scale: 0.97,
          }}
          onClick={() => fetchUsers(false)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-semibold shadow-sm hover:border-orange-300 hover:text-orange-600 hover:shadow-md transition-all disabled:opacity-60"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />

          {refreshing ? "Refreshing..." : "Refresh"}
        </motion.button>
      </motion.div>

      {/* =====================================
          STATS
      ===================================== */}

      <div className="grid sm:grid-cols-3 gap-5 mb-6">
        {/* Total */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.05,
          }}
          whileHover={{
            y: -3,
          }}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Users size={22} />
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-400">
                Total Registered
              </span>

              <strong className="block text-2xl font-extrabold text-slate-900 mt-0.5">
                {stats.total}
              </strong>
            </div>
          </div>
        </motion.div>

        {/* Admins */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          whileHover={{
            y: -3,
          }}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-400">
                Administrators
              </span>

              <strong className="block text-2xl font-extrabold text-slate-900 mt-0.5">
                {stats.admins}
              </strong>
            </div>
          </div>
        </motion.div>

        {/* Customers */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
          }}
          whileHover={{
            y: -3,
          }}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck size={22} />
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-400">
                Customers
              </span>

              <strong className="block text-2xl font-extrabold text-slate-900 mt-0.5">
                {stats.customers}
              </strong>
            </div>
          </div>
        </motion.div>
      </div>

      {/* =====================================
          USERS TABLE
      ===================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.2,
        }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        {/* TOP BAR */}

        <div className="p-5 sm:p-6 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}

            <div className="relative w-full md:max-w-md">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all"
              />
            </div>

            {/* Count */}

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Database size={14} />

              <span>
                {filteredUsers.length}{" "}
                {filteredUsers.length === 1 ? "User" : "Users"} Listed
              </span>
            </div>
          </div>
        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  User Details
                </th>

                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Email
                </th>

                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Role
                </th>

                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Joined Date
                </th>

                <th className="text-right px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              <AnimatePresence mode="popLayout">
                {filteredUsers.length === 0 ? (
                  <motion.tr
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                  >
                    <td colSpan="5" className="px-6 py-16">
                      <div className="text-center">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                          <UserX size={25} />
                        </div>

                        <h3 className="font-bold text-slate-700">
                          No Users Found
                        </h3>

                        <p className="text-xs text-slate-400 mt-1">
                          Try changing your search query.
                        </p>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      layout
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.98,
                      }}
                      transition={{
                        delay: index * 0.025,
                      }}
                      className="group hover:bg-orange-50/30 transition-colors"
                    >
                      {/* USER */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 text-orange-600 flex items-center justify-center font-extrabold border border-orange-100">
                              {user.name
                                ? user.name.charAt(0).toUpperCase()
                                : "U"}
                            </div>

                            <span className="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <strong className="text-sm font-bold text-slate-800 truncate max-w-[180px]">
                                {user.name || "Unknown"}
                              </strong>

                              {user.role === "admin" && (
                                <ShieldCheck
                                  size={14}
                                  className="text-orange-500 shrink-0"
                                />
                              )}
                            </div>

                            <small className="block text-[10px] text-slate-400 font-mono mt-1">
                              ID: #{user._id?.slice(-6)}
                            </small>
                          </div>
                        </div>
                      </td>

                      {/* EMAIL */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600 max-w-[250px]">
                          <Mail size={14} className="text-slate-400 shrink-0" />

                          <span className="truncate">{user.email}</span>
                        </div>
                      </td>

                      {/* ROLE */}

                      <td className="px-6 py-4">
                        <div className="relative inline-block">
                          <select
                            value={user.role}
                            disabled={updatingId === user._id}
                            onChange={(e) =>
                              handleRoleChange(user._id, e.target.value)
                            }
                            className={`
                                appearance-none
                                pl-9 pr-8 py-2
                                rounded-lg
                                border
                                text-xs
                                font-bold
                                outline-none
                                cursor-pointer
                                transition-all
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                ${
                                  user.role === "admin"
                                    ? "bg-orange-50 text-orange-700 border-orange-200 focus:ring-4 focus:ring-orange-100"
                                    : "bg-slate-50 text-slate-600 border-slate-200 focus:ring-4 focus:ring-slate-100"
                                }
                              `}
                          >
                            <option value="user">User</option>

                            <option value="admin">Admin</option>
                          </select>

                          {user.role === "admin" ? (
                            <ShieldCheck
                              size={14}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500 pointer-events-none"
                            />
                          ) : (
                            <User
                              size={14}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                            />
                          )}
                        </div>
                      </td>

                      {/* DATE */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <CalendarDays size={14} className="text-slate-400" />

                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "N/A"}
                        </div>
                      </td>

                      {/* DELETE */}

                      <td className="px-6 py-4 text-right">
                        <motion.button
                          whileHover={{
                            scale: 1.08,
                          }}
                          whileTap={{
                            scale: 0.92,
                          }}
                          disabled={updatingId === user._id}
                          onClick={() => handleDeleteUser(user._id)}
                          className="w-9 h-9 inline-flex items-center justify-center rounded-lg bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Delete user"
                        >
                          {updatingId === user._id ? (
                            <RefreshCw size={15} className="animate-spin" />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* FOOTER */}

        {filteredUsers.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCog size={14} className="text-slate-400" />

              <span className="text-[11px] text-slate-500">
                Showing{" "}
                <strong className="text-slate-700">
                  {filteredUsers.length}
                </strong>{" "}
                of <strong className="text-slate-700">{users.length}</strong>{" "}
                users
              </span>
            </div>

            <span className="text-[10px] font-semibold text-slate-400">
              Shopzy Admin
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminUsers;
