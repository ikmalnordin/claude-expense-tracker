import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    return Promise.reject(new Error(errorMessage));
  }
);

// Expense API methods
export const expenseAPI = {
  // Get all expenses with optional filters
  getAllExpenses: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    return api.get(`/expenses?${params.toString()}`);
  },

  // Get single expense by ID
  getExpenseById: async (id) => {
    return api.get(`/expenses/${id}`);
  },

  // Create new expense
  createExpense: async (expenseData) => {
    return api.post('/expenses', expenseData);
  },

  // Update expense
  updateExpense: async (id, expenseData) => {
    return api.put(`/expenses/${id}`, expenseData);
  },

  // Delete expense
  deleteExpense: async (id) => {
    return api.delete(`/expenses/${id}`);
  },

  // Get monthly summary
  getMonthlySummary: async (year, month) => {
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    if (month) params.append('month', month);

    return api.get(`/expenses/summary/monthly?${params.toString()}`);
  },

  // Export to CSV
  exportToCSV: async (startDate, endDate) => {
    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);

    const response = await axios.get(
      `${API_BASE_URL}/expenses/export/csv?${params.toString()}`,
      {
        responseType: 'blob',
        timeout: 10000,
      }
    );

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `expenses_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return { success: true };
  },
};

export default api;
