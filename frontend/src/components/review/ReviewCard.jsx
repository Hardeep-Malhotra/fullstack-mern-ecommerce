import { useState } from "react";
import { ThumbsUp, ThumbsDown, BadgeCheck } from "lucide-react";
import axiosInstance from "../../api/axios";

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

const timeAgo = (dateString) => {
  if (!dateString) return "";
  const diffMs = Date.now() - new Date(dateString).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 1) return "Today";
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
};

/**
 * Props:
 *  - productId: string
 *  - review: { user, name, rating, comment, isVerifiedPurchase, createdAt,
 *              helpfulVotes: [userId], unhelpfulVotes: [userId] }
 *  - currentUserId: string | undefined — to show the user's own vote state
 */
const ReviewCard = ({ productId, review, currentUserId }) => {
  const initial = review.name?.charAt(0)?.toUpperCase() || "U";

  const initialVote = review.helpfulVotes?.includes(currentUserId)
    ? "helpful"
    : review.unhelpfulVotes?.includes(currentUserId)
    ? "unhelpful"
    : null;

  const [helpfulCount, setHelpfulCount] = useState(review.helpfulVotes?.length || 0);
  const [unhelpfulCount, setUnhelpfulCount] = useState(
    review.unhelpfulVotes?.length || 0,
  );
  const [userVote, setUserVote] = useState(initialVote);
  const [voting, setVoting] = useState(false);

  const handleVote = async (voteType) => {
    if (!currentUserId || voting) return;

    setVoting(true);
    try {
      const { data } = await axiosInstance.put(`/products/${productId}/review/vote`, {
        reviewUserId: review.user,
        voteType,
      });
      setHelpfulCount(data.helpfulCount);
      setUnhelpfulCount(data.unhelpfulCount);
      setUserVote(data.userVote);
    } catch (err) {
      console.error("Vote failed", err);
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="border-b border-slate-100 py-6 last:border-b-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${getAvatarColor(
              review.name,
            )}`}
          >
            {initial}
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">By {review.name}</h4>
            <div className="flex items-center gap-0.5 mt-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  viewBox="0 0 20 20"
                  className={`h-3.5 w-3.5 ${
                    star <= review.rating ? "fill-amber-400" : "fill-slate-200"
                  }`}
                >
                  <path d="M10 1l2.7 5.8 6.3.9-4.6 4.4 1.1 6.2L10 15.3l-5.5 3 1.1-6.2L1 7.7l6.3-.9z" />
                </svg>
              ))}
            </div>
          </div>
        </div>

        <span className="text-xs text-slate-400 whitespace-nowrap">
          {timeAgo(review.createdAt)}
        </span>
      </div>

      {review.isVerifiedPurchase && (
        <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
          <BadgeCheck size={14} />
          Verified Purchase
        </div>
      )}

      <p className="mt-3 leading-relaxed text-slate-600 text-sm">{review.comment}</p>

      <div className="mt-3 flex items-center gap-4 text-xs">
        <button
          onClick={() => handleVote("helpful")}
          disabled={!currentUserId || voting}
          className={`flex items-center gap-1.5 transition disabled:opacity-40 ${
            userVote === "helpful" ? "text-violet-600 font-medium" : "text-slate-500"
          }`}
        >
          <ThumbsUp size={14} className={userVote === "helpful" ? "fill-violet-100" : ""} />
          Helpful ({helpfulCount})
        </button>
        <button
          onClick={() => handleVote("unhelpful")}
          disabled={!currentUserId || voting}
          className={`flex items-center gap-1.5 transition disabled:opacity-40 ${
            userVote === "unhelpful" ? "text-violet-600 font-medium" : "text-slate-500"
          }`}
        >
          <ThumbsDown size={14} className={userVote === "unhelpful" ? "fill-violet-100" : ""} />
          Unhelpful ({unhelpfulCount})
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;