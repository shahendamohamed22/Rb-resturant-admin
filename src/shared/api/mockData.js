export const mockCategories = [
  { key: 'burgers', labelEn: 'Burgers' },
  { key: 'chicken', labelEn: 'Chicken' },
  { key: 'roast', labelEn: 'Roast Meals' },
  { key: 'sides', labelEn: 'Sides & Sauces' },
];

export const mockMenuItems = [
  { id: 1, categoryKey: 'burgers', nameAr: 'أورجينال', nameEn: 'Original', descriptionAr: 'قطعة برجر محشية جبنة', descriptionEn: 'Cheese-stuffed beef patty', price: 90, imageUrl: null, isAvailable: true },
  { id: 2, categoryKey: 'burgers', nameAr: 'ريبابلك', nameEn: 'Republic', descriptionAr: 'قطعة برجر محشية جبنة، صوص شيدر', descriptionEn: 'Cheese-stuffed beef patty, cheddar sauce', price: 95, imageUrl: null, isAvailable: true },
  { id: 3, categoryKey: 'chicken', nameAr: 'تشاكي تشكن', nameEn: 'Chucky Chicken', descriptionAr: 'قطع كريسبي تتيلا', descriptionEn: 'Crispy tortilla chicken bites', price: 95, imageUrl: null, isAvailable: true },
  { id: 4, categoryKey: 'roast', nameAr: 'وجبة دينر', nameEn: 'Dinner Meal', descriptionAr: '3 قطع بروست + طحينة + بطاطس', descriptionEn: '3 pieces roast chicken + garlic sauce + fries', price: 140, imageUrl: null, isAvailable: true },
  { id: 5, categoryKey: 'sides', nameAr: 'فرايز', nameEn: 'Fries', descriptionAr: 'بطاطس مقرمشة', descriptionEn: 'Crispy fries', price: 20, imageUrl: null, isAvailable: false },
];

export const mockBranches = [
  { id: 1, nameAr: 'سوهاج', nameEn: 'Sohag', deliveryFee: 20, etaMinMinutes: 25, etaMaxMinutes: 35, isActive: true },
  { id: 2, nameAr: 'جرجا', nameEn: 'Girga', deliveryFee: 25, etaMinMinutes: 30, etaMaxMinutes: 45, isActive: true },
];

export const mockDrivers = [
  { driverId: 'd1', fullName: 'Karim Adel', phone: '01099988877', vehicle: 'bike', branchId: 1, isActive: true, deliveriesCompleted: 38, password: '1234' },
  { driverId: 'd2', fullName: 'Mohamed Fathy', phone: '01011122233', vehicle: 'car', branchId: 2, isActive: true, deliveriesCompleted: 24, password: '1234' },
];

export const mockCustomersList = [
  { customerId: 'c1', fullName: 'Ahmed Sami', phone: '01012345678', address: 'Republic St, Sohag', ordersCount: 4 },
  { customerId: 'c2', fullName: 'Marwa Abdallah', phone: '01098765432', address: 'University area, Sohag', ordersCount: 1 },
  { customerId: 'c3', fullName: 'Sara Hassan', phone: '01234567890', address: 'Station St, Girga', ordersCount: 2 },
];

export const mockAdminOrders = [
  { orderId: 'o1', orderNumber: 4821, branchId: 1, customerName: 'Ahmed Sami', total: 255, stage: 2, createdAt: new Date(Date.now() - 3600e3).toISOString() },
  { orderId: 'o2', orderNumber: 4822, branchId: 1, customerName: 'Marwa Abdallah', total: 135, stage: 0, createdAt: new Date(Date.now() - 1800e3).toISOString() },
  { orderId: 'o3', orderNumber: 4815, branchId: 1, customerName: 'Youssef Adel', total: 130, stage: 1, createdAt: new Date(Date.now() - 7200e3).toISOString() },
  { orderId: 'o4', orderNumber: 4809, branchId: 2, customerName: 'Sara Hassan', total: 165, stage: 3, createdAt: new Date(Date.now() - 86400e3).toISOString() },
];

export const mockReviews = [
  { reviewId: 'r1', orderNumber: 4809, customerName: 'Sara Hassan', rating: 5, comment: 'Food was hot and arrived fast' },
  { reviewId: 'r2', orderNumber: 4700, customerName: 'Mahmoud Ibrahim', rating: 4, comment: '' },
];

export const ORDERS_LAST_7_DAYS = [14, 19, 11, 23, 17, 26, 21];
export const REVENUE_LAST_7_DAYS = [1620, 2140, 1180, 2680, 1890, 3120, 2450];
export const TOP_ITEMS = [
  { nameEn: 'Original', sales: 142 },
  { nameEn: 'Republic', sales: 118 },
  { nameEn: 'Chucky Chicken', sales: 96 },
  { nameEn: 'Dinner Meal', sales: 81 },
  { nameEn: 'Fries', sales: 74 },
];
export const RATING_DISTRIBUTION = [2, 3, 9, 27, 46]; // [1★, 2★, 3★, 4★, 5★]

export const mockAdmin = {
  username: 'admin',
  password: 'admin123',
  name: 'Admin',
};