const Expense = require('../models/expenseModel');
const Budget = require("../models/budgetModel");
const Category = require("../models/categoryModel");

const addExpense = async (req,res)=>{
  try {
    const {categoryID,amount,date} = req.body;

    if(!categoryID || !amount || !date){
      return res.status(400).json({error: "All fields are required"})
    }

     const expenseDate = new Date(date);
    const monthKey = `${expenseDate.getFullYear()}-${(expenseDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;

    // 1. Save the expense
    const expense = await Expense.create({
      categoryID,
      amount,
      date,
      userID: req.user.id,
    });

    // 2. Find budget for this category + month
    const budget = await Budget.findOne({
      categoryID,
      month: monthKey,
      userID: req.user.id,
    });

    if (!budget) {
      return res.json({
        message: "Expense added, but no budget set",
        status: "no-budget",
        expense,
      });
    }

    // 3. Calculate total spent this month for this category
    const monthStart = new Date(expenseDate.getFullYear(), expenseDate.getMonth(), 1);
    const monthEnd = new Date(expenseDate.getFullYear(), expenseDate.getMonth() + 1, 0);

    const totalSpent = await Expense.aggregate([
      {
        $match: {
          userID: expense.userID,
          categoryID: expense.categoryID,
          date: { $gte: monthStart, $lte: monthEnd },
        },
      },
      {
        $group: { _id: null, total: { $sum: "$amount" } },
      },
    ]);

    const spent = totalSpent[0]?.total || 0;

    // 4. Check budget status
    const status = spent > budget.limit ? "over-budget" : "within-budget";

    res.json({
      message: "Expense recorded",
      expense,
      spent,
      limit: budget.limit,
      status,
    });

  } catch (error) {
    console.log(error);
    res.status(error.status || 500).json({message: error.message || "Internal Server Error"})
  }
}

const getExpensesByMonth = async (req,res)=>{
  try {
    const {month} = req.query;

    const [year,monthNumber] = month.split("-");

    const start = new Date(year, parseInt(monthNumber) - 1, 1);
    const end = new Date(year, parseInt(monthNumber), 0);

    const expenses = await Expense.find({
      userID: req.user.id,
      date: { $gte: start, $lte: end },
    }).populate("categoryID");

    res.json(expenses);

  } catch (error) {
    console.log(error);
    res.status(error.status || 500).json({message: error.message || "Internal Server Error"})
  }
}

const deleteExpense = async (req, res) => {
  try {
    const deleted = await Expense.findOneAndDelete({
      _id: req.params.id,
      userID: req.user.id
    });

    if (!deleted) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(error.status || 500).json({message: error.message || "Internal Server Error"})
  }
};

const updateExpense = async (req, res) => {
  try {
    const { amount, date, categoryID } = req.body;

    const updated = await Expense.findOneAndUpdate(
      { _id: req.params.id, userID: req.user.id },
      { amount, date, categoryID },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json({ message: "Expense updated", updated });
  } catch (error) {
    console.log(error);
    res.status(error.status || 500).json({message: error.message || "Internal Server Error"})
  }
};



module.exports = {addExpense,getExpensesByMonth,deleteExpense,updateExpense};