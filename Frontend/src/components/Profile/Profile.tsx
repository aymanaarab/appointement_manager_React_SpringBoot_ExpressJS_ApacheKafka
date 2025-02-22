import { useState, useEffect } from "react";
import {
  TextInput,
  Button,
  Title,
  Stack,
  Loader,
  Card,
  Grid,
  Group,
  Avatar,
  Center,
  Paper,
  PasswordInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconCheck,
  IconEdit,
} from "@tabler/icons-react";
import axios from "axios";
import { useForm } from "@mantine/form";

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      fullName: "",
      email: "",
      role: "",
      current_password: "",
      new_password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      // new_password: (value) =>
      //   value.length < 6 ? "Password must be at least 6 characters" : null,
    },
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
        const response = await axios.get(
          "http://localhost:8005/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched User Data:", response.data);
        setUser(response.data.user);

        // Pre-fill the form with fetched user data
        form.setValues({
          fullName: response.data.user.fullName,
          email: response.data.user.email,
          role: response.data.user.role,
          current_password: "",
          new_password: "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        notifications.show({
          title: "Error",
          message: "Failed to fetch user data",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSave = async (values: typeof form.values) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:8005/api/auth/profile", 
        {
          fullName: values.fullName,
          email: values.email,
          currentPassword: values.current_password,
          newPassword: values.new_password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      notifications.show({
        title: "Success",
        message: response.data.message,
        color: "green",
      });
      // Update local user state
      setUser((prev) => ({
        ...prev,
        fullName: values.fullName,
        email: values.email,
      }));
    } catch (error) {
      console.error("Error updating profile:", error);
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || "Failed to update profile",
        color: "red",
      });
    }
  };

  if (loading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <form onSubmit={form.onSubmit(handleSave)}>
      <Paper withBorder shadow="md" p={30} radius="md">
        <Group grow>
          <TextInput
            label="Full Name"
            placeholder="Enter your full name"
            {...form.getInputProps("fullName")}
          />
        </Group>
        <TextInput
          label="Email"
          placeholder="Enter your email"
          mt="md"
          {...form.getInputProps("email")}
        />
        <TextInput
          label="Role"
          mt="md"
          disabled
          {...form.getInputProps("role")}
        />
        <Group grow>
          <PasswordInput
            label="Current password"
            placeholder="Enter your current password"
            mt="md"
            {...form.getInputProps("current_password")}
          />
          <PasswordInput
            label="New Password"
            placeholder="Enter your new password"
            mt="md"
            {...form.getInputProps("new_password")}
          />
        </Group>
        <Button fullWidth mt="xl" type="submit" loading={loading}>
          Update Profile
        </Button>
      </Paper>
    </form>
  );
};

export default Profile;
