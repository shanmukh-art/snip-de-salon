const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('snip_token');
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('snip_token', token);
  } else {
    localStorage.removeItem('snip_token');
  }
}

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred during the request');
  }

  return data;
}

export const api = {
  // Auth
  register: (body: any) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: any) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),
  updateProfile: (body: any) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
  changePassword: (body: any) => request('/auth/change-password', { method: 'PUT', body: JSON.stringify(body) }),

  // Services
  getServices: (params?: { category?: string; search?: string; isFeatured?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.isFeatured) query.set('isFeatured', 'true');
    return request(`/services?${query.toString()}`);
  },
  getServiceCategories: () => request('/services/categories'),
  getService: (idOrSlug: string) => request(`/services/${idOrSlug}`),
  createService: (body: any) => request('/services', { method: 'POST', body: JSON.stringify(body) }),
  updateService: (id: string, body: any) => request(`/services/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteService: (id: string) => request(`/services/${id}`, { method: 'DELETE' }),

  // Staff
  getStaff: () => request('/staff'),
  getStaffByService: (serviceId: string) => request(`/staff/by-service/${serviceId}`),
  createStaff: (body: any) => request('/staff', { method: 'POST', body: JSON.stringify(body) }),
  updateStaff: (id: string, body: any) => request(`/staff/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteStaff: (id: string) => request(`/staff/${id}`, { method: 'DELETE' }),

  // Appointments
  getAvailability: (serviceId: string, date: string, staffId: string = 'any') =>
    request(`/appointments/availability?serviceId=${serviceId}&date=${date}&staffId=${staffId}`),
  createAppointment: (body: any) => request('/appointments', { method: 'POST', body: JSON.stringify(body) }),
  getMyAppointments: () => request('/appointments/my-appointments'),
  cancelAppointment: (id: string) => request(`/appointments/${id}/cancel`, { method: 'POST' }),
  rescheduleAppointment: (id: string, body: { newDate: string; newStartTime: string }) =>
    request(`/appointments/${id}/reschedule`, { method: 'POST', body: JSON.stringify(body) }),
  getAdminAppointments: (params?: any) => {
    const query = new URLSearchParams(params).toString();
    return request(`/appointments?${query}`);
  },
  updateAppointmentStatus: (id: string, body: { status?: string; paymentStatus?: string }) =>
    request(`/appointments/${id}/status`, { method: 'PUT', body: JSON.stringify(body) }),

  // Products
  getProducts: (params?: any) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products?${query}`);
  },
  getProductCategories: () => request('/products/categories'),
  getProduct: (idOrSlug: string) => request(`/products/${idOrSlug}`),
  createProduct: (body: any) => request('/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id: string, body: any) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProduct: (id: string) => request(`/products/${id}`, { method: 'DELETE' }),

  // Cart
  getCart: () => request('/cart'),
  addToCart: (productId: string, quantity = 1) =>
    request('/cart/items', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
  updateCartItem: (itemId: string, quantity: number) =>
    request(`/cart/items/${itemId}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
  removeCartItem: (itemId: string) => request(`/cart/items/${itemId}`, { method: 'DELETE' }),

  // Orders
  createOrder: (body: any) => request('/orders', { method: 'POST', body: JSON.stringify(body) }),
  getMyOrders: () => request('/orders/my-orders'),
  getOrder: (idOrNumber: string) => request(`/orders/${idOrNumber}`),
  getAdminOrders: (params?: any) => {
    const query = new URLSearchParams(params).toString();
    return request(`/orders?${query}`);
  },
  updateOrderStatus: (id: string, body: { status?: string; paymentStatus?: string }) =>
    request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify(body) }),

  // Offers
  getOffers: () => request('/offers'),
  createOffer: (body: any) => request('/offers', { method: 'POST', body: JSON.stringify(body) }),
  updateOffer: (id: string, body: any) => request(`/offers/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteOffer: (id: string) => request(`/offers/${id}`, { method: 'DELETE' }),

  // Reviews
  getReviews: () => request('/reviews'),
  createReview: (body: any) => request('/reviews', { method: 'POST', body: JSON.stringify(body) }),
  updateReview: (id: string, body: any) => request(`/reviews/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteReview: (id: string) => request(`/reviews/${id}`, { method: 'DELETE' }),

  // Inquiries
  sendInquiry: (body: any) => request('/inquiries', { method: 'POST', body: JSON.stringify(body) }),
  getInquiries: () => request('/inquiries'),
  updateInquiryStatus: (id: string, status: string) =>
    request(`/inquiries/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Site Settings
  getSettings: () => request('/settings'),
  updateSettings: (body: any) => request('/settings', { method: 'PUT', body: JSON.stringify(body) }),

  // Payments
  createPaymentOrder: (body: any) => request('/payments/create-order', { method: 'POST', body: JSON.stringify(body) }),
  verifyPayment: (body: any) => request('/payments/verify', { method: 'POST', body: JSON.stringify(body) }),

  // Admin Dashboard & Analytics
  getAdminDashboard: () => request('/admin/dashboard'),
  getAdminAnalytics: () => request('/admin/analytics'),
  getAdminCustomers: () => request('/admin/customers'),
  getAdminCustomerDetails: (id: string) => request(`/admin/customers/${id}`),
};
