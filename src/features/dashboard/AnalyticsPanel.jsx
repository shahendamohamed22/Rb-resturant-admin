import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar,
} from 'recharts';
import {
  useAnalyticsOverviewQuery,
  useRevenueTrendQuery,
  useOrdersByStatusQuery,
  useOrdersByBranchQuery,
  useTopItemsQuery,
  useDriverPerformanceQuery,
  useRatingDistributionQuery,
} from './useAnalyticsQueries';

const COLORS = {
  maroon: '#5C1220', gold: '#F2A93B', goldLight: '#F7BE5F', goldPale: '#FBD383',
  green: '#3F8F5F', blue: '#2F6FB2', orange: '#D9791E', line: '#EADFC9',
};

const STAGE_LABELS = ['Confirmed', 'Preparing', 'On the way', 'Delivered'];

function KpiCard({ icon, label, value, delta }) {
  const up = delta >= 0;
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
          {up ? '+' : ''}{delta}%
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
  const { data: overview, isLoading: l1 } = useAnalyticsOverviewQuery('7d');
  const { data: revenueTrend, isLoading: l2 } = useRevenueTrendQuery(7);
  const { data: statusData, isLoading: l3 } = useOrdersByStatusQuery();
  const { data: branchData, isLoading: l4 } = useOrdersByBranchQuery();
  const { data: topItems, isLoading: l5 } = useTopItemsQuery(5);
  const { data: driverData, isLoading: l6 } = useDriverPerformanceQuery();
  const { data: ratingData, isLoading: l7 } = useRatingDistributionQuery();

  if (l1 || l2 || l3 || l4 || l5 || l6 || l7) {
    return <p className="text-muted text-center py-5">Loading analytics...</p>;
  }

  return (
    <div>
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <KpiCard icon="💰" label="Total Revenue" value={`${overview.totalRevenue} EGP`} delta={overview.deltas.revenue} />
        </div>
        <div className="col-6 col-md-3">
          <KpiCard icon="🧾" label="Total Orders" value={overview.totalOrders} delta={overview.deltas.orders} />
        </div>
        <div className="col-6 col-md-3">
          <KpiCard icon="📊" label="Avg. Order Value" value={`${overview.avgOrderValue} EGP`} delta={overview.deltas.avgOrderValue} />
        </div>
        <div className="col-6 col-md-3">
          <KpiCard icon="✅" label="Order Completion Rate" value={`${overview.completionRatePercent ?? 0}%`} delta={overview.deltas.completionRate ?? 0} />
        </div>
      </div>

      <div className="row g-3">
        <ChartCard title="Revenue — Last 7 Days" subtitle="In Egyptian Pounds" full>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueTrend}>
              <CartesianGrid stroke={COLORS.line} vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke={COLORS.maroon} strokeWidth={2} dot={{ fill: COLORS.gold, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Current Order Status" subtitle="Distribution of orders by fulfillment stage">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData.map((s) => ({ name: STAGE_LABELS[s.stage], value: s.count }))}
                dataKey="value" nameKey="name" innerRadius={55} outerRadius={85}
              >
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
              <Pie
                data={branchData.map((b) => ({ name: b.nameEn, value: b.count }))}
                dataKey="value" nameKey="name" innerRadius={55} outerRadius={85}
              >
                {branchData.map((_, i) => (
                  <Cell key={i} fill={[COLORS.maroon, COLORS.gold, COLORS.blue, COLORS.green][i % 4]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top-Selling Items" subtitle="Number of times each item was ordered">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topItems} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid stroke={COLORS.line} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="nameEn" tick={{ fontSize: 11 }} width={90} />
              <Tooltip />
              <Bar dataKey="unitsSold" fill={COLORS.gold} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Driver Performance" subtitle="Completed deliveries per driver">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={driverData}>
              <CartesianGrid stroke={COLORS.line} vertical={false} />
              <XAxis dataKey="fullName" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="deliveriesCompleted" fill={COLORS.blue} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Customer Rating Distribution" subtitle="Number of reviews per star rating" full>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ratingData.map((r) => ({ stars: `${r.stars}★`, count: r.count }))}>
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