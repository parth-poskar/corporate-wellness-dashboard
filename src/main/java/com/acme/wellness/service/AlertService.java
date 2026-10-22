package com.acme.wellness.service;

import com.acme.wellness.model.AlertException;
import com.acme.wellness.repository.AlertExceptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AlertService {

    private final AlertExceptionRepository alertRepository;

    public AlertService(AlertExceptionRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    public List<AlertException> getAllAlerts() {
        return alertRepository.findAll();
    }

    public List<AlertException> getAlertsByStatus(String status) {
        return alertRepository.findByStatus(status.toUpperCase());
    }

    public Map<String, Object> getAlertSummary() {
        long openCount = alertRepository.countByStatus("OPEN");
        long highPriority = alertRepository.countBySeverity("HIGH");
        long resolvedCount = alertRepository.countByStatus("RESOLVED");
        return Map.of(
                "openExceptions", openCount,
                "highPriority", highPriority,
                "resolvedCount", resolvedCount
        );
    }

    @Transactional
    public Optional<AlertException> resolveAlert(String exceptionCode) {
        Optional<AlertException> opt = alertRepository.findByExceptionCode(exceptionCode);
        if (opt.isPresent()) {
            AlertException alert = opt.get();
            alert.setStatus("RESOLVED");
            alert.setSlaRemaining("Passed");
            return Optional.of(alertRepository.save(alert));
        }
        return Optional.empty();
    }

    @Transactional
    public int bulkResolve() {
        List<AlertException> openAlerts = alertRepository.findByStatus("OPEN");
        for (AlertException a : openAlerts) {
            a.setStatus("RESOLVED");
            a.setSlaRemaining("Passed");
        }
        alertRepository.saveAll(openAlerts);
        return openAlerts.size();
    }
}
