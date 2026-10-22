package com.acme.wellness.model;

import jakarta.persistence.*;

/**
 * Entity tracking immutable audit log entries for event lifecycle updates,
 * status changes, and simulated CI/CD webhook references.
 */
@Entity
@Table(name = "event_audit_logs")
public class EventAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30)
    private String eventCode;

    @Column(nullable = false)
    private String action;

    private String performedBy;

    @Column(length = 1000)
    private String auditNote;

    private String jenkinsBuildNo; // e.g. "Build #142"

    private String timestamp;

    public EventAuditLog() {
    }

    public EventAuditLog(String eventCode, String action, String performedBy, String auditNote, String jenkinsBuildNo, String timestamp) {
        this.eventCode = eventCode;
        this.action = action;
        this.performedBy = performedBy;
        this.auditNote = auditNote;
        this.jenkinsBuildNo = jenkinsBuildNo;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEventCode() {
        return eventCode;
    }

    public void setEventCode(String eventCode) {
        this.eventCode = eventCode;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getPerformedBy() {
        return performedBy;
    }

    public void setPerformedBy(String performedBy) {
        this.performedBy = performedBy;
    }

    public String getAuditNote() {
        return auditNote;
    }

    public void setAuditNote(String auditNote) {
        this.auditNote = auditNote;
    }

    public String getJenkinsBuildNo() {
        return jenkinsBuildNo;
    }

    public void setJenkinsBuildNo(String jenkinsBuildNo) {
        this.jenkinsBuildNo = jenkinsBuildNo;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
