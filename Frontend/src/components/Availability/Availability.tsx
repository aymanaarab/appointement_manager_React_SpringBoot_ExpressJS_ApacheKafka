import React from "react";
import {
  MultiSelect,
  Button,
  Container,
  Title,
  Card,
  Grid,
  Stack,
  Divider,
} from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import axios from "axios";

const daysOfWeek = [
  { label: "Monday", value: "MONDAY" },
  { label: "Tuesday", value: "TUESDAY" },
  { label: "Wednesday", value: "WEDNESDAY" },
  { label: "Thursday", value: "THURSDAY" },
  { label: "Friday", value: "FRIDAY" },
  { label: "Saturday", value: "SATURDAY" },
  { label: "Sunday", value: "SUNDAY" },
];

const Availability = () => {
  const form = useForm({
    initialValues: {
      availableDays: [],
      startTime: new Date(),
      endTime: new Date(),
    },
  });

  // Handle the form submit
  const handleSubmit = async (values: any) => {
    const formattedAvailability = {
      availableDays: values.availableDays.map((day: string) =>
        day.toUpperCase()
      ), // Ensure uppercase
      startTime: values.startTime, // Ensure 24-hour format
      endTime: values.endTime,
    };

    console.log("📤 Sending data to backend:", formattedAvailability);

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:8005/api/auth/send-availability",
        formattedAvailability, // ✅ No extra nesting
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("✅ Success:", response.data.message);
      } else {
        console.error("❌ Error:", response.data.error);
      }
    } catch (error) {
      console.error("❌ Failed to submit availability:", error);
    }
  };

  return (
    <Container size="md" my="xl">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={2} mb="lg">
          Set Your Availability
        </Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {/* MultiSelect for Days Selection */}
            <div>
              <Title order={4} mb="xs">
                Select Available Days
              </Title>
              <MultiSelect
                data={daysOfWeek}
                value={form.values.availableDays}
                onChange={(value) => form.setFieldValue("availableDays", value)}
                placeholder="Select days"
                clearable
              />
            </div>

            <Divider />

            {/* Time Selection */}
            <div>
              <Title order={4} mb="xs">
                Set Working Hours
              </Title>
              <Grid>
                <Grid.Col span={6}>
                  <TimeInput
                    label="Start Time"
                    {...form.getInputProps("startTime")}
                    required
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TimeInput
                    label="End Time"
                    {...form.getInputProps("endTime")}
                    required
                  />
                </Grid.Col>
              </Grid>
            </div>

            {/* Submit Button */}
            <Button type="submit" fullWidth mt="md">
              Save Availability
            </Button>
          </Stack>
        </form>
      </Card>
    </Container>
  );
};

export default Availability;
