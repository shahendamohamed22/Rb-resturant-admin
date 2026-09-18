import { useQueryClient, useMutation } from '@tanstack/react-query';
import api from '../../shared/api/axiosClient';
import { ENDPOINTS } from '../../shared/api/endpoints';
import { useCustomersQuery } from './useCustomersQuery';

function CustomersPanel() {
  const queryClient = useQueryClient();
  const { data: customers = [], isLoading, error } = useCustomersQuery();

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(ENDPOINTS.customerById(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] }),
  });

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this? This action is permanent.')) return;
    deleteMutation.mutate(id);
  };

  if (isLoading) return <div className="text-center py-5 text-muted">Loading customers...</div>;
  if (error) return <div className="text-center py-5 text-danger">Failed to load customers.</div>;

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--maroon-800)', marginBottom: 16 }}>Customers</h2>

      {deleteMutation.isError && (
        <p className="text-danger mb-2" style={{ fontSize: 13 }}>
          {deleteMutation.error?.response?.data?.title || 'Failed to delete customer'}
        </p>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table className="w-100" style={{ borderCollapse: 'collapse', background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
          <thead>
            <tr style={{ background: 'var(--maroon-800)', color: 'var(--gold-300)' }}>
              {['Customer', 'Phone', 'Orders', 'Actions'].map((h) => (
                <th key={h} style={{ fontSize: 12, padding: '10px 12px', textAlign: 'start' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr><td colSpan={4}><div className="text-center py-5 text-muted">No data to display here.</div></td></tr>
            ) : (
              customers.map((c, i) => (
                <tr key={c.customerId} style={{ background: i % 2 === 1 ? '#FBF6EA' : '#fff' }}>
                  <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 700 }}>{c.fullName}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13 }}>{c.phone}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13 }}>{c.ordersCount}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <button
                      className="btn btn-sm"
                      style={{ background: 'var(--red-600)', color: '#fff', fontSize: 12, fontWeight: 800, borderRadius: 8 }}
                      disabled={deleteMutation.isPending}
                      onClick={() => handleDelete(c.customerId)}
                    >
                      Delete
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

export default CustomersPanel;