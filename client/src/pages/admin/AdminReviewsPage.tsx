import React, { useEffect, useState } from 'react';
import { Star, Check, EyeOff, Trash2, MessageSquare } from 'lucide-react';
import { Review } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  const loadReviews = () => {
    setLoading(true);
    api.getReviews()
      .then((res) => {
        if (res.success && res.reviews) setReviews(res.reviews);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      await api.updateReview(id, { isApproved: !currentStatus });
      success(`Review ${!currentStatus ? 'Approved' : 'Hidden'}`);
      loadReviews();
    } catch (err: any) {
      error(err.message || 'Failed to update review status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.deleteReview(id);
      success('Review deleted');
      loadReviews();
    } catch (err: any) {
      error(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs text-salon-gold uppercase tracking-wider font-semibold">Reputation & Feedback</span>
        <h1 className="text-3xl font-serif text-white mt-1">Guest Reviews Moderation</h1>
      </div>

      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-[#141418] animate-pulse border border-white/5" />
          ))
        ) : reviews.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl p-6 text-neutral-400">
            No reviews submitted yet.
          </div>
        ) : (
          reviews.map((r) => (
            <div
              key={r.id}
              className="p-6 rounded-2xl border border-white/10 bg-[#121217] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex text-salon-gold">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-salon-gold" />
                    ))}
                  </div>
                  <span className="text-xs text-neutral-400">
                    by <strong className="text-white">{r.customer?.user?.name || 'Guest'}</strong> for{' '}
                    <strong className="text-salon-gold">{r.service?.name}</strong>
                  </span>
                </div>
                <p className="text-xs text-neutral-300 italic">"{r.comment}"</p>
                <span className="text-[10px] text-neutral-500 font-mono block">
                  Submitted on {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleApproval(r.id, r.isApproved)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    r.isApproved
                      ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30'
                  }`}
                >
                  {r.isApproved ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Approved
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" /> Hidden
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="p-1.5 rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
