import { useState } from "react";
import { Star, Send } from "lucide-react";

const ReviewForm = ({ onSubmitReview }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!rating || !comment.trim()) {
      alert("Please select rating and write a comment");
      return;
    }

    onSubmitReview({
      rating,
      comment,
    });

    setRating(0);
    setComment("");
  };

  return (
    <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">
        Write a Review
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        Share your experience with this product.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6"
      >
        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Your Rating
          </label>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={28}
                  className={
                    star <= rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300"
                  }
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="mt-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Your Review
          </label>

          <textarea
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
            placeholder="Write your experience about this product..."
            rows={5}
            maxLength={500}
            className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />

          <div className="text-right text-xs text-slate-400 mt-1">
            {comment.length}/500
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          <Send size={17} />
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;