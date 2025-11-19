const mongoose = require('mongoose');

const connectDB = async () => {
  const dbUrl = process.env.MongoDB_URL;
  try {
    await mongoose.connect(dbUrl)
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.log(error);
  }
}
module.exports = connectDB;