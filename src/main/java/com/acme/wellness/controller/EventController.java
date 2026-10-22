package com.acme.wellness.controller;

import com.acme.wellness.model.EventAuditLog;
import com.acme.wellness.model.WellnessEvent;
import com.acme.wellness.service.WellnessEventService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Controller managing wellness event directory, event creation,
 * status lifecycle updates, and audit trails.
 *
 * Corresponds to:
 * - Screen 3: Wellness Events Directory
 * - Screen 4: Create Wellness Event
 * - Screen 5: Wellness Event Details
 */
@RestController
@RequestMapping("/api/events")
public class EventController {

    private final WellnessEventService eventService;

    public EventController(WellnessEventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<List<WellnessEvent>> getEvents(
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(required = false, defaultValue = "all") String department,
            @RequestParam(required = false, defaultValue = "all") String status) {
        return ResponseEntity.ok(eventService.searchEvents(query, department, status));
    }

    @GetMapping("/{eventCode}")
    public ResponseEntity<?> getEvent(@PathVariable String eventCode) {
        Optional<WellnessEvent> event = eventService.getEventByCode(eventCode);
        if (event.isPresent()) {
            return ResponseEntity.ok(event.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "error", "Event not found",
                "eventCode", eventCode
        ));
    }

    @PostMapping
    public ResponseEntity<?> createEvent(@Valid @RequestBody WellnessEvent event) {
        WellnessEvent created = eventService.createEvent(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{eventCode}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String eventCode, @RequestBody Map<String, String> payload) {
        String newStatus = payload.get("status");
        String reason = payload.get("reason");
        String performedBy = payload.get("performedBy");

        if (newStatus == null || newStatus.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Status field is required"));
        }

        Optional<WellnessEvent> updated = eventService.updateStatus(eventCode, newStatus, reason, performedBy);
        if (updated.isPresent()) {
            return ResponseEntity.ok(updated.get());
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "error", "Event not found",
                "eventCode", eventCode
        ));
    }

    @GetMapping("/{eventCode}/audit")
    public ResponseEntity<List<EventAuditLog>> getAuditTrail(@PathVariable String eventCode) {
        return ResponseEntity.ok(eventService.getAuditLogsForEvent(eventCode));
    }
}
