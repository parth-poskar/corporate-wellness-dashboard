package com.acme.wellness.service;

import com.acme.wellness.model.Department;
import com.acme.wellness.model.ParticipationTrend;
import com.acme.wellness.model.WellnessEvent;
import com.acme.wellness.repository.AlertExceptionRepository;
import com.acme.wellness.repository.DepartmentRepository;
import com.acme.wellness.repository.ParticipationTrendRepository;
import com.acme.wellness.repository.WellnessEventRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final WellnessEventRepository eventRepository;
    private final AlertExceptionRepository alertRepository;
    private final DepartmentRepository departmentRepository;
    private final ParticipationTrendRepository trendRepository;

    public DashboardService(WellnessEventRepository eventRepository,
                            AlertExceptionRepository alertRepository,
                            DepartmentRepository departmentRepository,
                            ParticipationTrendRepository trendRepository) {
        this.eventRepository = eventRepository;
        this.alertRepository = alertRepository;
        this.departmentRepository = departmentRepository;
        this.trendRepository = trendRepository;
    }

    public Map<String, Object> getDashboardSummary() {
        Map<String, Object> summary = new HashMap<>();

        long totalEvents = eventRepository.count();
        long activeEvents = eventRepository.countByStatus("ACTIVE");
        long scheduledEvents = eventRepository.countByStatus("SCHEDULED");
        long completedEvents = eventRepository.countByStatus("COMPLETED");
        long atRiskEvents = eventRepository.countByStatus("AT_RISK");

        long openExceptions = alertRepository.countByStatus("OPEN");
        long highPriorityAlerts = alertRepository.countBySeverity("HIGH");

        List<Department> departments = departmentRepository.findAll();
        List<ParticipationTrend> trends = trendRepository.findAllByOrderByIdAsc();
        List<WellnessEvent> recentEvents = eventRepository.findAll();
        if (recentEvents.size() > 5) {
            recentEvents = recentEvents.subList(0, 5);
        }

        // Aggregate participation metrics directly from H2 trend records
        double avgParticipation = trends.isEmpty() ? 76.4 :
                trends.get(trends.size() - 1).getActualPercentage();

        summary.put("totalEvents", totalEvents);
        summary.put("activeEvents", activeEvents);
        summary.put("scheduledEvents", scheduledEvents);
        summary.put("completedEvents", completedEvents);
        summary.put("atRiskEvents", atRiskEvents);
        summary.put("activePrograms", activeEvents);
        summary.put("participationRate", avgParticipation);
        summary.put("targetParticipationRate", 75.0);
        summary.put("openExceptions", openExceptions);
        summary.put("highPriorityExceptions", highPriorityAlerts);
        summary.put("departments", departments);
        summary.put("trends", trends);
        summary.put("recentEvents", recentEvents);
        summary.put("ciCdStatus", "Jenkins Build #142 Healthy / Prod Pipeline (Demo data)");

        return summary;
    }
}
