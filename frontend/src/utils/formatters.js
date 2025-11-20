import { format, parseISO } from 'date-fns';

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @param {string} formatStr - Format pattern (default: 'MMM dd, yyyy')
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, formatStr = 'MMM dd, yyyy') => {
  if (!dateString) return '';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format date for input field (YYYY-MM-DD)
 * @param {Date|string} date - Date object or string
 * @returns {string} Date in YYYY-MM-DD format
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
};

/**
 * Get current date in YYYY-MM-DD format
 * @returns {string} Current date
 */
export const getCurrentDate = () => {
  return format(new Date(), 'yyyy-MM-dd');
};

/**
 * Get first day of current month in YYYY-MM-DD format
 * @returns {string} First day of month
 */
export const getFirstDayOfMonth = () => {
  const now = new Date();
  return format(new Date(now.getFullYear(), now.getMonth(), 1), 'yyyy-MM-dd');
};

/**
 * Get last day of current month in YYYY-MM-DD format
 * @returns {string} Last day of month
 */
export const getLastDayOfMonth = () => {
  const now = new Date();
  return format(new Date(now.getFullYear(), now.getMonth() + 1, 0), 'yyyy-MM-dd');
};

/**
 * Validate if string is a valid date
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid
 */
export const isValidDate = (dateString) => {
  if (!dateString) return false;
  try {
    const date = parseISO(dateString);
    return date instanceof Date && !isNaN(date);
  } catch {
    return false;
  }
};

/**
 * Get category color
 * @param {string} category - Expense category
 * @returns {string} Tailwind color class
 */
export const getCategoryColor = (category) => {
  const colors = {
    Food: 'bg-orange-500',
    Transport: 'bg-blue-500',
    Shopping: 'bg-purple-500',
    Bills: 'bg-red-500',
    Entertainment: 'bg-green-500',
    Other: 'bg-gray-500',
  };
  return colors[category] || colors.Other;
};

/**
 * Get category chart color
 * @param {string} category - Expense category
 * @returns {string} Chart.js color
 */
export const getCategoryChartColor = (category) => {
  const colors = {
    Food: '#f97316',
    Transport: '#3b82f6',
    Shopping: '#a855f7',
    Bills: '#ef4444',
    Entertainment: '#22c55e',
    Other: '#6b7280',
  };
  return colors[category] || colors.Other;
};
