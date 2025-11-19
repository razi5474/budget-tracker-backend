const mongoose = require('mongoose');

const connectDB = async () => {
  const dbUrl = process.env.MongoDB_URL;
  try {
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });
    await mongoose.connect(dbUrl,{
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.log(error);
  }
}
module.exports = connectDB;