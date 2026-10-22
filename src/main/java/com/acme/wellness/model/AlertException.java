package com.acme.wellness.model;

import jakarta.persistence.*;

/**
 * Entity representing an automated operational alert or wellness exception
 * requiring HR operations or administrative triage.
 */
@Entity
@Table(name = "alert_exceptions")
public class AlertException {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String exceptionCode; // e.g. EX-8809

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    private String eventName;

    private String department;

    @Column(nullable = false, length = 20)
    private String severity; // HIGH, MEDIUM, LOW

    @Column(nullable = false, length = 20)
    private String status; // OPEN, IN_PROGRESS, RESOLVED

    private String slaRemaining; // e.g. "< 4h", "24h", "Passed"

    private String createdAt;

    public AlertException() {
    }

    public AlertException(String exceptionCode, String title, String description, String eventName,
                          String department, String severity, String status, String slaRemaining, String createdAt) {
        this.exceptionCode = exceptionCode;
        this.title = title;
        this.description = description;
        this.eventName = eventName;
        this.department = department;
        this.severity = severity;
        this.status = status;
        this.slaRemaining = slaRemaining;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExceptionCode() {
        return exceptionCode;
    }

    public void setExceptionCode(String exceptionCode) {
        this.exceptionCode = exceptionCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSlaRemaining() {
        return slaRemaining;
    }

    public void setSlaRemaining(String slaRemaining) {
        this.slaRemaining = slaRemaining;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
