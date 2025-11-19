const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    categoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    month: {
      type: String,
      required: true
    }, // Example: "2025-01"

    limit: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Budget", budgetSchema);
