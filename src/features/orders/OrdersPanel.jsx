import { useState } from 'react';
import { mockAdminOrders, mockBranches } from '../../shared/api/mockData';

const STAGE_LABELS = ['Confirmed', 'Preparing', 'On the way', 'Delivered'];
const STAGE_COLORS = ['var(--gold-200)', '#DCE9F7', '#FDE3D0', '#DCF3E4'];
const STAGE_TEXT = ['var(--maroon-800)', 'var(--blue-600)', '#B2601A', 'var(--green-600)'];

function OrdersPanel() {
  const [orders, setOrders] = useState(mockAdminOrders);

  const branchName = (id) => mockBranches.find((b) => b.id === id)?.nameEn || id;

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this? This action is permanent.')) return;
    setOrders((prev) => prev.filter((o) => o.orderId !== id));
  };

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--maroon-800)', marginBottom: 16 }}>Orders</h2>

      <div style={{ overflowX: 'auto' }}>
        <table className="w-100" style={{ borderCollapse: 'collapse', background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
          <thead>
            <tr style={{ background: 'var(--maroon-800)', color: 'var(--gold-300)' }}>
              {['Order #', 'Branch', 'Customer', 'Total', 'Status', 'Date', 'Actions'].map((h) => (
                <th key={h} style={{ fontSize: 12, padding: '10px 12px', textAlign: 'start' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={7}><div className="text-center py-5 text-muted">No data to display here.</div></td></tr>
            ) : (
              orders.map((o, i) => (
                <tr key={o.orderId} style={{ background: i % 2 === 1 ? '#FBF6EA' : '#fff' }}>
                  <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 700 }}>#{o.orderNumber}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13 }}>{branchName(o.branchId)}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13 }}>{o.customerName}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13 }}>{o.total} EGP</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span
                      style={{
                        fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 999,
                        background: STAGE_COLORS[o.stage], color: STAGE_TEXT[o.stage],
                      }}
                    >
                      {STAGE_LABELS[o.stage]}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: 13 }}>
                    {new Date(o.createdAt).toLocaleDateString('en-US')}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <button
                      className="btn btn-sm"
                      style={{ background: 'var(--red-600)', color: '#fff', fontSize: 12, fontWeight: 800, borderRadius: 8 }}
                      onClick={() => handleDelete(o.orderId)}
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

export default OrdersPanel;