package com.acme.wellness.controller;

import com.acme.wellness.model.DeploymentTelemetry;
import com.acme.wellness.repository.DeploymentTelemetryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Controller serving simulated CI/CD pipeline telemetry.
 * Corresponds to Screen 8 (Deployment Status).
 *
 * All returned data includes explicit disclaimer properties identifying it as educational demo simulation.
 */
@RestController
@RequestMapping("/api/deployment")
public class DeploymentController {

    private final DeploymentTelemetryRepository telemetryRepository;

    public DeploymentController(DeploymentTelemetryRepository telemetryRepository) {
        this.telemetryRepository = telemetryRepository;
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getDeploymentStatus() {
        Optional<DeploymentTelemetry> latest = telemetryRepository.findTopByOrderByIdDesc();
        DeploymentTelemetry telemetry = latest.orElseGet(() ->
                new DeploymentTelemetry(24, "RUNNING", "main", "8f4a1c9", "dev-cluster-us-east-1", "GitHub Webhook", "Just now"));

        Map<String, Object> data = new HashMap<>();
        data.put("telemetry", telemetry);
        data.put("stages", List.of(
                Map.of("name", "Checkout & SCM Sync", "status", "PASSED", "duration", "4s"),
                Map.of("name", "Maven Verify & Checkstyle", "status", "PASSED", "duration", "18s"),
                Map.of("name", "Unit & Integration Tests", "status", "PASSED", "duration", "34s"),
                Map.of("name", "H2 In-Memory Validation", "status", "PASSED", "duration", "8s"),
                Map.of("name", "Docker Container Assembly", "status", telemetry.getStatus().equalsIgnoreCase("RUNNING") ? "IN_PROGRESS" : "PASSED", "duration", "22s"),
                Map.of("name", "Staging Health Check", "status", telemetry.getStatus().equalsIgnoreCase("RUNNING") ? "PENDING" : "PASSED", "duration", "--")
        ));
        data.put("isDemoSimulation", true);
        data.put("demoDisclaimer", "Illustrative DevOps telemetry for college mini-project demonstration. Not connected to active Jenkins server.");

        return ResponseEntity.ok(data);
    }

    @PostMapping("/simulate/{state}")
    public ResponseEntity<?> simulateState(@PathVariable String state) {
        String normalized = state.toUpperCase();
        DeploymentTelemetry tel = new DeploymentTelemetry(
                24, normalized, "main", "8f4a1c9", "dev-cluster-us-east-1", "Simulation Trigger", "Just now"
        );
        telemetryRepository.save(tel);
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "simulatedState", normalized,
                "message", "Telemetry simulated state set to " + normalized
        ));
    }

    @GetMapping("/console")
    public ResponseEntity<Map<String, String>> getConsoleLog() {
        String console = """
                [INFO] Started by GitHub push event by user elena-vance
                [INFO] Running in Durability level: MAX_SURVIVABILITY
                [INFO] Checking out git repository: https://github.com/acme-corp/corporate-wellness-dashboard.git
                [INFO] Commit SHA: 8f4a1c93f0b298 (HEAD -> main)
                [INFO] Scanning for projects...
                [INFO] ------------------------------------------------------------------------
                [INFO] Building corporate-wellness-dashboard 1.0.0-SNAPSHOT
                [INFO] ------------------------------------------------------------------------
                [INFO] --- maven-resources-plugin:3.3.1:resources (default-resources) ---
                [INFO] Copying 18 resources from src/main/resources to target/classes
                [INFO] --- maven-compiler-plugin:3.11.0:compile (default-compile) ---
                [INFO] Changes detected - recompiling the module!
                [INFO] Compiling 15 source files with javac [debug target 17] to target/classes
                [INFO] --- maven-surefire-plugin:3.1.2:test (default-test) ---
                [INFO] Running com.acme.wellness.CorporateWellnessApplicationTests
                [INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.84 s -- in com.acme.wellness.CorporateWellnessApplicationTests
                [INFO] H2 in-memory seed verification passed: 24 events, 8 exceptions nominal
                [INFO] BUILD SUCCESS
                [INFO] ------------------------------------------------------------------------
                [INFO] Total time: 14.821 s
                [INFO] Finished at: 2025-02-08T11:42:15Z
                """;
        return ResponseEntity.ok(Map.of("consoleLog", console));
    }
}
