const Expense = require("../models/expenseModel");
const Budget = require("../models/budgetModel");
const Category = require("../models/categoryModel");

const getMonthllyReport = async (req,res)=>{
  try {
     const { month } = req.query;
    if (!month) {
      return res.status(400).json({ error: "Month query is required (YYYY-MM)" });
    }

    const [year, monthNumber] = month.split("-");
    const start = new Date(year, monthNumber - 1, 1);
    const end = new Date(year, monthNumber, 0);

    // STEP 1: Get all categories of the user
    const categories = await Category.find({ userID: req.user.id });

    let report = [];

    for (const category of categories) {
      // STEP 2: Get budget for this category & month
      const budget = await Budget.findOne({
        categoryID: category._id,
        month,
        userID: req.user.id
      });

      // STEP 3: Calculate total spent in that month
      const expenses = await Expense.aggregate([
        {
          $match: {
            userID: category.userID,
            categoryID: category._id,
            date: { $gte: start, $lte: end }
          }
        },
        {
          $group: { _id: null, total: { $sum: "$amount" } }
        }
      ]);

      const spent = expenses[0]?.total || 0;
      const limit = budget?.limit || 0;

      report.push({
        category: category.name,
        color: category.color,
        limit,
        spent,
        remaining: limit - spent,
        overBudget: spent > limit
      });
    }

    res.json(report);

  } catch (error) {
    console.log(error);
    res.status(error.status || 500).json({message: error.message || "Internal Server Error"})
  }
}

module.exports = {getMonthllyReport}