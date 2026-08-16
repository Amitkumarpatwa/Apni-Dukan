import { useState, useEffect } from "react";
import { productApi } from "../api/productApi";
import Rating from "./Rating";

const ReviewSection = ({ productId, onReviewAdded }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const response = await productApi.getProductReviews(productId);
      setReviews(response.data?.data || []);
    } catch (err) {
      console.error("Failed to load reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;

    setSubmitting(true);
    try {
      const response = await productApi.submitReview(productId, newReview);
      
      setNewReview({ name: "", rating: 5, comment: "" });
      
      // Update reviews list and inform parent component
      fetchReviews();
      if (onReviewAdded && response.data?.data) {
        onReviewAdded(response.data.data);
      }
    } catch (err) {
      console.error("Failed to submit review", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-10 rounded-3xl border border-white/10 bg-slate-900/40 p-5 sm:p-8">
      <h2 className="mb-6 text-xl font-bold text-white sm:text-2xl">Customer Reviews</h2>

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="mb-10 space-y-4 rounded-2xl bg-slate-950/60 p-5">
        <h3 className="text-sm font-semibold text-slate-200">Write a Review</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Your Name"
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            value={newReview.name}
            onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
            required
          />
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-2">
            <span className="mr-2 text-sm text-slate-400">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setNewReview({ ...newReview, rating: star })}
                className={`transition-colors ${
                  star <= newReview.rating ? "text-amber-400" : "text-slate-600 hover:text-amber-400/50"
                }`}
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
        </div>
        <textarea
          placeholder="What do you think about this product?"
          rows="3"
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          value={newReview.comment}
          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          required
        ></textarea>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-400 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>

      {/* Reviews List */}
      {loading ? (
        <p className="text-sm text-slate-400">Loading reviews...</p>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="rounded-2xl border border-white/5 bg-slate-900 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-slate-200">{review.name}</span>
                <Rating rating={review.rating} showCount={false} />
              </div>
              <p className="text-sm text-slate-400">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400">No reviews yet. Be the first to review!</p>
      )}
    </div>
  );
};

export default ReviewSection;
