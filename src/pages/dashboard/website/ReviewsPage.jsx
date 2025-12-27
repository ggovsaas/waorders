import { useMemo } from 'react'
import WebsitePageShell from './WebsitePageShell'
import { useWebsite } from '../../../context/WebsiteContext'

function RatingStars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-white/20'}>
          ★
        </span>
      ))}
    </div>
  )
}

export default function ReviewsPage() {
  const { state, updateReviews, uid } = useWebsite()
  const reviews = state.reviews.items || []

  const summary = useMemo(() => {
    const approved = reviews.filter((r) => r.status === 'approved')
    const avg =
      approved.length === 0
        ? 0
        : approved.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / approved.length
    return { approvedCount: approved.length, total: reviews.length, avg: Math.round(avg * 10) / 10 }
  }, [reviews])

  const setItems = (items) => updateReviews({ items })

  const setReview = (id, partial) => {
    setItems(reviews.map((r) => (r.id === id ? { ...r, ...partial } : r)))
  }

  const addFake = () => {
    const now = new Date().toISOString()
    setItems([
      {
        id: uid('review'),
        author: 'New customer',
        rating: 5,
        text: 'Amazing experience — super fast ordering!',
        status: 'pending',
        showOnStorefront: false,
        createdAt: now
      },
      ...reviews
    ])
  }

  return (
    <WebsitePageShell
      title="Reviews"
      subtitle="Approve/reject reviews and control visibility on the storefront"
      icon="⭐"
      right={
        <button
          type="button"
          onClick={addFake}
          className="px-5 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
        >
          + Add sample
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 space-y-4">
          <h3 className="text-white font-semibold">Rating summary</h3>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-3xl font-bold text-white">{summary.avg || '—'}</p>
            <p className="text-sm text-gray-400">Average rating (approved only)</p>
            <div className="mt-2">
              <RatingStars rating={Math.round(summary.avg)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-xl font-bold text-white">{summary.approvedCount}</p>
              <p className="text-xs text-gray-400">Approved</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-xl font-bold text-white">{summary.total}</p>
              <p className="text-xs text-gray-400">Total</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Only reviews marked as <span className="text-gray-300">approved</span> and{' '}
            <span className="text-gray-300">show on storefront</span> will appear on your website.
          </p>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {reviews.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-10 text-center text-gray-400">
              No reviews yet.
            </div>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-white font-semibold">{r.author}</p>
                      <RatingStars rating={r.rating} />
                      <span
                        className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${
                          r.status === 'approved'
                            ? 'bg-green-500/20 text-green-300'
                            : r.status === 'rejected'
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-yellow-500/20 text-yellow-300'
                        }`}
                      >
                        {r.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mt-2 whitespace-pre-wrap">{r.text}</p>
                    <p className="text-xs text-gray-500 mt-3">{new Date(r.createdAt).toLocaleString()}</p>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[160px]">
                    <button
                      type="button"
                      onClick={() => setReview(r.id, { status: 'approved' })}
                      className="px-4 py-2 rounded-xl text-sm font-semibold bg-green-500/15 border border-green-500/30 text-green-300 hover:bg-green-500/25 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => setReview(r.id, { status: 'rejected' })}
                      className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-500/25 transition-colors"
                    >
                      Reject
                    </button>
                    <label className="flex items-center justify-between px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200">
                      Show
                      <input
                        type="checkbox"
                        checked={!!r.showOnStorefront}
                        onChange={(e) => setReview(r.id, { showOnStorefront: e.target.checked })}
                        className="w-4 h-4 accent-purple-600"
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </WebsitePageShell>
  )
}










