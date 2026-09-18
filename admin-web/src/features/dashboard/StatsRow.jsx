function StatsRow({ stats }) {
  return (
    <div className="row g-3 mb-4">
      {stats.map(([label, value]) => (
        <div key={label} className="col-6 col-md-2">
          <div className="text-center bg-white p-3" style={{ borderRadius: 16, border: '1px solid var(--line)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--maroon-800)' }}>{value}</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-600)', fontWeight: 700 }}>{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsRow;