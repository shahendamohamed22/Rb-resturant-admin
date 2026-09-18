import { useSelector } from 'react-redux';
import { ORDERS_LAST_7_DAYS } from '../../shared/api/mockData';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function DashboardHero({ todayCount, revenue, avgRating, newOrders, activeDrivers }) {
  const name = useSelector((state) => state.auth.name);

  const todayIdx = new Date().getDay();
  const startIdx = (todayIdx - (ORDERS_LAST_7_DAYS.length - 1) + 700) % 7;
  const max = Math.max(...ORDERS_LAST_7_DAYS, 1);

  return (
    <div
      className="d-flex flex-wrap justify-content-between align-items-center gap-4 mb-4"
      style={{
        background: 'linear-gradient(135deg, var(--maroon-950), var(--maroon-800) 70%)',
        borderRadius: 22,
        padding: '28px 30px 20px',
        boxShadow: 'var(--shadow-card)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-400)', fontSize: 30, margin: '0 0 6px' }}>
          Welcome back, {name} 👋
        </h1>
        <div style={{ color: 'var(--gold-200)', fontSize: 12.5, opacity: 0.85, marginBottom: 10 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <div style={{ color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 14 }}>
          Today's orders: {todayCount} &nbsp;•&nbsp; Total revenue: {revenue} EGP
        </div>
        <div className="d-flex flex-wrap gap-2">
          {[
            ['New orders', newOrders],
            ['Active drivers', activeDrivers],
            ['Avg. rating', avgRating],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 999, padding: '7px 15px', fontSize: 12, fontWeight: 800, color: 'var(--gold-300)' }}
            >
              <b style={{ color: '#fff', fontFamily: 'var(--font-display)', fontSize: 14, marginRight: 5 }}>{value}</b>
              {label}
            </div>
          ))}
        </div>
      </div>

      <div style={{ flexShrink: 0, minWidth: 200 }}>
        <div style={{ color: 'var(--gold-200)', fontSize: 11.5, fontWeight: 800, marginBottom: 10, textAlign: 'center' }}>
          Orders — last 7 days
        </div>
        <div className="d-flex align-items-end gap-2" style={{ height: 64 }}>
          {ORDERS_LAST_7_DAYS.map((count, i) => {
            const dayLabel = DAY_LABELS[(startIdx + i) % 7];
            const height = Math.max(6, Math.round((count / max) * 56));
            return (
              <div key={i} className="d-flex flex-column align-items-center gap-1">
                <div
                  title={count}
                  style={{ width: 16, height, background: 'linear-gradient(180deg, var(--gold-400), var(--gold-500))', borderRadius: '5px 5px 2px 2px', transition: 'height .4s ease' }}
                />
                <div style={{ fontSize: 9, color: 'var(--gold-200)', opacity: 0.8 }}>{dayLabel}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DashboardHero;