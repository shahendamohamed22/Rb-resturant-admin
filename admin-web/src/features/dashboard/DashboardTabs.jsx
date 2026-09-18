function DashboardTabs({ activeTab, onTabChange }) {
  const tabs = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'menu', label: 'Menu' },
    { key: 'branches', label: 'Branches' },
    { key: 'drivers', label: 'Drivers' },
    { key: 'customers', label: 'Customers' },
    { key: 'orders', label: 'Orders' },
    { key: 'reviews', label: 'Reviews' },
  ];

  return (
    <div className="d-flex gap-2 mb-4" style={{ overflowX: 'auto', paddingBottom: 6 }}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className="btn"
          style={{
            flexShrink: 0,
            borderRadius: 999,
            fontWeight: 800,
            fontSize: 12.5,
            padding: '9px 16px',
            background: activeTab === tab.key ? 'var(--maroon-800)' : '#fff',
            color: activeTab === tab.key ? 'var(--gold-300)' : 'var(--ink-600)',
            border: `2px solid ${activeTab === tab.key ? 'var(--maroon-800)' : 'var(--line)'}`,
          }}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default DashboardTabs;