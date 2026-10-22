package com.acme.wellness.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller handling user authentication and session management.
 * Designed to support the interactive states in Stitch Screen 1 (Wellness Hub Login).
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "field", "email",
                    "message", "Work email is required"
            ));
        }

        if (password == null || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "field", "password",
                    "message", "Password is required"
            ));
        }

        // Demo authentication simulation
        if ("wrongpassword".equalsIgnoreCase(password) || "invalid".equalsIgnoreCase(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "status", "error",
                    "message", "Invalid work email or password. Please verify credentials."
            ));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Authentication verified");
        response.put("user", Map.of(
                "email", email,
                "name", "Elena Vance",
                "role", "DevOps Admin / HR Ops Specialist",
                "department", "Engineering & People Operations",
                "avatarInitials", "EV"
        ));
        response.put("token", "demo-jwt-token-build142");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Session terminated. Please sign in again."
        ));
    }

    @GetMapping("/current-user")
    public ResponseEntity<?> getCurrentUser() {
        return ResponseEntity.ok(Map.of(
                "authenticated", true,
                "email", "elena.vance@acme-corp.internal",
                "name", "DevOps Admin",
                "role", "HR Ops Specialist",
                "pipelineStatus", "Jenkins Build #142 Healthy"
        ));
    }
}
