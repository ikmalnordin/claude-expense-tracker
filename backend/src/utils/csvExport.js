/**
 * Convert expenses data to CSV format
 * @param {Array} expenses - Array of expense objects
 * @returns {string} CSV formatted string
 */
function convertToCSV(expenses) {
  if (!expenses || expenses.length === 0) {
    return 'ID,Amount,Category,Description,Date,Created At\n';
  }

  // Define CSV headers
  const headers = ['ID', 'Amount', 'Category', 'Description', 'Date', 'Created At'];
  const headerRow = headers.join(',') + '\n';

  // Convert each expense to CSV row
  const rows = expenses.map(expense => {
    // Format date to readable format
    const expenseDate = new Date(expense.date).toLocaleDateString('en-US');
    const createdAt = new Date(expense.created_at).toLocaleString('en-US');

    // Escape commas and quotes in description
    const escapedDescription = escapeCSVField(expense.description || '');

    return [
      expense.id,
      expense.amount,
      expense.category,
      escapedDescription,
      expenseDate,
      createdAt
    ].join(',');
  });

  return headerRow + rows.join('\n');
}

/**
 * Escape special characters in CSV fields
 * @param {string} field - Field value to escape
 * @returns {string} Escaped field value
 */
function escapeCSVField(field) {
  if (field == null) return '';

  const stringField = String(field);

  // If field contains comma, quotes, or newlines, wrap it in quotes
  if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
    // Escape existing quotes by doubling them
    return `"${stringField.replace(/"/g, '""')}"`;
  }

  return stringField;
}

module.exports = {
  convertToCSV,
  escapeCSVField
};
