import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js"; // Sequelize instance

// Define the User model with email, password, fullName, and phone fields
const User = sequelize.define(
  "User",
  {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false, // Full name is required
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensures email addresses are unique
      validate: {
        isEmail: true, // Ensures valid email format
      },
    },
    phone: {
      type: DataTypes.STRING, // Allowing string to include "+", "-", etc.
      allowNull: true, // Phone number is optional
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("client", "admin"), // ENUM with possible values
      defaultValue: "client", // Default role is 'client'
      allowNull: false, // Role is required
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Sync the model with the database (creates the table if it doesn't exist)
await User.sync(); // Use { force: true } to reset table (for dev only)

// Export the User model
export default User;
