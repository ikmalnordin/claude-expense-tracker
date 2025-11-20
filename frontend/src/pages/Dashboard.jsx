import React, { useState, useEffect } from 'react';
import { expenseAPI } from '../services/api';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseFilter from '../components/ExpenseFilter';
import MonthlySummary from '../components/MonthlySummary';
import ExportButton from '../components/ExportButton';
import ErrorMessage from '../components/ErrorMessage';
import { getFirstDayOfMonth, getLastDayOfMonth } from '../utils/formatters';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    startDate: getFirstDayOfMonth(),
    endDate: getLastDayOfMonth(),
  });
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');

  const fetchExpenses = async (appliedFilters = filters) => {
    setLoading(true);
    setError(null);

    try {
      const response = await expenseAPI.getAllExpenses(appliedFilters);
      setExpenses(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchExpenses(newFilters);
  };

  const handleExpenseSuccess = () => {
    setExpenseToEdit(null);
    fetchExpenses();
  };

  const handleEdit = (expense) => {
    setExpenseToEdit(expense);
    setActiveTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = () => {
    fetchExpenses();
  };

  const handleCancelEdit = () => {
    setExpenseToEdit(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your personal expenses efficiently</p>
            </div>
            <div className="flex items-center gap-4">
              <ExportButton startDate={filters.startDate} endDate={filters.endDate} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('summary')}
                className={`${
                  activeTab === 'summary'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Summary
              </button>
              <button
                onClick={() => setActiveTab('add')}
                className={`${
                  activeTab === 'add'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {expenseToEdit ? 'Edit Expense' : 'Add Expense'}
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`${
                  activeTab === 'list'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Expense List
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'summary' && <MonthlySummary />}

          {activeTab === 'add' && (
            <ExpenseForm
              expenseToEdit={expenseToEdit}
              onSuccess={handleExpenseSuccess}
              onCancel={handleCancelEdit}
            />
          )}

          {activeTab === 'list' && (
            <>
              <ExpenseFilter onFilterChange={handleFilterChange} />
              {error && <ErrorMessage message={error} onRetry={() => fetchExpenses()} />}
              <ExpenseList
                expenses={expenses}
                loading={loading}
                onUpdate={handleEdit}
                onDelete={handleDelete}
              />
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Expense Tracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
