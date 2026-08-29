// import { useEffect, useState } from "react";
// import API from "../../api/axios";
// import toast from "react-hot-toast";

// const PendingSellers = () => {
//   const [sellers, setSellers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(null);

//   useEffect(() => {
//     let ignore = false;

//     const fetchPendingSellers = async () => {
//       try {
//         const { data } = await API.get("/admin/sellers/pending");

//         if (!ignore) {
//           setSellers(data.pendingSellers || []);
//         }
//       } catch (err) {
//         if (!ignore) {
//           toast.error(
//             err.response?.data?.message ||
//               "Failed to fetch pending sellers"
//           );
//         }
//       } finally {
//         if (!ignore) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchPendingSellers();

//     return () => {
//       ignore = true;
//     };
//   }, []);

//   // Handle Approve Action
//   const handleApprove = async (id, name) => {
//     setActionLoading(id);

//     try {
//       const { data } = await API.put(`/admin/seller/approve/${id}`);

//       toast.success(data.message || `${name} approved!`);

//       setSellers((prev) =>
//         prev.filter((seller) => seller._id !== id)
//       );
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || "Approval failed"
//       );
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   // Handle Reject Action
//   const handleReject = async (id, name) => {
//     if (!window.confirm(`Are you sure you want to reject ${name}?`)) {
//       return;
//     }

//     setActionLoading(id);

//     try {
//       const { data } = await API.delete(`/admin/seller/reject/${id}`);

//       toast.success(data.message || `${name} rejected!`);

//       setSellers((prev) =>
//         prev.filter((seller) => seller._id !== id)
//       );
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || "Rejection failed"
//       );
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-6 text-center text-slate-400 font-medium">
//         Loading seller approval requests...
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h3 className="text-xl font-bold text-white">
//             Pending Seller Approvals
//           </h3>

//           <p className="text-xs text-slate-400 mt-1">
//             Review and approve new vendor account applications.
//           </p>
//         </div>

//         <span className="bg-orange-500/10 text-orange-400 text-xs font-semibold px-3 py-1 rounded-full border border-orange-500/20">
//           {sellers.length} Pending
//         </span>
//       </div>

//       {/* Empty State */}
//       {sellers.length === 0 ? (
//         <div className="p-8 text-center bg-slate-800/40 rounded-xl border border-dashed border-slate-700">
//           <p className="text-slate-400 text-sm">
//             No pending seller requests right now.
//           </p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-sm text-slate-300">
//             <thead className="bg-slate-800/80 text-slate-400 uppercase text-xs font-semibold">
//               <tr>
//                 <th className="px-4 py-3 rounded-l-lg">
//                   Name
//                 </th>

//                 <th className="px-4 py-3">
//                   Email
//                 </th>

//                 <th className="px-4 py-3">
//                   Requested On
//                 </th>

//                 <th className="px-4 py-3 text-right rounded-r-lg">
//                   Actions
//                 </th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-slate-800">
//               {sellers.map((seller) => (
//                 <tr
//                   key={seller._id}
//                   className="hover:bg-slate-800/40 transition-colors"
//                 >
//                   <td className="px-4 py-4 font-medium text-white">
//                     {seller.name}
//                   </td>

//                   <td className="px-4 py-4 text-slate-400">
//                     {seller.email}
//                   </td>

//                   <td className="px-4 py-4 text-slate-400">
//                     {new Date(
//                       seller.createdAt
//                     ).toLocaleDateString()}
//                   </td>

//                   <td className="px-4 py-4 text-right space-x-2">
//                     {/* Approve */}
//                     <button
//                       disabled={actionLoading === seller._id}
//                       onClick={() =>
//                         handleApprove(
//                           seller._id,
//                           seller.name
//                         )
//                       }
//                       className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3.5 py-1.5 rounded-lg text-xs transition-colors shadow-sm disabled:opacity-50"
//                     >
//                       {actionLoading === seller._id
//                         ? "Processing..."
//                         : "Approve"}
//                     </button>

