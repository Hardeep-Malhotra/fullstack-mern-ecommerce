import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  ShieldCheck,
  CalendarDays,
  Pencil,
  X,
  Save,
  Loader2,
  CheckCircle2,
  Lock,
  Sparkles,
  Camera,
  Clock,
  KeyRound,
  BadgeCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../api/axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  // =====================================================
  // FETCH PROFILE
  // =====================================================

  useEffect(() => {
    let ignore = false;

    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get("/auth/me");

        if (ignore) return;

        if (!data?.success || !data?.user) {
          throw new Error(data?.message || "Failed to load profile");
        }

        setUser(data.user);

        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
        });
      } catch (error) {
        if (!ignore) {
          console.error("PROFILE FETCH ERROR:", error);

          toast.error(
            error?.response?.data?.message ||
              error?.message ||
              "Failed to load profile"
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      ignore = true;
    };
  }, []);

  // =====================================================
  // HANDLERS
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });

    setEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });

    setEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();

    if (!name) {
      toast.error("Name is required");
      return;
    }

    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      setSaving(true);

      const { data } = await axiosInstance.put("/auth/me/update", {
        name,
        email,
      });

      if (!data?.success || !data?.user) {
        throw new Error(data?.message || "Failed to update profile");
      }

      setUser(data.user);

      setFormData({
        name: data.user.name || "",
        email: data.user.email || "",
      });

      setEditing(false);

      toast.success(data.message || "Profile updated successfully");
    } catch (error) {
      console.error("PROFILE UPDATE ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="relative flex items-center justify-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 blur-lg opacity-60 absolute" />
          <div className="w-16 h-16 rounded-2xl bg-white border border-orange-100 flex items-center justify-center relative z-10 shadow-lg">
            <Loader2 size={28} className="animate-spin text-orange-500" />
          </div>
        </motion.div>
        <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase mt-4">
          Loading Profile Details...
        </p>
      </div>
    );
  }

  // =====================================================
  // NO USER STATE
  // =====================================================

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-lg"
        >
          <div className="w-16 h-16 bg-rose-50 rounded-2xl text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <User size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Profile Unavailable</h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            We couldn't retrieve your profile right now. Please log in again or refresh the page.
          </p>
        </motion.div>
      </div>
    );
  }

  const avatarUrl = user.avatar?.url;

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  const updatedDate = user.updatedAt
    ? new Date(user.updatedAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="min-h-screen bg-white text-slate-900 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 selection:bg-orange-500 selection:text-white">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* =====================================================
            HEADER
        ===================================================== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-500 border border-orange-100 text-[10px] font-bold tracking-widest uppercase">
                Account Settings
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              My Profile
              <Sparkles className="text-orange-500 w-6 h-6 animate-pulse" />
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your identity, settings, and account details.
            </p>
          </div>
        </motion.div>

        {/* =====================================================
            HERO COVER & AVATAR CARD
        ===================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative rounded-3xl bg-white border border-orange-100 overflow-hidden shadow-lg"
        >
          {/* Animated Background Mesh */}
          <div className="h-36 sm:h-48 w-full bg-gradient-to-r from-orange-500 via-orange-500 to-orange-400 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-60" />
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          </div>

          <div className="px-6 sm:px-8 pb-6 sm:pb-8">
            <div className="-mt-14 sm:-mt-20 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              {/* Avatar + Primary Details */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
                <div className="relative group">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl border-4 border-[#0F172A] bg-orange-50 overflow-hidden shadow-lg flex items-center justify-center relative">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={user.name || "Profile"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <User className="w-12 h-12 sm:w-16 sm:h-16 text-orange-500" />
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 p-2 rounded-xl bg-white/90 text-slate-600 border border-orange-100 backdrop-blur-sm shadow-md">
                    <Camera size={14} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                      {user.name || "N/A"}
                    </h2>
                    {user.isApproved && (
                      <BadgeCheck size={20} className="text-orange-500" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
                    <Mail size={14} className="text-slate-500" />
                    {user.email || "N/A"}
                  </p>
                </div>
              </div>

              {/* Edit Trigger Button */}
              {!editing && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleEdit}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-200"
                >
                  <Pencil size={16} />
                  Edit Profile
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* =====================================================
            MAIN CONTENT LAYOUT
        ===================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PERSONAL INFORMATION (LEFT 2 COLUMNS) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 bg-white border border-orange-100 rounded-3xl overflow-hidden shadow-lg"
          >
            <div className="px-6 py-5 border-b border-orange-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Personal Details</h3>
                  <p className="text-xs text-slate-500">Update your primary information</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {/* FULL NAME INPUT */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-bold block">
                  Full Name
                </label>
                <AnimatePresence mode="wait">
                  {editing ? (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      key="input-name"
                    >
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={saving}
                        className="w-full px-4 py-3.5 rounded-2xl bg-orange-50/40 border border-orange-100 text-white text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all disabled:opacity-50"
                        placeholder="Enter your name"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key="view-name"
                      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-orange-50/40 border border-orange-100"
                    >
                      <User size={18} className="text-slate-500" />
                      <span className="text-sm font-semibold text-slate-700">
                        {user.name || "N/A"}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* EMAIL ADDRESS INPUT */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-bold block">
                  Email Address
                </label>
                <AnimatePresence mode="wait">
                  {editing ? (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      key="input-email"
                      className="space-y-2"
                    >
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={saving || user.provider === "google"}
                        className="w-full px-4 py-3.5 rounded-2xl bg-orange-50/40 border border-orange-100 text-white text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Enter your email"
                      />
                      {user.provider === "google" && (
                        <div className="flex items-center gap-2 text-xs text-orange-700 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                          <Lock size={14} className="shrink-0" />
                          <span>Google accounts cannot change their primary email.</span>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key="view-email"
                      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-orange-50/40 border border-orange-100"
                    >
                      <Mail size={18} className="text-slate-500" />
                      <span className="text-sm font-semibold text-slate-700 break-all">
                        {user.email || "N/A"}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* EDIT MODE ACTION BUTTONS */}
              {editing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-orange-100"
                >
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={saving}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="sm:w-32 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-orange-50 border border-orange-100 text-slate-600 text-sm font-bold hover:bg-slate-700/50 transition-all disabled:opacity-50"
                  >
                    <X size={18} />
                    <span>Cancel</span>
                  </motion.button>
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* ACCOUNT & TIMELINE SIDEBAR (RIGHT 1 COLUMN) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            {/* ACCOUNT OVERVIEW CARD */}
            <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-lg space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-orange-100">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Account Access</h3>
                  <p className="text-xs text-slate-500">Security and role details</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* ROLE */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500 font-medium">Role</span>
                  <span className="px-3 py-1 rounded-xl bg-orange-50 border border-orange-100 text-orange-500 text-xs font-bold uppercase tracking-wider">
                    {user.role || "User"}
                  </span>
                </div>

                {/* LOGIN PROVIDER */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500 font-medium">Provider</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 capitalize">
                    <KeyRound size={14} className="text-slate-500" />
                    {user.provider || "Local"}
                  </span>
                </div>

                {/* APPROVAL STATUS */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500 font-medium">Approval</span>
                  {user.isApproved ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-bold">
                      <CheckCircle2 size={14} /> Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-orange-600 text-xs font-bold">
                      <Clock size={14} /> Pending
                    </span>
                  )}
                </div>

                {/* EMAIL VERIFICATION */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500 font-medium">Email Verification</span>
                  <span
                    className={`text-xs font-bold ${
                      user.isEmailVerified ? "text-emerald-600" : "text-orange-600"
                    }`}
                  >
                    {user.isEmailVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
              </div>
            </div>

            {/* TIMELINE CARD */}
            <div className="bg-gradient-to-br from-white to-orange-50 border border-orange-100 rounded-3xl p-6 shadow-lg relative overflow-hidden">
              <div className="flex items-center gap-3 mb-5">
                <CalendarDays size={20} className="text-orange-500" />
                <h3 className="font-bold text-white text-base">Account Activity</h3>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="p-3.5 rounded-2xl bg-orange-50/40 border border-orange-100">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    Created On
                  </p>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">{joinedDate}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-orange-50/40 border border-orange-100">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    Last Profile Update
                  </p>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">{updatedDate}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;