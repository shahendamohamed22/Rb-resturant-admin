import { useState } from 'react';
import Header from '../../shared/components/Header';
import DashboardHero from './DashboardHero';
import StatsRow from './StatsRow';
import DashboardTabs from './DashboardTabs';
import AnalyticsPanel from './AnalyticsPanel';
import { mockMenuItems, mockBranches, mockDrivers, mockAdminOrders, mockReviews } from '../../shared/api/mockData';
import MenuPanel from '../menu/MenuPanel';
import BranchesPanel from '../branches/BranchesPanel';
import DriversPanel from '../drivers/DriversPanel';
import CustomersPanel from '../customers/CustomersPanel';
import OrdersPanel from '../orders/OrdersPanel';
import ReviewsPanel from '../reviews/ReviewsPanel';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const todayCount = mockAdminOrders.filter((o) => Date.now() - new Date(o.createdAt).getTime() < 86400e3).length;
  const revenue = mockAdminOrders.reduce((s, o) => s + o.total, 0);
  const avgRating = mockReviews.length
    ? (mockReviews.reduce((s, r) => s + r.rating, 0) / mockReviews.length).toFixed(1)
    : '—';
  const newOrders = mockAdminOrders.filter((o) => o.stage === 0).length;
  const activeDrivers = mockDrivers.filter((d) => d.isActive).length;

  const stats = [
    ['Menu Items', mockMenuItems.length],
    ['Branches', mockBranches.length],
    ['Drivers', mockDrivers.length],
    ["Today's Orders", todayCount],
    ['Total Revenue', `${revenue} EGP`],
    ['Avg. Rating', avgRating],
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream-50)' }}>
      <Header />
      <div className="container py-4">
        <DashboardHero
          todayCount={todayCount}
          revenue={revenue}
          avgRating={avgRating}
          newOrders={newOrders}
          activeDrivers={activeDrivers}
        />
        <StatsRow stats={stats} />
        <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'dashboard' && <AnalyticsPanel />}
        {activeTab === 'menu' && <MenuPanel />}
        {activeTab === 'branches' && <BranchesPanel />}
        {activeTab === 'drivers' && <DriversPanel />}
        {activeTab === 'customers' && <CustomersPanel />}
        {activeTab === 'orders' && <OrdersPanel />}
        {activeTab === 'reviews' && <ReviewsPanel />}

      </div>
    </div>
  );
}

export default AdminDashboard;