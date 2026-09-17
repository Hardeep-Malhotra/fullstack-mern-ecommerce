import ReviewCard from "./ReviewCard";

const ReviewList = ({ reviews = [] }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-10 text-center">
        <h3 className="font-semibold text-slate-700">No reviews yet</h3>
        <p className="mt-2 text-sm text-slate-500">
          Be the first person to review this product.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-6">
      {reviews.map((review, index) => {
        // Unique key fallback hierarchy
        const reviewKey =
          review._id ||
          (typeof review.user === "object" ? review.user._id : review.user) ||
          index;

        return <ReviewCard key={reviewKey} review={review} />;
      })}
    </div>
  );
};

export default ReviewList;