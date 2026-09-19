import { useState } from 'react';
import Header from '../../shared/components/Header';
import DashboardHero from './DashboardHero';
import StatsRow from './StatsRow';
import DashboardTabs from './DashboardTabs';
import AnalyticsPanel from './AnalyticsPanel';
import MenuPanel from '../menu/MenuPanel';
import BranchesPanel from '../branches/BranchesPanel';
import DriversPanel from '../drivers/DriversPanel';
import CustomersPanel from '../customers/CustomersPanel';
import OrdersPanel from '../orders/OrdersPanel';
import ReviewsPanel from '../reviews/ReviewsPanel';
import { useAnalyticsOverviewQuery } from './useAnalyticsQueries';
import {
  useBranchesCountQuery,
  useDriversCountQuery,
  useMenuItemsCountQuery,
  useReviewsSummaryQuery,
} from './useDashboardSummaryQueries';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const { data: overviewToday } = useAnalyticsOverviewQuery('today');
  const { data: overviewAll } = useAnalyticsOverviewQuery('30d');
  const { data: branchesCount } = useBranchesCountQuery();
  const { data: driversSummary } = useDriversCountQuery();
  const { data: menuItemsCount } = useMenuItemsCountQuery();
  const { data: avgRating } = useReviewsSummaryQuery();

  console.log({ overviewToday, overviewAll, branchesCount, driversSummary, menuItemsCount, avgRating });
  const isReady = overviewToday && overviewAll && branchesCount !== undefined && driversSummary && menuItemsCount !== undefined && avgRating;

  if (!isReady) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream-50)' }}>
        <Header />
        <p className="text-muted text-center py-5">Loading dashboard...</p>
      </div>
    );
  }

  const stats = [
    ['Menu Items', menuItemsCount],
    ['Branches', branchesCount],
    ['Drivers', driversSummary.total],
    ["Today's Orders", overviewToday.totalOrders],
    ['Total Revenue', `${overviewAll.totalRevenue} EGP`],
    ['Avg. Rating', avgRating],
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream-50)' }}>
      <Header />
      <div className="container py-4">
        <DashboardHero
          todayCount={overviewToday.totalOrders}
          revenue={overviewAll.totalRevenue}
          avgRating={avgRating}
          newOrders={overviewToday.totalOrders}
          activeDrivers={driversSummary.active}
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