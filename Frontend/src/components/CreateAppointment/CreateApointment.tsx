import { useState, useEffect } from "react";
import {
  TextInput,
  Button,
  Select,
  Paper,
  Group,
  Title,
  Notification,
  Textarea,
} from "@mantine/core";
import { DateInput, TimeInput } from "@mantine/dates";
import axios from "axios";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

const CreateAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState([]); // State to store the list of admins
  const [selectedAdmin, setSelectedAdmin] = useState(""); // State to store selected admin

  const form = useForm({
    initialValues: {
      name: "",
      date: null,
      time: "",
      details: "",
    },
    validate: {
      name: (value) => (value ? null : "Appointment Name is required"),
      date: (value) => (value ? null : "Date is required"),
      time: (value) => (value ? null : "Time is required"),
      details: (value) => (value ? null : "Details are required"),
    },
  });

  // Fetch admins on component mount
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8005/api/auth/get-all-admins",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAdmins(response.data.admins); // Set the fetched admins to state
      } catch (error) {
        console.error("Error fetching admins:", error);
        notifications.show({
          title: "Error",
          message: "❌ Failed to fetch admins.",
          color: "red",
        });
      }
    };

    fetchAdmins();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);

    try {
      const formattedData = {
        appointmentName: form.values.name,
        date: form.values.date?.toISOString().split("T")[0], // Format date
        time: form.values.time,
        details: form.values.details,
        adminId: selectedAdmin, // Add selected admin to the request
      };

      const token = localStorage.getItem("token");

      console.log("📤 Sending data to backend:", formattedData);
      const response = await axios.post(
        "http://localhost:8005/api/auth/appointment",
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        notifications.show({
          title: "Success",
          message: "✅ Appointment created successfully!",
          color: "green",
        });
        form.reset();
      } else {
        notifications.show({
          title: "Error",
          message: "❌ Error creating appointment.",
          color: "red",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "❌ Failed to create appointment.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper withBorder shadow="md" p={30} radius="md">
      <Title align="center" order={2}>
        Create Appointment
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Appointment Name"
          placeholder="Enter appointment name"
          mt="md"
          {...form.getInputProps("name")}
        />

        <DateInput
          clearable
          defaultValue={new Date(new Date().setDate(new Date().getDate() + 1))}
          label="Date input"
          placeholder="Select appointment date"
          mt="md"
          {...form.getInputProps("date")}
        />

        <TimeInput
          label="Time"
          placeholder="Select time"
          mt="md"
          {...form.getInputProps("time")}
        />

        <Textarea
          label="Details"
          placeholder="Enter appointment details"
          mt="md"
          {...form.getInputProps("details")}
        />

        {/* Select for Admin */}
        <Select
          label=" Doctors"
          placeholder="Select an admin"
          value={selectedAdmin ? String(selectedAdmin) : ""}
          onChange={(value) => setSelectedAdmin(value ? String(value) : "")} // Ensure value is a string
          data={admins.map((admin) => ({
            value: String(admin.id), // Convert the admin id to a string
            label: `${admin.fullName}`,
          }))}
          required
          mt="md"
        />

        <Button fullWidth mt="xl" type="submit" loading={loading}>
          Create Appointment
        </Button>
      </form>
    </Paper>
  );
};

export default CreateAppointment;
