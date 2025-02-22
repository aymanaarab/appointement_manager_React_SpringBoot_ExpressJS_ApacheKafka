package com.example.appointement.Services;

import com.example.appointement.Entities.Availability;
import com.example.appointement.Repositories.AvailabilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AvailabilityService {

    @Autowired
    private AvailabilityRepository availabilityRepository;

    public Optional<Availability> getAvailabilityByAdminId(Long adminId) {
        return availabilityRepository.findByAdminId(adminId);
    }
}