const mongoose = require("mongoose");

/**
 * Connect database to server
 */
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
  } catch (error) {
    console.error(` database.js | Database initialization error:`, error.message);
    throw new Error("Database initialization error");
  }
};

module.exports = dbConnection;
