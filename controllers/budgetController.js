const Budget = require("../models/budgetModel");

// Create or update a budget
const createOrUpdateBudget = async (req, res) => {
  try {
    const { categoryID, month, limit } = req.body;

    if (!categoryID || !month || !limit) {
      return res.status(400).json({ error: "All fields are required" });
    }

     // Convert month to YYYY-MM format if not already
    let monthKey = month;
    if (!month.includes("-")) {
      const date = new Date();
      monthKey = `${date.getFullYear()}-${month.toString().padStart(2, "0")}`;
    }
    
    // Check if budget for category + month exists
    const existing = await Budget.findOne({
      categoryID,
      month:monthKey,
      userID: req.user.id,
    });

    if (existing) {
      existing.limit = limit;
      await existing.save();
      return res.json({ message: "Budget updated", budget: existing });
    }

    // Create new budget
    const budget = await Budget.create({
      categoryID,
      month:monthKey,
      limit,
      userID: req.user.id,
    });

    res.status(201).json({ message: "Budget created", budget });
  } catch (error) {
    console.log(error);
    res.status(error.status || 500).json({message: error.message || "Internal Server Error"});
  }
};

// Get budgets for a selected month
const getBudgetsByMonth = async (req, res) => {
  try {
    const { month } = req.query;

    const budgets = await Budget.find({
      month,
      userID: req.user.id,
    }).populate("categoryID");

    res.json(budgets);
  } catch (error) {
    console.log(error);
    res.status(error.status || 500).json({message: error.message || "Internal Server Error"});
  }
};

// Delete budget
const deleteBudget = async (req, res) => {
  try {
    const deleted = await Budget.findOneAndDelete({
      _id: req.params.id,
      userID: req.user.id,
    });

    if (!deleted) return res.status(404).json({ error: "Budget not found" });

    res.json({ message: "Budget deleted" });
  } catch (error) {
    console.log(error);
    res.status(error.status || 500).json({message: error.message || "Internal Server Error"});
  }
};

module.exports = {
  createOrUpdateBudget,
  getBudgetsByMonth,
  deleteBudget
};
