/**
 * Props:
 *  - reviews: array of { rating, comment, name, user }
 *
 * Computes average + per-star percentage breakdown from REAL review data
 * (no fabricated numbers).
 */
const RatingSummary = ({ reviews = [] }) => {
  const total = reviews.length;

  const average = total
    ? (reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / total).toFixed(1)
    : "0.0";

  // Count how many reviews gave each star (5 -> 1)
  const counts = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Number(r.rating) === star).length;
    const percent = total ? Math.round((count / total) * 100) : 0;
    return { star, count, percent };
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="h-5 w-5 text-violet-500"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.2 21 12 17.27 5.8 21 7 14.14l-5-4.87 7.1-1.01z" />
        </svg>
        <h3 className="font-semibold text-slate-900">Ratings & Reviews</h3>
      </div>

      <div className="flex items-end gap-6">
        <div>
          <div className="text-5xl font-bold text-slate-900 leading-none">
            {average}
          </div>
          <div className="mt-2 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                viewBox="0 0 20 20"
                className={`h-4 w-4 ${
                  star <= Math.round(average)
                    ? "fill-amber-400"
                    : "fill-slate-200"
                }`}
              >
                <path d="M10 1l2.7 5.8 6.3.9-4.6 4.4 1.1 6.2L10 15.3l-5.5 3 1.1-6.2L1 7.7l6.3-.9z" />
              </svg>
            ))}
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {total} {total === 1 ? "review" : "reviews"}
          </p>
        </div>

        <div className="flex-1 space-y-1.5">
          {counts.map(({ star, percent }) => (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span className="w-3 text-slate-500">{star}</span>
              <svg viewBox="0 0 20 20" className="h-3 w-3 fill-amber-400">
                <path d="M10 1l2.7 5.8 6.3.9-4.6 4.4 1.1 6.2L10 15.3l-5.5 3 1.1-6.2L1 7.7l6.3-.9z" />
              </svg>
              <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-violet-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="w-9 text-right text-slate-500">{percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingSummary;