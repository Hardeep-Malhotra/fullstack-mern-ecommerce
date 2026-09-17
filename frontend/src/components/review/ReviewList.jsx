import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import ReviewCard from "./ReviewCard";

const PAGE_SIZE = 5;

const ReviewList = ({
  productId,
  reviews = [],
}) => {
  const { user } = useSelector(
    (state) => state.auth
  );

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("highest");
  const [page, setPage] = useState(1);

  // ==========================================
  // 1. SEARCH + SORT
  // ==========================================

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = !q
      ? reviews
      : reviews.filter(
          (review) =>
            review.comment
              ?.toLowerCase()
              .includes(q) ||
            review.name
              ?.toLowerCase()
              .includes(q)
        );

    list = [...list].sort((a, b) =>
      sort === "highest"
        ? b.rating - a.rating
        : a.rating - b.rating
    );

    return list;
  }, [reviews, query, sort]);

  // ==========================================
  // 2. PAGINATION
  // ==========================================

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // ==========================================
  // 3. NO REVIEWS
  // ==========================================

  if (!reviews || reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-10 text-center">
        <h3 className="font-semibold text-slate-700">
          No reviews yet
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Be the first person to review this product.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">

      {/* ======================================
          SEARCH + SORT
      ====================================== */}

      <div className="mb-2 flex flex-col gap-3 sm:flex-row">

        {/* Search */}
        <div className="relative flex-1">

          <svg
            viewBox="0 0 20 20"
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 fill-none stroke-slate-400"
            strokeWidth="2"
          >
            <circle cx="9" cy="9" r="6" />
            <path
              d="M14 14l4 4"
              strokeLinecap="round"
            />
          </svg>

          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search a specific review..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />

        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
        >
          <option value="highest">
            Sort: Highest rated
          </option>

          <option value="lowest">
            Sort: Lowest rated
          </option>
        </select>

      </div>

      {/* ======================================
          REVIEWS
      ====================================== */}

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">
          No reviews match "{query}"
        </p>
      ) : (
        <div>

          {pageItems.map((review) => (
            <ReviewCard
              key={review.user}
              productId={productId}
              review={review}
              currentUserId={user?._id}
            />
          ))}

        </div>
      )}

      {/* ======================================
          PAGINATION
      ====================================== */}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-1">

          {/* Previous */}
          <button
            onClick={() =>
              setPage((p) =>
                Math.max(1, p - 1)
              )
            }
            disabled={currentPage === 1}
            className="h-8 w-8 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30"
          >
            ‹
          </button>

          {/* Page Numbers */}
          {Array.from(
            { length: totalPages },
            (_, i) => i + 1
          ).map((number) => (
            <button
              key={number}
              onClick={() => setPage(number)}
              className={`h-8 w-8 rounded-full text-sm font-medium transition ${
                number === currentPage
                  ? "bg-violet-500 text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {number}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() =>
              setPage((p) =>
                Math.min(totalPages, p + 1)
              )
            }
            disabled={
              currentPage === totalPages
            }
            className="h-8 w-8 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30"
          >
            ›
          </button>

        </div>
      )}

    </div>
  );
};

export default ReviewList;