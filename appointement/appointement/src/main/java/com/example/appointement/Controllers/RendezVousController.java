package com.example.appointement.Controllers;
import com.example.appointement.DTO.AppointmentCountDTO;
import com.example.appointement.Entities.Appointement;

import com.example.appointement.Entities.Availability;
import com.example.appointement.Services.ApointemenService;
import com.example.appointement.Services.AvailabilityService;
import com.example.appointement.kafka.KafkaProducerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import requests.ClientNameRequest;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController

@RequestMapping("/api/rendezvous")
public class RendezVousController {

    private final ApointemenService apointementService;
    private final AvailabilityService availabilityService ;

    @Autowired
    public RendezVousController(ApointemenService apointementService, AvailabilityService availabilityService) {
        this.apointementService = apointementService;
        this.availabilityService = availabilityService;
    }

    @Autowired
    private KafkaProducerService kafkaProducerService;

    // Create
    @PostMapping
    public ResponseEntity<Appointement> createRendezVous(@RequestBody Appointement appointement) {
        Appointement createdAppointement = apointementService.createRendezVous(appointement);
        kafkaProducerService.sendMessage(String.valueOf(appointement.getUserId()));
        return ResponseEntity.status(201).body(createdAppointement);
    }

    // Get all
    @GetMapping
    public ResponseEntity<List<Appointement>> getAllRendezVous() {
        List<Appointement> appointementList = apointementService.getAllRendezVous();
        return ResponseEntity.ok(appointementList);
    }

    // Get Appointments spicifics to the retrieved Client :

    @PostMapping("/client")
    public ResponseEntity<List<Appointement>> getAppointmentSpecificClient(@RequestBody ClientNameRequest request) {
        List<Appointement> appointments = apointementService.appointementsClient(request.getName());
        return ResponseEntity.ok(appointments);
    }

    // Get one RendezVous using ID
    @GetMapping("/{id}")
    public ResponseEntity<Appointement> getRendezVousById(@PathVariable Long id) {
        Appointement appointement = apointementService.getRendezVousById(id);
        if (appointement != null) {
            return ResponseEntity.ok(appointement);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    //Get Admin Appointements

    @GetMapping("/admin/{id}")
    public  ResponseEntity<List<Appointement>> getAdminApointments (@PathVariable Long id ) {
        List<Appointement> appointements = apointementService.getApointementByAdmin(id);
        if (appointements != null) {
            return ResponseEntity.ok(appointements);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Appointement> updateRendezVous(@PathVariable Long id, @RequestBody Appointement updatedAppointement) {
        Appointement updated = apointementService.updateRendezVous(id, updatedAppointement);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRendezVous(@PathVariable Long id) {
        boolean deleted = apointementService.deleteRendezVous(id);
        if (deleted) {
            return ResponseEntity.ok("Apointement deleted with success");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // update status for client
    @PutMapping("/status/{id}")
    public ResponseEntity<Appointement> updateStatus(@PathVariable Long id, @RequestBody Appointement updatedAppointement) {
        Appointement updated = apointementService.updateStatus(id, updatedAppointement);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/availability/{adminId}")
    public ResponseEntity<Optional<Availability>> getAvailabilityByAdminId(@PathVariable Long adminId) {
        Optional<Availability> availabilityList = availabilityService.getAvailabilityByAdminId(adminId);
        if (!availabilityList.isEmpty()) {
            return ResponseEntity.ok(availabilityList);
        } else {
            return ResponseEntity.notFound().build();
        }

    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/count-by-date")
    public ResponseEntity<List<AppointmentCountDTO>> getAppointmentsCountByDate() {
        return ResponseEntity.ok(apointementService.getAppointmentsCountByDate());
    }
}