//                     {/* Reject */}
//                     <button
//                       disabled={actionLoading === seller._id}
//                       onClick={() =>
//                         handleReject(
//                           seller._id,
//                           seller.name
//                         )
//                       }
//                       className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-medium px-3.5 py-1.5 rounded-lg text-xs transition-colors disabled:opacity-50"
//                     >
//                       Reject
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PendingSellers;


import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserCheck, 
  Check, 
  X, 
  Clock, 
  Mail, 
  Calendar, 
  Loader2, 
  UserX, 
  // ShieldAlert 
} from "lucide-react";
import API from "../../api/axios";
import toast from "react-hot-toast";

const PendingSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchPendingSellers = async () => {
      try {
        const { data } = await API.get("/admin/sellers/pending");

        if (!ignore) {
          setSellers(data.pendingSellers || []);
        }
      } catch (err) {
        if (!ignore) {
          toast.error(
            err.response?.data?.message || "Failed to fetch pending sellers"
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchPendingSellers();

    return () => {
      ignore = true;
    };
  }, []);

  // Handle Approve Action
  const handleApprove = async (id, name) => {
    setActionLoading(id);

    try {
      const { data } = await API.put(`/admin/seller/approve/${id}`);

      toast.success(data.message || `${name} approved successfully!`);

      setSellers((prev) => prev.filter((seller) => seller._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Approval failed");
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Reject Action
  const handleReject = async (id, name) => {
    if (!window.confirm(`Are you sure you want to reject ${name}?`)) {
      return;
    }

    setActionLoading(id);

    try {
      const { data } = await API.delete(`/admin/seller/reject/${id}`);

      toast.success(data.message || `${name} rejected!`);

      setSellers((prev) => prev.filter((seller) => seller._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Rejection failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm text-center">
        <div className="inline-flex p-3 bg-orange-50 text-orange-500 rounded-xl mb-3 animate-pulse">
          <Clock size={24} />
        </div>
        <p className="text-slate-600 font-medium text-sm">
          Fetching pending seller approval requests...
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden"
    >
      {/* =====================================
          HEADER SECTION
      ===================================== */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-orange-50/30 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100/80 border border-orange-200/60 flex items-center justify-center text-orange-600">
            <UserCheck size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Pending Seller Approvals
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and manage new seller account applications.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-full border border-orange-200/60 self-start sm:self-auto">
          <Clock size={13} />
          {sellers.length} Pending
        </span>
      </div>

      {/* =====================================
          CONTENT SECTION
      ===================================== */}
      {sellers.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <UserX size={24} />
          </div>
          <h4 className="text-sm font-bold text-slate-700">All caught up!</h4>
          <p className="text-xs text-slate-400 max-w-xs mt-1">
            No pending seller requests right now. New applications will appear here.
          </p>
        </div>
      ) : (
        /* Table View */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Seller Name</th>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Requested On</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {sellers.map((seller) => (
                  <motion.tr
                    key={seller._id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* Name with Avatar Initial */}
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center uppercase group-hover:border-orange-200 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                          {seller.name?.[0] || "S"}
                        </div>
                        <span>{seller.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Mail size={13} className="text-slate-400" />
                        <span>{seller.email}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-400" />
                        <span>
                          {new Date(seller.createdAt).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Approve Button */}
                        <button
                          disabled={actionLoading === seller._id}
                          onClick={() => handleApprove(seller._id, seller.name)}
                          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition-all shadow-xs disabled:opacity-50"
                        >
                          {actionLoading === seller._id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Check size={13} />
                          )}
                          Approve
                        </button>

                        {/* Reject Button */}
                        <button
                          disabled={actionLoading === seller._id}
                          onClick={() => handleReject(seller._id, seller.name)}
                          className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors disabled:opacity-50"
                        >
                          <X size={13} />
                          Reject
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default PendingSellers;