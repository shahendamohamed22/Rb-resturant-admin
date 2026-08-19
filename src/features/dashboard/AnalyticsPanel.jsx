import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar,
} from 'recharts';
import { mockAdminOrders, REVENUE_LAST_7_DAYS, TOP_ITEMS, mockDrivers, RATING_DISTRIBUTION } from '../../shared/api/mockData';

const COLORS = {
  maroon: '#5C1220', gold: '#F2A93B', goldLight: '#F7BE5F', goldPale: '#FBD383',
  green: '#3F8F5F', blue: '#2F6FB2', orange: '#D9791E', line: '#EADFC9',
};

const STAGE_LABELS = ['Confirmed', 'Preparing', 'On the way', 'Delivered'];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function KpiCard({ icon, label, value, delta, up }) {
  return (
    <div className="bg-white p-3" style={{ borderRadius: 16, border: '1px solid var(--line)', boxShadow: 'var(--shadow-card)' }}>
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--gold-200)', color: 'var(--maroon-800)', fontSize: 17 }}
        >
          {icon}
        </div>
        <span
          className="badge"
          style={{ fontSize: 11, fontWeight: 800, padding: '3px 9px', borderRadius: 999, background: up ? '#DCF3E4' : '#F3DCDC', color: up ? 'var(--green-600)' : 'var(--red-600)' }}
        >
          {delta}
        </span>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--maroon-800)' }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--ink-600)', fontWeight: 700, marginTop: 4 }}>
        {label} · <span style={{ opacity: 0.7 }}>vs. last week</span>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children, full }) {
  return (
    <div className={full ? 'col-12' : 'col-md-6'}>
      <div className="bg-white p-3 h-100" style={{ borderRadius: 16, border: '1px solid var(--line)', boxShadow: 'var(--shadow-card)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--maroon-800)', fontSize: 17, margin: '0 0 4px' }}>{title}</h3>
        <p style={{ fontSize: 11.5, color: 'var(--ink-600)', marginBottom: 12 }}>{subtitle}</p>
        <div style={{ height: 240 }}>{children}</div>
      </div>
    </div>
  );
}

function AnalyticsPanel() {
  const totalRevenue = mockAdminOrders.reduce((s, o) => s + o.total, 0);
  const totalOrders = mockAdminOrders.length;
  const avgOrder = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;
  const delivered = mockAdminOrders.filter((o) => o.stage === 3).length;
  const completionRate = totalOrders ? Math.round((delivered / totalOrders) * 100) : 0;

  const todayIdx = new Date().getDay();
  const startIdx = (todayIdx - (REVENUE_LAST_7_DAYS.length - 1) + 700) % 7;
  const revenueData = REVENUE_LAST_7_DAYS.map((value, i) => ({
    day: DAY_LABELS[(startIdx + i) % 7],
    revenue: value,
  }));

  const statusData = [0, 1, 2, 3].map((stage) => ({
    name: STAGE_LABELS[stage],
    value: mockAdminOrders.filter((o) => o.stage === stage).length,
  }));

  const branchData = [1, 2].map((branchId) => ({
    name: branchId === 1 ? 'Sohag' : 'Girga',
    value: mockAdminOrders.filter((o) => o.branchId === branchId).length,
  }));

  const driverData = mockDrivers.map((d) => ({ name: d.fullName, deliveries: d.deliveriesCompleted }));
  const ratingData = RATING_DISTRIBUTION.map((count, i) => ({ stars: `${i + 1}★`, count }));

  return (
    <div>
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3"><KpiCard icon="💰" label="Total Revenue" value={`${totalRevenue} EGP`} delta="+8%" up /></div>
        <div className="col-6 col-md-3"><KpiCard icon="🧾" label="Total Orders" value={totalOrders} delta="+5%" up /></div>
        <div className="col-6 col-md-3"><KpiCard icon="📊" label="Avg. Order Value" value={`${avgOrder} EGP`} delta="-2%" up={false} /></div>
        <div className="col-6 col-md-3"><KpiCard icon="✅" label="Order Completion Rate" value={`${completionRate}%`} delta="+3%" up /></div>
      </div>

      <div className="row g-3">
        <ChartCard title="Revenue — Last 7 Days" subtitle="In Egyptian Pounds" full>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid stroke={COLORS.line} vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke={COLORS.maroon} strokeWidth={2} dot={{ fill: COLORS.gold, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Current Order Status" subtitle="Distribution of orders by fulfillment stage">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85}>
                {statusData.map((_, i) => (
                  <Cell key={i} fill={[COLORS.goldPale, COLORS.gold, COLORS.orange, COLORS.green][i]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Orders by Branch" subtitle="Share of orders per branch">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={branchData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85}>
                {branchData.map((_, i) => (
                  <Cell key={i} fill={[COLORS.maroon, COLORS.gold][i]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top-Selling Items" subtitle="Number of times each item was ordered">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={TOP_ITEMS} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid stroke={COLORS.line} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="nameEn" tick={{ fontSize: 11 }} width={90} />
              <Tooltip />
              <Bar dataKey="sales" fill={COLORS.gold} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Driver Performance" subtitle="Completed deliveries per driver">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={driverData}>
              <CartesianGrid stroke={COLORS.line} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="deliveries" fill={COLORS.blue} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Customer Rating Distribution" subtitle="Number of reviews per star rating" full>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ratingData}>
              <CartesianGrid stroke={COLORS.line} vertical={false} />
              <XAxis dataKey="stars" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill={COLORS.green} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

export default AnalyticsPanel;