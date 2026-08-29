import { useEffect, useState } from "react";
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
            err.response?.data?.message ||
              "Failed to fetch pending sellers"
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

      toast.success(data.message || `${name} approved!`);

      setSellers((prev) =>
        prev.filter((seller) => seller._id !== id)
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Approval failed"
      );
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

      setSellers((prev) =>
        prev.filter((seller) => seller._id !== id)
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Rejection failed"
      );
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-slate-400 font-medium">
        Loading seller approval requests...
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">
            Pending Seller Approvals
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            Review and approve new vendor account applications.
          </p>
        </div>

        <span className="bg-orange-500/10 text-orange-400 text-xs font-semibold px-3 py-1 rounded-full border border-orange-500/20">
          {sellers.length} Pending
        </span>
      </div>

      {/* Empty State */}
      {sellers.length === 0 ? (
        <div className="p-8 text-center bg-slate-800/40 rounded-xl border border-dashed border-slate-700">
          <p className="text-slate-400 text-sm">
            No pending seller requests right now.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">
                  Name
                </th>

                <th className="px-4 py-3">
                  Email
                </th>

                <th className="px-4 py-3">
                  Requested On
                </th>

                <th className="px-4 py-3 text-right rounded-r-lg">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {sellers.map((seller) => (
                <tr
                  key={seller._id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-4 py-4 font-medium text-white">
                    {seller.name}
                  </td>

                  <td className="px-4 py-4 text-slate-400">
                    {seller.email}
                  </td>

                  <td className="px-4 py-4 text-slate-400">
                    {new Date(
                      seller.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-4 text-right space-x-2">
                    {/* Approve */}
                    <button
                      disabled={actionLoading === seller._id}
                      onClick={() =>
                        handleApprove(
                          seller._id,
                          seller.name
                        )
                      }
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3.5 py-1.5 rounded-lg text-xs transition-colors shadow-sm disabled:opacity-50"
                    >
                      {actionLoading === seller._id
                        ? "Processing..."
                        : "Approve"}
                    </button>

                    {/* Reject */}
                    <button
                      disabled={actionLoading === seller._id}
                      onClick={() =>
                        handleReject(
                          seller._id,
                          seller.name
                        )
                      }
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-medium px-3.5 py-1.5 rounded-lg text-xs transition-colors disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingSellers;