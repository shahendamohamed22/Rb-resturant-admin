import { useQueryClient, useMutation } from '@tanstack/react-query';
import api from '../../shared/api/axiosClient';
import { ENDPOINTS } from '../../shared/api/endpoints';
import { useReviewsQuery } from './useReviewsQuery';

function ReviewsPanel() {
  const queryClient = useQueryClient();
  const { data: reviews = [], isLoading, error } = useReviewsQuery();

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(ENDPOINTS.reviewById(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] }),
  });

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this? This action is permanent.')) return;
    deleteMutation.mutate(id);
  };

  if (isLoading) return <div className="text-center py-5 text-muted">Loading reviews...</div>;
  if (error) return <div className="text-center py-5 text-danger">Failed to load reviews.</div>;

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--maroon-800)', marginBottom: 16 }}>Reviews</h2>

      <div style={{ overflowX: 'auto' }}>
        <table className="w-100" style={{ borderCollapse: 'collapse', background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
          <thead>
            <tr style={{ background: 'var(--maroon-800)', color: 'var(--gold-300)' }}>
              {['Order #', 'Customer', 'Rating', 'Comment', 'Actions'].map((h) => (
                <th key={h} style={{ fontSize: 12, padding: '10px 12px', textAlign: 'start' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr><td colSpan={5}><div className="text-center py-5 text-muted">No data to display here.</div></td></tr>
            ) : (
              reviews.map((r, i) => (
                <tr key={r.reviewId} style={{ background: i % 2 === 1 ? '#FBF6EA' : '#fff' }}>
                  <td style={{ padding: '10px 12px', fontSize: 13 }}>#{r.orderNumber}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 700 }}>{r.customerName}</td>
                  <td style={{ padding: '10px 12px', fontSize: 14, color: 'var(--gold-500)' }}>
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: 13 }}>{r.comment || '—'}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <button
                      className="btn btn-sm"
                      style={{ background: 'var(--red-600)', color: '#fff', fontSize: 12, fontWeight: 800, borderRadius: 8 }}
                      disabled={deleteMutation.isPending}
                      onClick={() => handleDelete(r.reviewId)}
                    >
                      {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReviewsPanel;