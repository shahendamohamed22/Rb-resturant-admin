import { useState } from 'react';
import { mockCustomersList } from '../../shared/api/mockData';

function CustomersPanel() {
  const [customers, setCustomers] = useState(mockCustomersList);

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this? This action is permanent.')) return;
    setCustomers((prev) => prev.filter((c) => c.customerId !== id));
  };

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--maroon-800)', marginBottom: 16 }}>Customers</h2>

      <div style={{ overflowX: 'auto' }}>
        <table className="w-100" style={{ borderCollapse: 'collapse', background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
          <thead>
            <tr style={{ background: 'var(--maroon-800)', color: 'var(--gold-300)' }}>
              {['Customer', 'Phone', 'Address', 'Orders', 'Actions'].map((h) => (
                <th key={h} style={{ fontSize: 12, padding: '10px 12px', textAlign: 'start' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr><td colSpan={5}><div className="text-center py-5 text-muted">No data to display here.</div></td></tr>
            ) : (
              customers.map((c, i) => (
                <tr key={c.customerId} style={{ background: i % 2 === 1 ? '#FBF6EA' : '#fff' }}>
                  <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 700 }}>{c.fullName}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13 }}>{c.phone}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13 }}>{c.address}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13 }}>{c.ordersCount}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <button
                      className="btn btn-sm"
                      style={{ background: 'var(--red-600)', color: '#fff', fontSize: 12, fontWeight: 800, borderRadius: 8 }}
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