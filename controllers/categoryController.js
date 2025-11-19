const Category = require('../models/categoryModel')

const createCategory = async (req,res)=>{
  try {
     const { name, color } = req.body;

    if (!name || !color) {
      return res.status(400).json({ error: "Name and color are required" });
    }

    const category = await Category.create({
      name,
      color,
      userID: req.user.id
    });

    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    console.log(error);
    res.status(error.status || 500).json({message: error.message || "Internal Server Error"})
  }
}


const getCategories = async (req,res)=>{
  try {
    const categories = await Category.find({ userID: req.user.id });
    res.json(categories);
  } catch (error) {
    console.log(error);
    res.status(error.status || 500).json({message: error.message || "Internal Server Error"});
  }
}


const updateCategory = async (req,res)=>{
  try {
    const updated = await Category.findOneAndUpdate(
      { _id: req.params.id, userID: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ error: "Category not found" });

    res.json({ message: "Category updated", updated });
  } catch (error) {
    console.log(error);
    res.status(error.status || 500).json({message: error.message || "Internal Server Error"});
  }
}


const deleteCtegiry = async (req,res)=>{
  try {
     const deleted = await Category.findOneAndDelete({
      _id: req.params.id,
      userID: req.user.id
    });

    if (!deleted)
      return res.status(404).json({ error: "Category not found" });

    res.json({ message: "Category deleted" });
  } catch (error) {
    console.log(error);
    res.status(error.status || 500).json({message: error.message || "Internal Server Error"});
  }
}

module.exports = {createCategory,getCategories,updateCategory,deleteCtegiry}