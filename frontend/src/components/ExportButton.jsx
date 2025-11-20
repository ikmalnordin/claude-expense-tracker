import React, { useState } from 'react';
import { expenseAPI } from '../services/api';
import ErrorMessage from './ErrorMessage';

const ExportButton = ({ startDate, endDate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExport = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await expenseAPI.exportToCSV(startDate, endDate);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <ErrorMessage message={error} />}
      <button
        onClick={handleExport}
        disabled={loading || !startDate || !endDate}
        className="btn btn-primary flex items-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        {loading ? 'Exporting...' : 'Export to CSV'}
      </button>
    </div>
  );
};

export default ExportButton;
