package com.example.appointement.Repositories;

import com.example.appointement.Entities.Appointement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApointementRepository extends JpaRepository<Appointement, Long> {

//        List<Appointement> getAppointementByClientName(String clientName);

    List<Appointement> getAppointementByClientName(String ClientName);
    List<Appointement> getAppointementByAdminId( Long adminId);
    @Query("SELECT a.date, COUNT(a) FROM Appointement a GROUP BY a.date")
    List<Object[]> countAppointmentsByDate();
}



