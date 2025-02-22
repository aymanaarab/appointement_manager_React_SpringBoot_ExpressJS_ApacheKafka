package com.example.appointement.Repositories;

import com.example.appointement.Entities.Availability;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
    Optional<Availability> findByAdminId(Long adminId);  // Use adminId (lowercase)
}