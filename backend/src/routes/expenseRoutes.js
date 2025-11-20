const express = require('express');
const router = express.Router();
const {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getMonthlySummary,
  exportToCSV
} = require('../controllers/expenseController');
const {
  expenseValidationRules,
  uuidValidationRules,
  filterValidationRules,
  exportValidationRules,
  monthlySummaryValidationRules,
  validate
} = require('../middleware/validator');

// Export and summary routes (must come before /:id to avoid conflicts)
router.get(
  '/export/csv',
  exportValidationRules(),
  validate,
  exportToCSV
);

router.get(
  '/summary/monthly',
  monthlySummaryValidationRules(),
  validate,
  getMonthlySummary
);

// CRUD routes
router.post(
  '/',
  expenseValidationRules(),
  validate,
  createExpense
);

router.get(
  '/',
  filterValidationRules(),
  validate,
  getAllExpenses
);

router.get(
  '/:id',
  uuidValidationRules(),
  validate,
  getExpenseById
);

router.put(
  '/:id',
  uuidValidationRules(),
  expenseValidationRules(),
  validate,
  updateExpense
);

router.delete(
  '/:id',
  uuidValidationRules(),
  validate,
  deleteExpense
);

module.exports = router;
