package com.acme.wellness.controller;

import com.acme.wellness.model.Department;
import com.acme.wellness.model.ParticipationTrend;
import com.acme.wellness.model.WellnessEvent;
import com.acme.wellness.repository.DepartmentRepository;
import com.acme.wellness.repository.ParticipationTrendRepository;
import com.acme.wellness.repository.WellnessEventRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller providing statistical report analytics, participation breakdowns,
 * and data export options.
 * Corresponds to Screen 7 (Wellness Reports).
 */
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final DepartmentRepository departmentRepository;
    private final ParticipationTrendRepository trendRepository;
    private final WellnessEventRepository eventRepository;

    public ReportController(DepartmentRepository departmentRepository,
                            ParticipationTrendRepository trendRepository,
                            WellnessEventRepository eventRepository) {
        this.departmentRepository = departmentRepository;
        this.trendRepository = trendRepository;
        this.eventRepository = eventRepository;
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        Map<String, Object> data = new HashMap<>();
        List<Department> departments = departmentRepository.findAll();
        List<ParticipationTrend> trends = trendRepository.findAllByOrderByIdAsc();

        data.put("totalEvents", 48);
        data.put("totalParticipants", 1842);
        data.put("averageParticipation", 76.4);
        data.put("corporateTarget", 75.0);
        data.put("completedPrograms", 18);
        data.put("completionRate", 92.0);
        data.put("departments", departments);
        data.put("trends", trends);
        data.put("syncStatus", "Pipeline Sync: Jan 2025 Cycle • Updated nominal");

        return ResponseEntity.ok(data);
    }

    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportCsv() {
        List<WellnessEvent> events = eventRepository.findAll();
        StringBuilder csv = new StringBuilder();
        csv.append("Event Code,Title,Department,Date,Time Slot,Format,Venue,Facilitator,Capacity,Enrolled,Status\n");

        for (WellnessEvent e : events) {
            csv.append(String.format("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%d,%d,\"%s\"\n",
                    e.getEventCode(),
                    e.getTitle().replace("\"", "\"\""),
                    e.getDepartment(),
                    e.getEventDate(),
                    e.getTimeSlot(),
                    e.getFormat(),
                    e.getVenue(),
                    e.getFacilitator(),
                    e.getCapacity(),
                    e.getEnrolled(),
                    e.getStatus()
            ));
        }

        byte[] bytes = csv.toString().getBytes(StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"wellness-events-report.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bytes);
    }
}
