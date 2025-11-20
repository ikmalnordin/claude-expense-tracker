const { body, param, query, validationResult } = require('express-validator');

// Valid expense categories
const VALID_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];

// Validation rules for creating/updating expenses
const expenseValidationRules = () => {
  return [
    body('amount')
      .notEmpty()
      .withMessage('Amount is required')
      .isFloat({ min: 0.01 })
      .withMessage('Amount must be a positive number'),
    body('category')
      .notEmpty()
      .withMessage('Category is required')
      .isIn(VALID_CATEGORIES)
      .withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),
    body('description')
      .optional()
      .isString()
      .withMessage('Description must be a string')
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description must not exceed 500 characters'),
    body('date')
      .notEmpty()
      .withMessage('Date is required')
      .isISO8601()
      .withMessage('Date must be a valid ISO 8601 date (YYYY-MM-DD)')
      .custom((value) => {
        const date = new Date(value);
        const now = new Date();
        // Allow dates up to 1 year in the future
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 1);

        if (date > maxDate) {
          throw new Error('Date cannot be more than 1 year in the future');
        }
        return true;
      })
  ];
};

// Validation rules for UUID parameters
const uuidValidationRules = () => {
  return [
    param('id')
      .isUUID()
      .withMessage('Invalid expense ID format')
  ];
};

// Validation rules for query filters
const filterValidationRules = () => {
  return [
    query('category')
      .optional()
      .isIn(VALID_CATEGORIES)
      .withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid ISO 8601 date'),
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('End date must be a valid ISO 8601 date')
      .custom((endDate, { req }) => {
        if (req.query.startDate && endDate < req.query.startDate) {
          throw new Error('End date must be after start date');
        }
        return true;
      })
  ];
};

// Validation rules for export
const exportValidationRules = () => {
  return [
    query('startDate')
      .notEmpty()
      .withMessage('Start date is required')
      .isISO8601()
      .withMessage('Start date must be a valid ISO 8601 date'),
    query('endDate')
      .notEmpty()
      .withMessage('End date is required')
      .isISO8601()
      .withMessage('End date must be a valid ISO 8601 date')
      .custom((endDate, { req }) => {
        if (req.query.startDate && endDate < req.query.startDate) {
          throw new Error('End date must be after start date');
        }
        return true;
      })
  ];
};

// Validation rules for monthly summary
const monthlySummaryValidationRules = () => {
  return [
    query('year')
      .optional()
      .isInt({ min: 2000, max: 2100 })
      .withMessage('Year must be between 2000 and 2100'),
    query('month')
      .optional()
      .isInt({ min: 1, max: 12 })
      .withMessage('Month must be between 1 and 12')
  ];
};

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg
      }))
    });
  }
  next();
};

module.exports = {
  expenseValidationRules,
  uuidValidationRules,
  filterValidationRules,
  exportValidationRules,
  monthlySummaryValidationRules,
  validate,
  VALID_CATEGORIES
};
