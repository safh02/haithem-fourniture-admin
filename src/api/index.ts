import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password });
export const getMe = () => api.get('/auth/me');

// Products
export const getProducts = (params?: any) => api.get('/products', { params });
export const getProduct = (id: number) => api.get(`/products/${id}`);
export const createProduct = (data: FormData) =>
  api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProduct = (id: number, data: FormData) =>
  api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProduct = (id: number) => api.delete(`/products/${id}`);
export const toggleProductStatus = (id: number) => api.patch(`/products/${id}/toggle`);
export const getCategories = () => api.get('/products/categories');

// Orders
export const getOrders = (params?: any) => api.get('/orders', { params });
export const getOrder = (id: number) => api.get(`/orders/${id}`);
export const updateOrderStatus = (id: number, status: string) =>
  api.patch(`/orders/${id}/status`, { status });

// Quotes
export const getQuotes = (params?: any) => api.get('/quotes', { params });
export const respondToQuote = (id: number, admin_response: string, status: string) =>
  api.patch(`/quotes/${id}/respond`, { admin_response, status });

// B2B
export const getB2BClients = () => api.get('/b2b');
export const getB2BClient = (id: number) => api.get(`/b2b/${id}`);
export const createB2BClient = (data: any) => api.post('/b2b', data);
export const updateB2BClient = (id: number, data: any) => api.put(`/b2b/${id}`, data);
export const setB2BDiscounts = (id: number, discounts: any[]) =>
  api.post(`/b2b/${id}/discounts`, { discounts });

// Analytics
export const getAnalyticsSummary = () => api.get('/analytics/summary');
export const getRevenueChart = () => api.get('/analytics/revenue');
export const getTopProducts = () => api.get('/analytics/top-products');
export const getCategoryBreakdown = () => api.get('/analytics/categories');

export default api;
