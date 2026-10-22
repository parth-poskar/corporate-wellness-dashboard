package com.acme.wellness.controller;

import com.acme.wellness.model.AlertException;
import com.acme.wellness.service.AlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Controller handling operational triage, administrative exceptions, and reminder triggers.
 * Corresponds to Screen 6 (Alerts & Exceptions).
 */
@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public ResponseEntity<List<AlertException>> getAlerts(
            @RequestParam(required = false) String status) {
        if (status != null && !status.equalsIgnoreCase("all")) {
            return ResponseEntity.ok(alertService.getAlertsByStatus(status));
        }
        return ResponseEntity.ok(alertService.getAllAlerts());
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getAlertSummary() {
        return ResponseEntity.ok(alertService.getAlertSummary());
    }

    @PostMapping("/{exceptionCode}/resolve")
    public ResponseEntity<?> resolveAlert(@PathVariable String exceptionCode) {
        Optional<AlertException> resolved = alertService.resolveAlert(exceptionCode);
        if (resolved.isPresent()) {
            return ResponseEntity.ok(resolved.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/bulk-resolve")
    public ResponseEntity<?> bulkResolve() {
        int count = alertService.bulkResolve();
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "resolvedCount", count,
                "message", "Successfully resolved " + count + " active alerts."
        ));
    }
}
