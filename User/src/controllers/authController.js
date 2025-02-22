import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { jwtSecret } from "../config/initialConfig.js";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import { producer } from "../kafka/userValidation.js";

// Middleware to verify token
export function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // Attach decoded user data (userId, role) to request
    console.log("✅ Token verified. User:", req.user);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
}

export async function getAllUsers(req, res) {
  try {
    // Fetch all users from the database, excluding the admin
    const users = await User.findAll({
      attributes: ["id", "fullName", "email", "role", "phone"], // Exclude sensitive fields like password
      where: {
        role: "client", // Only fetch users with the role "client"
      },
    });

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server Error" });
  }
}
export function isAdmin(req, res, next) {
  console.log("Checking if user is admin:", req.user); // Debugging log

  if (!req.user || !req.user.role) {
    return res.status(401).json({ message: "Unauthorized: No role found" });
  }

  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Access Denied: Admin role required" });
  }

  console.log("✅ User is admin. Access granted.");
  next(); // Proceed to the next middleware or function
}

// GET /api/profile - Fetch user profile data
export async function getUserProfile(req, res) {
  const userId = req.user.userId;

  try {
    const user = await User.findByPk(userId, {
      attributes: ["fullName", "email", "phone", "role"], // Exclude sensitive fields like password
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

// Update user profile
export async function updateUserProfile(req, res) {
  const { fullName, email, currentPassword, newPassword } = req.body;
  const userId = req.user.userId; // Use userId from the token

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update profile fields
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;

    // Update password only if currentPassword and newPassword are provided
    if (currentPassword && newPassword) {
      const isMatch = await comparePassword(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid current password" });
      }
      user.password = await hashPassword(newPassword);
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: { fullName: user.fullName, email: user.email },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function changePassword(req, res) {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.userId; // Extracted from the token

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid old password" });
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server Error" });
  }
}
// Handles new user registration
export async function registerUser(req, res) {
  const { fullName, phone, email, password, role } = req.body;

  try {
    // Check for missing required fields
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required (fullName, email, password, role)",
      });
    }

    // Validate role
    if (!["admin", "client"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Invalid role. Role must be 'doctor' or 'patient'." });
    }

    // Check if a user with the given email already exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password before saving it
    const hashedPassword = await hashPassword(password);

    // Create a new user instance and save it to the database
    user = await User.create({
      fullName,
      phone,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User created successfully",
      user: { fullName, email, role },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

// Handles user login
export async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    let user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const payload = { userId: user.id, role: user.role };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "5h" });

    const userResponse = {
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };
    await producer.send({
      topic: "user-login", // Kafka topic for login events
      messages: [
        {
          value: JSON.stringify({
            userId: user.id,
            email: user.email,
            phone: user.phone,
            role: user.role,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });
    console.log("📤 Login event sent to Kafka");

    res.json({ token, user: userResponse });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

// Handles user logout
export const logout_User = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, jwtSecret);
    res.json({ message: "Successfully logged out" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expired" });
    } else {
      console.error("Error during logout:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

// Verify Token API Endpoint
export async function verifyTokenEndpoint(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findByPk(decoded.userId, {
      attributes: ["fullName", "email", "role"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ valid: true, user });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

export const addAvailability = async (req, res) => {
  try {
    const adminId = req.user.userId;
    const { availableDays, startTime, endTime } = req.body;

    if (!availableDays || !startTime || !endTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Ensure availableDays is an array
    if (!Array.isArray(availableDays)) {
      return res.status(400).json({ error: "availableDays must be an array" });
    }

    const validDaysOfWeek = [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ];
    const invalidDays = availableDays.filter(
      (day) => !validDaysOfWeek.includes(day)
    );

    if (invalidDays.length > 0) {
      return res
        .status(400)
        .json({ error: `Invalid days: ${invalidDays.join(", ")}` });
    }

    // Send Kafka messages for each valid day
    await producer.connect();
    for (const dayOfWeek of availableDays) {
      // ✅ No need to split
      await producer.send({
        topic: "availability-created",
        messages: [
          {
            value: JSON.stringify({
              adminId,
              dayOfWeek,
              startTime,
              endTime,
            }),
          },
        ],
      });

      console.log(
        `📤 Sent availability for adminId: ${adminId} on ${dayOfWeek}`
      );
    }
    await producer.disconnect();

    res.status(200).json({ message: "✅ Availability sent to Kafka!" });
  } catch (error) {
    console.error("❌ Error sending availability:", error);
    res.status(500).json({ error: "Failed to send availability" });
  }
};

// Get all admins from the database
export async function getAllAdmins(req, res) {
  try {
    // Fetch all users with the role "admin"
    const admins = await User.findAll({
      attributes: ["id", "fullName", "email", "role", "phone"], // Exclude sensitive fields like password
      where: {
        role: "admin", // Only fetch users with the role "admin"
      },
    });

    res.status(200).json({ admins });
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function createAppointment(req, res) {
  try {
    // Get userId from the authenticated user
    const userId = req.user.userId;

    // Fetch the user to confirm they exist and get their name
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract user's name
    const userName = user.fullName || user.name; // Adjust based on your User model

    // Get the appointment data from the request body
    const { name, date, time, details, adminId } = req.body;

    // Now send the appointment event to Kafka
    await producer.connect();

    await producer.send({
      topic: "appointment-created", // Kafka topic for appointment creation
      messages: [
        {
          value: JSON.stringify({
            userId,
            userName, // Send user's name along with ID
            adminId,
            appointmentName: name,
            date,
            time,
            details,
          }),
        },
      ],
    });

    console.log(
      `📤 Sent appointment creation event to Kafka with userName: ${userName}`
    );

    await producer.disconnect();

    // Respond to the client with success message
    res.status(201).json({
      message: "Appointment created and event sent to Kafka successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating appointment" });
  }
}
