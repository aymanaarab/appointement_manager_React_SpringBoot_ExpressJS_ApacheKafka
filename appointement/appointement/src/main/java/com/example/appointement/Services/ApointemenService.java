package com.example.appointement.Services;
import com.example.appointement.DTO.AppointmentCountDTO;
import com.example.appointement.Entities.Appointement;
import com.example.appointement.Repositories.ApointementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ApointemenService {

    private final ApointementRepository apointementRepository;

    @Autowired
    public ApointemenService(ApointementRepository apointementRepository) {
        this.apointementRepository = apointementRepository;
    }

    public Appointement createRendezVous(Appointement appointement) {
        return apointementRepository.save(appointement);
    }

    public List<Appointement> getAllRendezVous() {
        return apointementRepository.findAll();
    }

    public Appointement getRendezVousById(Long id) {
        return apointementRepository.findById(id).orElse(null);
    }

    public Appointement updateRendezVous(Long id, Appointement updatedAppointement) {
        return apointementRepository.findById(id)
                .map(existingAppointement -> {
                    existingAppointement.setDate(updatedAppointement.getDate());
                    existingAppointement.setUserId(updatedAppointement.getUserId());
                    existingAppointement.setAdminId(updatedAppointement.getUserId());
                    return apointementRepository.save(existingAppointement);
                })
                .orElseThrow(() -> new RuntimeException("RendezVous with ID " + id + " not found."));
    }
    public  Appointement updateStatus (Long id , Appointement updatedappointement) {
        return apointementRepository.findById(id).map(exApointement -> {
            exApointement.setStatus(updatedappointement.getStatus());
                    return apointementRepository.save(exApointement);
        })
                .orElseThrow(() -> new RuntimeException("RendezVous with ID " + id + " not found."));

    }
public List <Appointement> appointementsClient (String clientName) {
        return apointementRepository.getAppointementByClientName(clientName);
}
public List <Appointement> getApointementByAdmin (Long id) {
        return apointementRepository.getAppointementByAdminId(id) ;
}
    public boolean deleteRendezVous(Long id) {
        if (apointementRepository.existsById(id)) {
            apointementRepository.deleteById(id);
            return true;
        }
        return false;
    }
    public List<AppointmentCountDTO> getAppointmentsCountByDate() {
        List<Object[]> results = apointementRepository.countAppointmentsByDate();

        return results.stream()
                .map(result -> new AppointmentCountDTO((LocalDate) result[0], (Long) result[1]))
                .collect(Collectors.toList());
    }
}
