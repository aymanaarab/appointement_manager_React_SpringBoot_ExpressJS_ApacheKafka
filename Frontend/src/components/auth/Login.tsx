import {
  Alert,
  Anchor,
  Button,
  Group,
  Paper,
  PasswordInput,
  TextInput,
  Container,
  Title,
  Text,
  SegmentedControl,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";

interface Credentials {
  email: string;
  password: string;
}

const adminCredentials: Credentials = {
  email: "aymenfreelancer@gmail.com",
  password: "aymanhb2001",
};

const clientCredentials: Credentials = {
  email: "aymangame077@gmail.com",
  password: "aymanhb2001",
};

export const Login = () => {
  const [role, setRole] = useState<"admin" | "client">("admin"); // Toggle between Admin & Client
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Use the login method from AuthContext

  const form = useForm<Credentials>({
    initialValues: adminCredentials,
  });

  // Switch Credentials when role changes
  const handleRoleChange = (newRole: "admin" | "client") => {
    setRole(newRole);
    form.setValues(newRole === "admin" ? adminCredentials : clientCredentials);
  };

  const handleSubmit = async () => {
    const { email, password } = form.values;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8005/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || "Invalid Credentials");
      }

      const { token, user } = data;
      login(token, user); // Securely store token and role

      notifications.show({
        title: "Login Successful",
        message: `Welcome ${user.fullName}!`,
        color: "green",
        autoClose: 3000,
        position: "bottom-right",
      });

      // Redirect based on actual backend-validated role
      navigate(user.role === "admin" ? "/admin" : "/client");
    } catch (error: any) {
      setError(error.message);
      notifications.show({
        title: "Error",
        message: error.message || "An error occurred during login.",
        color: "red",
        autoClose: 2000,
        position: "bottom-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={700} my={40}>
      <Title ta="center" mb="lg">
        Welcome to Appointment Manager
      </Title>

      {/* Role Switcher */}
      <SegmentedControl
        fullWidth
        data={[
          { label: "Admin", value: "admin" },
          { label: "Client", value: "client" },
        ]}
        value={role}
        onChange={(value) => handleRoleChange(value as "admin" | "client")}
        mb="lg"
      />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Paper withBorder shadow="md" p={30} radius="md">
          <TextInput
            label="Email"
            placeholder="Enter your email"
            required
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            required
            mt="md"
            {...form.getInputProps("password")}
          />
          <Group mt="md">
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" type="submit" loading={loading}>
            Sign in as {role === "admin" ? "Admin" : "Client"}
          </Button>
        </Paper>
      </form>

      <Text c="dimmed" size="sm" ta="center" mt={20}>
        Do not have an account yet?{" "}
        <Anchor size="sm" component={Link} to="/register">
          Create account
        </Anchor>
      </Text>
    </Container>
  );
};
