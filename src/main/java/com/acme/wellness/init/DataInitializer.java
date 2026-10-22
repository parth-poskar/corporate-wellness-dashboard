package com.acme.wellness.init;

import com.acme.wellness.model.*;
import com.acme.wellness.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/**
 * Initializes the in-memory H2 database with realistic, high-fidelity corporate wellness
 * demonstration data that aligns with the Google Stitch project design screens.
 *
 * NOTE: All Jenkins telemetry data is purely illustrative for student and demo presentation.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final DepartmentRepository departmentRepository;
    private final WellnessEventRepository eventRepository;
    private final AlertExceptionRepository alertRepository;
    private final ParticipationTrendRepository trendRepository;
    private final EventAuditLogRepository auditLogRepository;
    private final DeploymentTelemetryRepository telemetryRepository;

    public DataInitializer(DepartmentRepository departmentRepository,
                           WellnessEventRepository eventRepository,
                           AlertExceptionRepository alertRepository,
                           ParticipationTrendRepository trendRepository,
                           EventAuditLogRepository auditLogRepository,
                           DeploymentTelemetryRepository telemetryRepository) {
        this.departmentRepository = departmentRepository;
        this.eventRepository = eventRepository;
        this.alertRepository = alertRepository;
        this.trendRepository = trendRepository;
        this.auditLogRepository = auditLogRepository;
        this.telemetryRepository = telemetryRepository;
    }

    @Override
    public void run(String... args) {
        seedDepartments();
        seedParticipationTrends();
        seedWellnessEvents();
        seedAlertExceptions();
        seedAuditLogs();
        seedDeploymentTelemetry();
    }

    private void seedDepartments() {
        if (departmentRepository.count() > 0) return;

        List<Department> depts = Arrays.asList(
                new Department("Engineering & DevOps", "ENG", 477, 420, 88.0),
                new Department("Customer Experience / Ops", "CX", 385, 312, 81.0),
                new Department("Marketing Operations", "MKT", 250, 185, 74.0),
                new Department("Finance & Legal", "FIN", 250, 180, 72.0),
                new Department("Human Resources", "HR", 120, 113, 94.2),
                new Department("Enterprise / All Hands", "ALL", 1842, 1420, 77.1)
        );
        departmentRepository.saveAll(depts);
    }

    private void seedParticipationTrends() {
        if (trendRepository.count() > 0) return;

        List<ParticipationTrend> trends = Arrays.asList(
                new ParticipationTrend("Aug '24", 68.0, 75.0, 1252),
                new ParticipationTrend("Sep '24", 71.0, 75.0, 1308),
                new ParticipationTrend("Oct '24", 74.0, 75.0, 1363),
                new ParticipationTrend("Nov '24", 73.0, 75.0, 1345),
                new ParticipationTrend("Dec '24", 79.0, 75.0, 1455),
                new ParticipationTrend("Jan '25", 76.4, 75.0, 1420)
        );
        trendRepository.saveAll(trends);
    }

    private void seedWellnessEvents() {
        if (eventRepository.count() > 0) return;

        List<WellnessEvent> events = Arrays.asList(
                new WellnessEvent("EVT-2025-0802", "Yoga & Mindfulness", "Human Resources",
                        "2025-02-08", "09:00 AM - 10:15 AM EST", "Hybrid",
                        "Studio A & Zoom Bridge", "Maya Patel", 50, 38,
                        100, "ACTIVE", "Gentle Vinyasa flow coupled with breathwork exercises for desk stress reduction and posture alignment."),

                new WellnessEvent("EVT-2025-0803", "Ergonomics Assessment Clinic", "Product & Tech",
                        "2025-01-24", "11:00 AM - 01:00 PM EST", "Onsite",
                        "Building 4 Innovation Lab", "Dr. David Vance", 100, 94,
                        75, "COMPLETED", "One-on-one professional ergonomic evaluations, lumbar adjustments, and sit-stand desk setup optimizations."),

                new WellnessEvent("EVT-2025-0804", "Mental Health Day Kickoff", "Cust. Operations",
                        "2025-01-21", "10:00 AM - 11:30 AM EST", "Hybrid",
                        "Auditorium Main Stage", "Sarah Lin", 350, 265,
                        150, "ACTIVE", "Keynote address on psychological safety, burnout prevention strategies, and internal mental health benefits overview."),

                new WellnessEvent("EVT-2025-0805", "Step Challenge Sprint", "Finance & Legal",
                        "2025-01-18", "08:00 AM - 08:00 PM EST", "Virtual",
                        "Global App Challenge", "Marcus Rivera", 250, 180,
                        200, "SCHEDULED", "Enterprise 10,000 steps daily team streak competition with smart wearable synchronization and rewards."),

                new WellnessEvent("EVT-2025-0806", "Desk Yoga & Posture Clinic", "Sales & Marketing",
                        "2025-01-15", "03:00 PM - 03:45 PM EST", "Virtual",
                        "Wellness Studio West", "Elena Gomez", 100, 18,
                        50, "AT_RISK", "Short guided physical decompression breaks targeting neck strain, wrist mobility, and eye fatigue during sales sprints."),

                new WellnessEvent("EVT-2025-0807", "Biometric Screening & Blood Drive", "Enterprise / All",
                        "2025-02-14", "08:30 AM - 04:30 PM EST", "Onsite",
                        "Atrium North Wing", "Red Cross & Quest Diagnostics", 200, 142,
                        250, "SCHEDULED", "Comprehensive annual metabolic panel, lipid testing, blood pressure checks, and voluntary Red Cross donation clinic."),

                new WellnessEvent("EVT-2025-0808", "Nutritional Resilience Seminar", "Operations & Tech",
                        "2025-02-18", "12:00 PM - 01:00 PM EST", "Hybrid",
                        "Cafeteria Training Room", "Chef Jordan Bell", 80, 68,
                        75, "SCHEDULED", "Practical batch-cooking masterclass focusing on anti-inflammatory brain foods, healthy meal prep, and stable blood sugar maintenance."),

                new WellnessEvent("EVT-2025-0809", "Flu Vaccination Drive #1", "Enterprise / All",
                        "2025-01-10", "09:00 AM - 05:00 PM EST", "Onsite",
                        "Chicago Regional Office", "Walgreens Corporate Health", 150, 148,
                        100, "COMPLETED", "Annual seasonal influenza immunization clinic for employees and registered dependents."),

                new WellnessEvent("EVT-2025-0810", "Meditation & Sound Bath Immersion", "Human Resources",
                        "2025-02-22", "04:30 PM - 05:30 PM EST", "Onsite",
                        "Quiet Reflection Room B", "Aria Tanaka", 30, 29,
                        100, "SCHEDULED", "Acoustic relaxation therapy using Tibetan singing bowls for nervous system calming and restorative evening transition."),

                new WellnessEvent("EVT-2025-0811", "Financial Wellness: 401(k) & HSA Growth", "Finance & Legal",
                        "2025-02-25", "01:00 PM - 02:30 PM EST", "Virtual",
                        "Webcast Live Stream", "Fidelity Investment Advisors", 300, 240,
                        125, "SCHEDULED", "Educational session on HSA triple tax-advantaged savings, retirement compounding, and debt reduction frameworks."),

                new WellnessEvent("EVT-2025-0812", "Couch to 5K Training Club", "Customer Experience",
                        "2025-03-01", "07:00 AM - 08:00 AM EST", "Onsite",
                        "Campus Outdoor Track", "Coach Brian Murphy", 60, 45,
                        150, "SCHEDULED", "Progressive interval running cohort meeting twice weekly for beginner and intermediate runners preparing for the spring charity run."),

                new WellnessEvent("EVT-2025-0813", "Sleep Hygiene & Circadian Optimization", "Engineering & DevOps",
                        "2025-02-12", "02:00 PM - 03:00 PM EST", "Virtual",
                        "Zoom Channel 4", "Dr. Andrew Kline", 200, 185,
                        75, "SCHEDULED", "Evidence-based strategies to mitigate blue light effects, sleep disruptions from on-call duties, and enhance REM sleep recovery.")
        );
        eventRepository.saveAll(events);
    }

    private void seedAlertExceptions() {
        if (alertRepository.count() > 0) return;

        List<AlertException> alerts = Arrays.asList(
                new AlertException("EX-8809", "Vendor Supply Chain Delay",
                        "Diagnostic test kit shipment hold-up at logistics hub for Chicago Regional Office.",
                        "Biometric Screening & Blood Drive", "Enterprise / All", "HIGH", "OPEN", "< 4h", "2025-02-03 09:15"),

                new AlertException("EX-8798", "Waiver Compliance Pending",
                        "4 participants missing signed physical liability waiver before active studio commencement.",
                        "Yoga & Mindfulness", "Human Resources", "LOW", "RESOLVED", "Passed", "2025-02-02 10:20"),

                new AlertException("EX-8791", "Low Participation Threshold",
                        "Registration rate is at 18%, which is below the mandatory 40% department threshold.",
                        "Desk Yoga & Posture Clinic", "Sales & Marketing", "HIGH", "OPEN", "2h", "2025-02-01 14:00"),

                new AlertException("EX-8780", "Health Risk Assessment Overdue",
                        "Operations Dept has 48 pending mandatory wellness survey filings.",
                        "Corporate Health Survey", "Operations & Tech", "MEDIUM", "OPEN", "18h", "2025-01-30 11:30"),

                new AlertException("EX-8772", "Room Booking Dual-Reservation Conflict",
                        "Auditorium Main Stage double-booked with Quarterly All-Hands briefing.",
                        "Mental Health Day Kickoff", "Customer Experience", "MEDIUM", "IN_PROGRESS", "8h", "2025-01-29 16:45"),

                new AlertException("EX-8761", "Vaccine Cold-Chain Temperature Variance",
                        "Batch #4902 stored within acceptable margin but flagged for vendor temperature calibration verification.",
                        "Flu Vaccination Drive #1", "Enterprise / All", "LOW", "RESOLVED", "Passed", "2025-01-10 08:10"),

                new AlertException("EX-8755", "Facilitator Unavailability Alert",
                        "Backup nutritionist assigned following short-notice flight delay.",
                        "Nutritional Resilience Seminar", "Operations & Tech", "MEDIUM", "RESOLVED", "Passed", "2025-01-08 17:00"),

                new AlertException("EX-8740", "Wearable App Sync API Throttling",
                        "Third-party pedometer sync rate-limited during peak morning upload window.",
                        "Step Challenge Sprint", "Finance & Legal", "LOW", "RESOLVED", "Passed", "2025-01-05 09:00")
        );
        alertRepository.saveAll(alerts);
    }

    private void seedAuditLogs() {
        if (auditLogRepository.count() > 0) return;

        List<EventAuditLog> logs = Arrays.asList(
                new EventAuditLog("EVT-2025-0802", "STATUS_CHANGE", "DevOps Admin", "Status verified and marked as ACTIVE. Onsite check-in active.", "Build #142", "2025-02-08 09:05 EST"),
                new EventAuditLog("EVT-2025-0802", "ENROLLMENT_UPDATE", "System Sync", "38/50 enrolled attendees confirmed via SSO badge scan.", "Build #141", "2025-02-08 08:50 EST"),
                new EventAuditLog("EVT-2025-0802", "EVENT_PUBLISHED", "Maya Patel", "Initial schedule published to corporate Outlook & Slack channels.", "Build #140", "2025-01-20 14:00 EST"),
                new EventAuditLog("EVT-2025-0806", "ALERT_TRIGGERED", "Automated Policy Engine", "Participation below 40% threshold triggered administrative exception EX-8791.", "Build #142", "2025-02-01 14:00 EST")
        );
        auditLogRepository.saveAll(logs);
    }

    private void seedDeploymentTelemetry() {
        if (telemetryRepository.count() > 0) return;

        DeploymentTelemetry telemetry = new DeploymentTelemetry(
                24, "RUNNING", "main", "8f4a1c9", "dev-cluster-us-east-1", "GitHub Webhook", "2025-02-08 11:42 EST"
        );
        telemetryRepository.save(telemetry);
    }
}
