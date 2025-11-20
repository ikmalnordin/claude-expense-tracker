import React, { useState, useEffect } from 'react';
import { expenseAPI } from '../services/api';
import { formatDateForInput, getCurrentDate } from '../utils/formatters';
import ErrorMessage from './ErrorMessage';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];

const ExpenseForm = ({ expenseToEdit, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    description: '',
    date: getCurrentDate(),
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Populate form when editing
  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        amount: expenseToEdit.amount,
        category: expenseToEdit.category,
        description: expenseToEdit.description || '',
        date: formatDateForInput(expenseToEdit.date),
      });
    }
  }, [expenseToEdit]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const expenseData = {
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        date: formData.date,
      };

      if (expenseToEdit) {
        await expenseAPI.updateExpense(expenseToEdit.id, expenseData);
      } else {
        await expenseAPI.createExpense(expenseData);
      }

      // Reset form
      setFormData({
        amount: '',
        category: 'Food',
        description: '',
        date: getCurrentDate(),
      });

      onSuccess && onSuccess();
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      amount: '',
      category: 'Food',
      description: '',
      date: getCurrentDate(),
    });
    setErrors({});
    setApiError(null);
    onCancel && onCancel();
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">
        {expenseToEdit ? 'Edit Expense' : 'Add New Expense'}
      </h2>

      {apiError && <ErrorMessage message={apiError} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount *
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0.01"
            className={`input ${errors.amount ? 'border-red-500' : ''}`}
            placeholder="0.00"
            required
          />
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`input ${errors.category ? 'border-red-500' : ''}`}
            required
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            maxLength="500"
            className={`input ${errors.description ? 'border-red-500' : ''}`}
            placeholder="Optional description..."
          />
          <p className="text-gray-500 text-xs mt-1">
            {formData.description.length}/500 characters
          </p>
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`input ${errors.date ? 'border-red-500' : ''}`}
            required
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading} className="btn btn-primary flex-1">
            {loading ? 'Saving...' : expenseToEdit ? 'Update Expense' : 'Add Expense'}
          </button>
          <button type="button" onClick={handleReset} className="btn btn-secondary">
            {expenseToEdit ? 'Cancel' : 'Reset'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
