package com.example.appointement.DTO;

import java.time.LocalDate;

public class AppointmentCountDTO {
    private LocalDate date;
    private Long count;

    public AppointmentCountDTO(LocalDate date, Long count) {
        this.date = date;
        this.count = count;
    }

    public LocalDate getDate() {
        return date;
    }

    public Long getCount() {
        return count;
    }
}
