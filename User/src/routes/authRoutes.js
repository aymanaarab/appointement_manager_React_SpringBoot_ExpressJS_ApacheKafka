// Import required modules and configuration
import express from "express";
import {
  addAvailability,
  createAppointment,
  getAllAdmins,
  getAllUsers,
  getUserProfile,
  isAdmin,
  loginUser,
  logout_User,
  registerUser,
  updateUserProfile,
  verifyToken,
  verifyTokenEndpoint,
} from "../controllers/authController.js";
import {
  validateUserLogin,
  validateUserRegister,
} from "../middlewares/validators/authValidator.js";

// Create a new router instance
const router = express.Router();

// Register route with input validation followed by the registration controller
router.post("/register", validateUserRegister, registerUser);

// Login route with input validation followed by the login controller
router.post("/login", validateUserLogin, loginUser);

// Logout route
router.post("/logout", logout_User);

// verify token route
router.post("/verify", verifyTokenEndpoint);
router.get("/users", verifyToken, isAdmin, getAllUsers);
router.put("/profile", verifyToken, updateUserProfile);
router.get("/profile", verifyToken, getUserProfile);

router.post("/send-availability", verifyToken, isAdmin, addAvailability);
router.post("/appointment", verifyToken, createAppointment);
router.get("/get-all-admins", getAllAdmins);

// Export the router for use in the main application file
export default router;
