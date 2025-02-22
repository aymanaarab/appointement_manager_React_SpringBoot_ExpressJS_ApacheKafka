//package com.example.appointement.Controllers;
//
//import com.example.appointement.Entities.Notification;
//import com.example.appointement.Services.NotificationService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/notifications")
//public class NotificationController {
//
//    private final NotificationService notificationService;
//
//    @Autowired
//    public NotificationController(NotificationService notificationService) {
//        this.notificationService = notificationService;
//    }
//
//    @PostMapping
//    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
//        Notification createdNotification = notificationService.createNotification(notification);
//        return new ResponseEntity<>(createdNotification, HttpStatus.CREATED);
//    }
//}
//
