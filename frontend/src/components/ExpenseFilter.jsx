import React, { useState } from 'react';
import { getFirstDayOfMonth, getLastDayOfMonth } from '../utils/formatters';

const CATEGORIES = ['All', 'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];

const ExpenseFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    category: '',
    startDate: getFirstDayOfMonth(),
    endDate: getLastDayOfMonth(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value,
    };

    // Clear category if "All" is selected
    if (name === 'category' && value === 'All') {
      newFilters.category = '';
    }

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      category: '',
      startDate: getFirstDayOfMonth(),
      endDate: getLastDayOfMonth(),
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Filter Expenses</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={filters.category || 'All'}
            onChange={handleChange}
            className="input"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date Filter */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* End Date Filter */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="input"
          />
        </div>
      </div>

      <div className="mt-4">
        <button onClick={handleReset} className="btn btn-secondary text-sm">
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default ExpenseFilter;
