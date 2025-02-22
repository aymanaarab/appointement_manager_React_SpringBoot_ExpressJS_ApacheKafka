import {
  Anchor,
  Button,
  Group,
  Paper,
  PasswordInput,
  TextInput,
  Container,
  Title,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";

// Define the shape of the registration form values
interface RegisterCredentials {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Initialize the form with default values and validation rules
  const form = useForm<RegisterCredentials>({
    initialValues: {
      firstname: "John",
      lastname: "Doe",
      email: "johndoe@example.com",
      password: "Password123!",
      confirmPassword: "Password123!",
    },
    validate: {
      firstname: (value) =>
        value.trim().length > 0 ? null : "First name is required",
      lastname: (value) =>
        value.trim().length > 0 ? null : "Last name is required",
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 8 ? null : "Password must be at least 8 characters",
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passwords do not match",
    },
  });

  // Handle form submission
  const handleSubmit = async (values: RegisterCredentials) => {
    setLoading(true);

    try {
      // Simulate an API call for registration
      // await register(values.fullName, values.email, values.password);
      notifications.show({
        title: "Registration Successful",
        message: "Your account has been created successfully!",
        color: "green",
        autoClose: 3000,
        position: "top-right",
      });
      navigate("/login"); // Redirect to login page after successful registration
    } catch (error: any) {
      notifications.show({
        title: "Registration Failed",
        message: error.message || "An error occurred during registration.",
        color: "red",
        autoClose: 5000,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={700} my={40}>
      <Title ta="center" mb="lg">
        Create an Account
      </Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Paper withBorder shadow="md" p={30} radius="md">
          <Group grow>
            <TextInput
              label="First Name"
              placeholder="Enter your first name"
              {...form.getInputProps("firstname")}
            />
            <TextInput
              label="Last Name"
              placeholder="Enter your last name"
              {...form.getInputProps("lastname")}
            />
          </Group>
          <TextInput
            label="Email"
            placeholder="Enter your email"
            mt="md"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            mt="md"
            {...form.getInputProps("password")}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            mt="md"
            {...form.getInputProps("confirmPassword")}
          />
          <Button fullWidth mt="xl" type="submit" loading={loading}>
            Register
          </Button>
        </Paper>
      </form>

      <Text c="dimmed" size="sm" ta="center" mt={20}>
        Already have an account?{" "}
        <Anchor size="sm" component="button" onClick={() => navigate("/login")}>
          Login
        </Anchor>
      </Text>
    </Container>
  );
};
