import React, { useEffect, useState } from "react";
import axios from "axios";
import { TableSort } from "../utils/TableSort";
import { Box, Loader, LoadingOverlay } from "@mantine/core";

// Define the User type
interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string; // Assuming role is part of the user data
}

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get<{ users: User[] }>(
        "http://localhost:8005/api/auth/users",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Fetched Users:", response.data); // Log the response data for debugging
      setUsers(response.data.users); // Access the `users` property
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Map the fetched users to the RowData structure expected by TableSort
  const mappedUsers = users.map((user) => ({
    name: user.fullName,
    email: user.email,
    phone: user.phone, // Use role as the company field (or replace with actual company data if available)
  }));

  return (
    <div>
      {/* <h1>Manage Users</h1>
      <p>This is where you can manage users.</p> */}

      {/* {loading ? (
        <Loader />
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : ( */}
      {/* )} */}

      <Box pos="relative" h="400">
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: "md" }}
        />
        <TableSort data={mappedUsers} />
      </Box>
    </div>
  );
};

export default ManageUsers;
