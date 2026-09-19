import { useState } from "react";
import { Trash2, BadgeCheck } from "lucide-react";

const AVATAR_COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-rose-100 text-rose-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-sky-100 text-sky-700",
];

const getAvatarColor = (name = "") => {
  const code = name.charCodeAt(0) || 0;

  return AVATAR_COLORS[code % AVATAR_COLORS.length];
};

const SellerReviewCard = ({ review, onDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const initial =
    review?.name?.charAt(0)?.toUpperCase() || "U";

  // Get reviewer ID safely
  const reviewUserId =
    typeof review?.user === "object"
      ? review?.user?._id
      : review?.user;

  const handleDeleteClick = async () => {
    // First click -> ask confirmation
    if (!confirming) {
      setConfirming(true);
      return;
    }

    if (!reviewUserId) {
      return;
    }

    try {
      setDeleting(true);

      await onDelete(reviewUserId);
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirming(false);
  };

  return (
    <div className="border-b border-slate-100 py-5 last:border-b-0">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 min-w-0">
          {/* AVATAR */}
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${getAvatarColor(
              review?.name
            )}`}
          >
            {initial}
          </div>

          {/* NAME + RATING */}
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-slate-900 truncate">
              {review?.name || "Unknown User"}
            </h4>

            {/* STARS */}
            <div className="flex items-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  viewBox="0 0 20 20"
                  className={`h-3.5 w-3.5 ${
                    star <= Number(review?.rating || 0)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-slate-200 text-slate-200"
                  }`}
                >
                  <path d="M10 1l2.7 5.8 6.3.9-4.6 4.4 1.1 6.2L10 15.3l-5.5 3 1.1-6.2L1 7.7l6.3-.9z" />
                </svg>
              ))}
            </div>

            {/* VERIFIED PURCHASE */}
            {review?.isVerifiedPurchase && (
              <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                <BadgeCheck size={13} />
                Verified Purchase
              </div>
            )}
          </div>
        </div>

        {/* DELETE AREA */}
        <div className="shrink-0 flex items-center gap-2">
          {confirming && !deleting && (
            <button
              type="button"
              onClick={handleCancelDelete}
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={handleDeleteClick}
            disabled={deleting || !reviewUserId}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
              confirming
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-red-50 text-red-600 hover:bg-red-100"
            }`}
          >
            <Trash2 size={14} />

            {deleting
              ? "Deleting..."
              : confirming
                ? "Confirm Delete"
                : "Delete Review"}
          </button>
        </div>
      </div>

      {/* REVIEW COMMENT */}
      <p className="mt-3 pl-[52px] text-sm leading-relaxed text-slate-600">
        {review?.comment}
      </p>
    </div>
  );
};

export default SellerReviewCard;