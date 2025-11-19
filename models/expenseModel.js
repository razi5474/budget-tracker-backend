const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    categoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
