import { Sequelize } from "sequelize";

// Set up MySQL connection directly using environment variables
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql", // MySQL dialect
  logging: false, // Disable logging (optional)
  // define: {
  //   freezeTableName: true,  // Prevents Sequelize from pluralizing the table names
  // },
});

// Test the connection to the MySQL database
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to the MySQL database");
  } catch (error) {
    console.error("Unable to connect to the MySQL database:", error);
    process.exit(1); // Exit process if connection fails
  }
};

export { sequelize, connectDB };
