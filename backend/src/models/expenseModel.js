const pool = require('../config/database');

class ExpenseModel {
  // Create a new expense
  static async create(expenseData) {
    const { amount, category, description, date } = expenseData;
    const query = `
      INSERT INTO expenses (amount, category, description, date)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [amount, category, description, date];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Get all expenses with optional filters
  static async findAll(filters = {}) {
    let query = 'SELECT * FROM expenses WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.category) {
      query += ` AND category = $${paramCount}`;
      values.push(filters.category);
      paramCount++;
    }

    if (filters.startDate) {
      query += ` AND date >= $${paramCount}`;
      values.push(filters.startDate);
      paramCount++;
    }

    if (filters.endDate) {
      query += ` AND date <= $${paramCount}`;
      values.push(filters.endDate);
      paramCount++;
    }

    query += ' ORDER BY date DESC, created_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  // Get expense by ID
  static async findById(id) {
    const query = 'SELECT * FROM expenses WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Update expense
  static async update(id, expenseData) {
    const { amount, category, description, date } = expenseData;
    const query = `
      UPDATE expenses
      SET amount = $1, category = $2, description = $3, date = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `;
    const values = [amount, category, description, date, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Delete expense
  static async delete(id) {
    const query = 'DELETE FROM expenses WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Get monthly summary
  static async getMonthlySummary(year, month) {
    const query = `
      SELECT
        COUNT(*) as total_count,
        SUM(amount) as total_amount,
        category,
        SUM(amount) as category_total
      FROM expenses
      WHERE EXTRACT(YEAR FROM date) = $1 AND EXTRACT(MONTH FROM date) = $2
      GROUP BY category
      ORDER BY category_total DESC
    `;
    const result = await pool.query(query, [year, month]);

    // Calculate overall totals
    const totalAmount = result.rows.reduce((sum, row) => sum + parseFloat(row.category_total), 0);
    const totalCount = result.rows.reduce((sum, row) => sum + parseInt(row.total_count), 0);

    return {
      year,
      month,
      totalAmount,
      totalCount,
      categoryBreakdown: result.rows.map(row => ({
        category: row.category,
        total: parseFloat(row.category_total),
        count: parseInt(row.total_count)
      }))
    };
  }

  // Get previous month summary for comparison
  static async getPreviousMonthSummary(year, month) {
    // Calculate previous month
    let prevMonth = month - 1;
    let prevYear = year;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear = year - 1;
    }

    const query = `
      SELECT
        SUM(amount) as total_amount
      FROM expenses
      WHERE EXTRACT(YEAR FROM date) = $1 AND EXTRACT(MONTH FROM date) = $2
    `;
    const result = await pool.query(query, [prevYear, prevMonth]);

    return {
      year: prevYear,
      month: prevMonth,
      totalAmount: parseFloat(result.rows[0]?.total_amount || 0)
    };
  }

  // Get expenses for CSV export
  static async getExpensesForExport(startDate, endDate) {
    const query = `
      SELECT id, amount, category, description, date, created_at
      FROM expenses
      WHERE date >= $1 AND date <= $2
      ORDER BY date DESC
    `;
    const result = await pool.query(query, [startDate, endDate]);
    return result.rows;
  }
}

module.exports = ExpenseModel;
