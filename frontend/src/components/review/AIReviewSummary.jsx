import { useEffect, useState } from "react";
import {
  Sparkles,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import axiosInstance from "../../api/axios";

const SENTIMENT_STYLES = {
  positive:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  neutral:
    "bg-slate-100 text-slate-600 border-slate-200",
  negative:
    "bg-rose-50 text-rose-700 border-rose-200",
};

const SENTIMENT_LABEL = {
  positive: "Mostly Positive",
  neutral: "Mixed",
  negative: "Mostly Negative",
};

const MIN_REVIEWS_FOR_SUMMARY = 3;

const AIReviewSummary = ({
  productId,
  reviewCount,
}) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // No API call if productId is missing
    // or there are fewer than 3 reviews.
    if (
      !productId ||
      reviewCount < MIN_REVIEWS_FOR_SUMMARY
    ) {
      return;
    }

    let ignore = false;

    const fetchSummary = async () => {
      setLoading(true);
      setFailed(false);

      try {
        const { data } = await axiosInstance.get(
          `/products/${productId}/review-summary`
        );

        if (ignore) return;

        if (data.summary) {
          setSummary(data.summary);
        } else {
          setSummary(null);
        }
      } catch (err) {
        if (ignore) return;

        console.error(
          "Failed to load AI review summary",
          err
        );

        setFailed(true);
        setSummary(null);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchSummary();

    return () => {
      ignore = true;
    };
  }, [productId, reviewCount]);

  // ==========================================
  // 1. LESS THAN 3 REVIEWS
  // ==========================================

  if (
    !productId ||
    reviewCount < MIN_REVIEWS_FOR_SUMMARY
  ) {
    return null;
  }

  // ==========================================
  // 2. API FAILED
  // ==========================================

  if (failed) {
    return null;
  }

  // ==========================================
  // 3. LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5 animate-pulse">
        <div className="h-4 w-40 bg-violet-100 rounded mb-3" />

        <div className="h-3 w-full bg-violet-100/70 rounded mb-2" />

        <div className="h-3 w-3/4 bg-violet-100/70 rounded" />
      </div>
    );
  }

  // ==========================================
  // 4. NO SUMMARY
  // ==========================================

  if (!summary) {
    return null;
  }

  // ==========================================
  // 5. AI SUMMARY UI
  // ==========================================

  return (
    <div className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">

        <div className="flex items-center gap-2">

          <Sparkles
            size={16}
            className="text-violet-500"
          />

          <h4 className="font-semibold text-slate-900 text-sm">
            AI Review Summary
          </h4>

        </div>

        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
            SENTIMENT_STYLES[
              summary.overall_sentiment
            ] || SENTIMENT_STYLES.neutral
          }`}
        >
          {SENTIMENT_LABEL[
            summary.overall_sentiment
          ] || "Mixed"}
        </span>

      </div>

      {/* Summary */}
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        {summary.summary}
      </p>

      {/* Pros / Cons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Pros */}
        {summary.pros?.length > 0 && (
          <div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 mb-2">
              <ThumbsUp size={13} />
              Pros
            </div>

            <ul className="space-y-1">

              {summary.pros.map(
                (point, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-slate-600 flex gap-1.5"
                  >
                    <span className="text-emerald-500">
                      •
                    </span>

                    {point}
                  </li>
                )
              )}

            </ul>

          </div>
        )}

        {/* Cons */}
        {summary.cons?.length > 0 && (
          <div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 mb-2">
              <ThumbsDown size={13} />
              Cons
            </div>

            <ul className="space-y-1">

              {summary.cons.map(
                (point, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-slate-600 flex gap-1.5"
                  >
                    <span className="text-rose-500">
                      •
                    </span>

                    {point}
                  </li>
                )
              )}

            </ul>

          </div>
        )}

      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-slate-400 mt-4">
        Generated by AI based on customer reviews —
        may not reflect every opinion.
      </p>

    </div>
  );
};

export default AIReviewSummary;