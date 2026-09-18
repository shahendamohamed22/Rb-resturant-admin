// Centralized route constants for the Admin Dashboard only.
// Matches §7.6.0 through §7.6.6 of the documentation.

export const ENDPOINTS = {
  // §7.6.0 Admin Auth
  adminLogin: '/auth/admin/login',

  // §7.6.1 Menu Management
  menuItems: '/admin/menu-items',
  menuItemById: (id) => `/admin/menu-items/${id}`,

  // Branch Management
  branches: '/branches',              // GET (public list)
  createBranch: '/admin/branches',    // POST
  branchById: (id) => `/admin/branches/${id}`,           // PUT, DELETE
  branchToggleStatus: (id) => `/admin/branches/${id}/toggle-status`, // PATCH

  // §7.6.3 Driver Management
  drivers: '/admin/drivers',
  driverById: (id) => `/admin/drivers/${id}`,
  driverStatus: (id) => `/admin/drivers/${id}/status`,
  driverToggleStatus: (id) => `/admin/drivers/${id}/toggle-status`,

  // §7.6.4 Customer Management
  customers: '/admin/customers',
  customerById: (id) => `/admin/customers/${id}`,

  // §7.6.5 Order Monitoring
  orders: '/admin/orders',
  orderById: (id) => `/admin/orders/${id}`,

  // §7.6.6 Reviews & Analytics
  reviews: '/admin/reviews',
  reviewById: (id) => `/admin/reviews/${id}`,
  analyticsOverview: (range) => `/admin/analytics/overview?range=${range}`,
  analyticsRevenueTrend: (days) => `/admin/analytics/revenue-trend?days=${days}`,
  analyticsOrdersByStatus: '/admin/analytics/orders-by-status',
  analyticsOrdersByBranch: '/admin/analytics/orders-by-branch',
  analyticsTopItems: (limit) => `/admin/analytics/top-items?limit=${limit}`,
  analyticsDriverPerformance: '/admin/analytics/driver-performance',
  analyticsRatingDistribution: '/admin/analytics/rating-distribution',
};