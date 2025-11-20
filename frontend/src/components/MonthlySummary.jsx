import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { expenseAPI } from '../services/api';
import { formatCurrency, getCategoryChartColor } from '../utils/formatters';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

// Register Chart.js components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlySummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);

    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      const response = await expenseAPI.getMonthlySummary(year, month);
      setSummary(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading summary..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchSummary} />;
  }

  if (!summary || !summary.current) {
    return (
      <div className="card">
        <p className="text-gray-600">No summary data available.</p>
      </div>
    );
  }

  const { current, previous, comparison } = summary;

  // Prepare pie chart data
  const pieData = {
    labels: current.categoryBreakdown.map((item) => item.category),
    datasets: [
      {
        data: current.categoryBreakdown.map((item) => item.total),
        backgroundColor: current.categoryBreakdown.map((item) =>
          getCategoryChartColor(item.category)
        ),
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  // Prepare bar chart data
  const barData = {
    labels: current.categoryBreakdown.map((item) => item.category),
    datasets: [
      {
        label: 'Spending by Category',
        data: current.categoryBreakdown.map((item) => item.total),
        backgroundColor: current.categoryBreakdown.map((item) =>
          getCategoryChartColor(item.category)
        ),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const monthName = new Date(current.year, current.month - 1).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const isIncrease = comparison.percentageChange > 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Expenses - {monthName}</h3>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(current.totalAmount)}</p>
          <p className="text-sm text-gray-500 mt-1">{current.totalCount} transactions</p>
        </div>

        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Previous Month</h3>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(previous.totalAmount)}</p>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(previous.year, previous.month - 1).toLocaleString('default', {
              month: 'long',
            })}
          </p>
        </div>

        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Change</h3>
          <div className="flex items-baseline gap-2">
            <p
              className={`text-3xl font-bold ${
                isIncrease ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {isIncrease ? '+' : ''}
              {comparison.percentageChange.toFixed(1)}%
            </p>
            <span
              className={`text-sm font-medium ${
                isIncrease ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {isIncrease ? '↑' : '↓'}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {isIncrease ? '+' : ''}
            {formatCurrency(comparison.difference)}
          </p>
        </div>
      </div>

      {/* Charts */}
      {current.categoryBreakdown.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
            <div className="h-80">
              <Pie data={pieData} options={chartOptions} />
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
            <div className="h-80">
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>
        </div>
      )}

      {/* Category Breakdown Table */}
      {current.categoryBreakdown.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Category</th>
                  <th className="table-header text-right">Amount</th>
                  <th className="table-header text-right">Count</th>
                  <th className="table-header text-right">Percentage</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {current.categoryBreakdown.map((item) => {
                  const percentage = ((item.total / current.totalAmount) * 100).toFixed(1);
                  return (
                    <tr key={item.category}>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getCategoryChartColor(item.category) }}
                          ></div>
                          <span className="font-medium">{item.category}</span>
                        </div>
                      </td>
                      <td className="table-cell text-right font-medium">
                        {formatCurrency(item.total)}
                      </td>
                      <td className="table-cell text-right">{item.count}</td>
                      <td className="table-cell text-right">{percentage}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlySummary;
