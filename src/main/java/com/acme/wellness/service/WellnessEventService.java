package com.acme.wellness.service;

import com.acme.wellness.model.EventAuditLog;
import com.acme.wellness.model.WellnessEvent;
import com.acme.wellness.repository.EventAuditLogRepository;
import com.acme.wellness.repository.WellnessEventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class WellnessEventService {

    private final WellnessEventRepository eventRepository;
    private final EventAuditLogRepository auditLogRepository;

    public WellnessEventService(WellnessEventRepository eventRepository, EventAuditLogRepository auditLogRepository) {
        this.eventRepository = eventRepository;
        this.auditLogRepository = auditLogRepository;
    }

    public List<WellnessEvent> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<WellnessEvent> searchEvents(String query, String department, String status) {
        return eventRepository.searchEvents(query, department, status);
    }

    public Optional<WellnessEvent> getEventByCode(String eventCode) {
        return eventRepository.findByEventCode(eventCode);
    }

    public Optional<WellnessEvent> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    @Transactional
    public WellnessEvent createEvent(WellnessEvent event) {
        if (event.getEventCode() == null || event.getEventCode().isBlank()) {
            long count = eventRepository.count() + 800;
            event.setEventCode("EVT-2025-" + String.format("%04d", count));
        }
        if (event.getStatus() == null || event.getStatus().isBlank()) {
            event.setStatus("SCHEDULED");
        }
        if (event.getEnrolled() == null) {
            event.setEnrolled(0);
        }

        WellnessEvent saved = eventRepository.save(event);

        // Record creation audit entry
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        auditLogRepository.save(new EventAuditLog(
                saved.getEventCode(),
                "EVENT_CREATED",
                "DevOps Admin / HR Specialist",
                "Event created via Corporate Wellness Dashboard portal.",
                "Build #142",
                now
        ));

        return saved;
    }

    @Transactional
    public Optional<WellnessEvent> updateStatus(String eventCode, String newStatus, String reason, String performedBy) {
        Optional<WellnessEvent> optionalEvent = eventRepository.findByEventCode(eventCode);
        if (optionalEvent.isEmpty()) {
            return Optional.empty();
        }

        WellnessEvent event = optionalEvent.get();
        String oldStatus = event.getStatus();
        event.setStatus(newStatus.toUpperCase());
        WellnessEvent updated = eventRepository.save(event);

        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        String note = (reason != null && !reason.isBlank()) ? reason : "Status transitioned from " + oldStatus + " to " + newStatus;
        auditLogRepository.save(new EventAuditLog(
                eventCode,
                "STATUS_UPDATE",
                (performedBy != null) ? performedBy : "DevOps Admin",
                note,
                "Build #142",
                now
        ));

        return Optional.of(updated);
    }

    public List<EventAuditLog> getAuditLogsForEvent(String eventCode) {
        return auditLogRepository.findByEventCodeOrderByIdDesc(eventCode);
    }

    public List<EventAuditLog> getRecentAuditLogs() {
        return auditLogRepository.findTop20ByOrderByIdDesc();
    }
}
