package com.example.appointement.kafka;

import com.example.appointement.Entities.Appointement;
import com.example.appointement.Entities.Availability;
import com.example.appointement.Repositories.ApointementRepository;
import com.example.appointement.Repositories.AvailabilityRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Service
public class KafkaProducerService {
    private final ObjectMapper objectMapper;
    @Autowired
    private AvailabilityRepository availabilityRepository;

    @Autowired
    private ApointementRepository appointmentRepository; // Add this repository


    //    @Autowired
//    private ObjectMapper objectMapper; // To parse JSON messages
    private KafkaProducer<String, String> producer;
    private String topic = "user-login"; // Le nom de topic

    public KafkaProducerService(ObjectMapper objectMapper) {
        // l'initialisation d 'un producteur Kafka avec les configurations du topic convenable
        Properties properties = new Properties();
        properties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092"); // Same broker as your console producer
        properties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
        properties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");

        this.producer = new KafkaProducer<>(properties);
        this.objectMapper = objectMapper;
    }

    public void sendMessage(String message) {
        // L'envoi du message au broker
        ProducerRecord<String, String> record = new ProducerRecord<>(topic, message);
        producer.send(record);
    }
    @KafkaListener(topics = "availability-created", groupId = "appointment-group")
    public void consumeAvailability(String message) {
        try {
            JsonNode jsonNode = objectMapper.readTree(message);
            Long adminId = jsonNode.get("adminId").asLong();
            String dayOfWeekStr = jsonNode.get("dayOfWeek").asText().toUpperCase();
            DayOfWeek.valueOf(dayOfWeekStr); // Validate day

            String startTime = jsonNode.get("startTime").asText();
            String endTime = jsonNode.get("endTime").asText();

            // Retrieve existing availability or create a new one
            Availability availability = availabilityRepository.findByAdminId(adminId)
                    .orElse(new Availability());

            availability.setAdminId(adminId);

            // Append the new day if it's not already in the list
            String existingDays = availability.getAvailableDays();
            if (existingDays == null || existingDays.isEmpty()) {
                availability.setAvailableDays(dayOfWeekStr);
            } else {
                List<String> daysList = new ArrayList<>(Arrays.asList(existingDays.split(",")));
                if (!daysList.contains(dayOfWeekStr)) {
                    daysList.add(dayOfWeekStr);
                    availability.setAvailableDays(String.join(",", daysList));
                }
            }

            availability.setStartTime(startTime);
            availability.setEndTime(endTime);

            availabilityRepository.save(availability);
            System.out.println("✅ Availability stored for adminId: " + adminId + " on " + availability.getAvailableDays());

        } catch (IllegalArgumentException e) {
            System.err.println("❌ Invalid day of week received: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("❌ Error processing Kafka message: " + e.getMessage());
        }
    }

    @KafkaListener(topics = "appointment-created", groupId = "appointment-group")
    public void consumeAppointment(String message) {
        try {
            // Parse the Kafka message into a JsonNode
            JsonNode jsonNode = objectMapper.readTree(message);

            // Extract fields from the message
            String userId = jsonNode.has("userId") ? jsonNode.get("userId").asText() : null;
            String ClientName = jsonNode.has("userName") ? jsonNode.get("userName").asText() : null;
            String adminId = jsonNode.has("adminId") ? jsonNode.get("adminId").asText() : null;
            String date = jsonNode.has("date") ? jsonNode.get("date").asText() : null;
            String time = jsonNode.has("time") ? jsonNode.get("time").asText() : null;
            String details = jsonNode.has("details") ? jsonNode.get("details").asText() : null;

            // Check if the appointment already exists (optional, based on your logic)
//            Optional<Appointement> existingAppointment = appointmentRepository.findByUserIdAndDateAndTime(userId, date, time);
//            if (existingAppointment.isPresent()) {
//                System.out.println("❌ Appointment already exists for userId: " + userId + " on " + date + " at " + time);
//                return;
//            }

            // Create a new Appointment entity
            Appointement appointment = new Appointement();
            appointment.setUserId(Long.valueOf(userId));
            appointment.setClientName(ClientName);
            appointment.setAdminId(Long.valueOf(adminId));
            appointment.setName("Appointement of " + ClientName);
            appointment.setDate(LocalDate.parse(date));
            appointment.setTime(LocalTime.parse(time));
            appointment.setDetails(details);

            // Save the appointment to the database
            appointmentRepository.save(appointment);
            System.out.println("✅ Appointment stored for userId: " + userId + " on " + date + " at " + time);

        } catch (Exception e) {
            System.err.println("❌ Error processing Kafka message: " + e.getMessage());
        }
    }

    public void close() {
        producer.close();
    }
}
