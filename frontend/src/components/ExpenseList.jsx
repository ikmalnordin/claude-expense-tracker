import React, { useState } from 'react';
import { expenseAPI } from '../services/api';
import { formatCurrency, formatDate, getCategoryColor } from '../utils/formatters';
import LoadingSpinner from './LoadingSpinner';

const ExpenseList = ({ expenses, loading, onUpdate, onDelete }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    setDeletingId(id);
    try {
      await expenseAPI.deleteExpense(id);
      onDelete && onDelete(id);
    } catch (error) {
      alert(`Error deleting expense: ${error.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading expenses..." />;
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No expenses found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding a new expense.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Expense List</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">Date</th>
              <th className="table-header">Category</th>
              <th className="table-header">Description</th>
              <th className="table-header text-right">Amount</th>
              <th className="table-header text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50">
                <td className="table-cell text-sm text-gray-900">
                  {formatDate(expense.date)}
                </td>
                <td className="table-cell">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getCategoryColor(
                      expense.category
                    )}`}
                  >
                    {expense.category}
                  </span>
                </td>
                <td className="table-cell text-sm text-gray-600">
                  {expense.description || '-'}
                </td>
                <td className="table-cell text-sm text-gray-900 text-right font-medium">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="table-cell text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onUpdate && onUpdate(expense)}
                      className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      disabled={deletingId === expense.id}
                      className="text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50"
                    >
                      {deletingId === expense.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        Total: {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default ExpenseList;
