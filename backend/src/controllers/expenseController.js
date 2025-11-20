const ExpenseModel = require('../models/expenseModel');
const { convertToCSV } = require('../utils/csvExport');
const { AppError, asyncHandler } = require('../middleware/errorHandler');

/**
 * Create a new expense
 * POST /api/expenses
 */
const createExpense = asyncHandler(async (req, res) => {
  const { amount, category, description, date } = req.body;

  const expense = await ExpenseModel.create({
    amount,
    category,
    description: description || '',
    date
  });

  res.status(201).json({
    success: true,
    data: expense,
    message: 'Expense created successfully'
  });
});

/**
 * Get all expenses with optional filters
 * GET /api/expenses?category=Food&startDate=2024-01-01&endDate=2024-12-31
 */
const getAllExpenses = asyncHandler(async (req, res) => {
  const { category, startDate, endDate } = req.query;

  const filters = {};
  if (category) filters.category = category;
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;

  const expenses = await ExpenseModel.findAll(filters);

  res.status(200).json({
    success: true,
    count: expenses.length,
    data: expenses
  });
});

/**
 * Get single expense by ID
 * GET /api/expenses/:id
 */
const getExpenseById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const expense = await ExpenseModel.findById(id);

  if (!expense) {
    return next(new AppError('Expense not found', 404));
  }

  res.status(200).json({
    success: true,
    data: expense
  });
});

/**
 * Update expense
 * PUT /api/expenses/:id
 */
const updateExpense = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { amount, category, description, date } = req.body;

  // Check if expense exists
  const existingExpense = await ExpenseModel.findById(id);
  if (!existingExpense) {
    return next(new AppError('Expense not found', 404));
  }

  const updatedExpense = await ExpenseModel.update(id, {
    amount,
    category,
    description: description || '',
    date
  });

  res.status(200).json({
    success: true,
    data: updatedExpense,
    message: 'Expense updated successfully'
  });
});

/**
 * Delete expense
 * DELETE /api/expenses/:id
 */
const deleteExpense = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedExpense = await ExpenseModel.delete(id);

  if (!deletedExpense) {
    return next(new AppError('Expense not found', 404));
  }

  res.status(200).json({
    success: true,
    data: deletedExpense,
    message: 'Expense deleted successfully'
  });
});

/**
 * Get monthly summary
 * GET /api/expenses/summary/monthly?year=2024&month=1
 */
const getMonthlySummary = asyncHandler(async (req, res) => {
  // Default to current month if not provided
  const now = new Date();
  const year = parseInt(req.query.year) || now.getFullYear();
  const month = parseInt(req.query.month) || (now.getMonth() + 1);

  // Get current month summary
  const currentSummary = await ExpenseModel.getMonthlySummary(year, month);

  // Get previous month summary for comparison
  const previousSummary = await ExpenseModel.getPreviousMonthSummary(year, month);

  // Calculate percentage change
  let percentageChange = 0;
  if (previousSummary.totalAmount > 0) {
    percentageChange = (
      ((currentSummary.totalAmount - previousSummary.totalAmount) / previousSummary.totalAmount) * 100
    ).toFixed(2);
  } else if (currentSummary.totalAmount > 0) {
    percentageChange = 100;
  }

  res.status(200).json({
    success: true,
    data: {
      current: currentSummary,
      previous: {
        year: previousSummary.year,
        month: previousSummary.month,
        totalAmount: previousSummary.totalAmount
      },
      comparison: {
        percentageChange: parseFloat(percentageChange),
        difference: currentSummary.totalAmount - previousSummary.totalAmount
      }
    }
  });
});

/**
 * Export expenses to CSV
 * GET /api/expenses/export/csv?startDate=2024-01-01&endDate=2024-12-31
 */
const exportToCSV = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const expenses = await ExpenseModel.getExpensesForExport(startDate, endDate);

  const csv = convertToCSV(expenses);

  // Set headers for CSV download
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=expenses_${startDate}_to_${endDate}.csv`);

  res.status(200).send(csv);
});

module.exports = {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getMonthlySummary,
  exportToCSV
};
