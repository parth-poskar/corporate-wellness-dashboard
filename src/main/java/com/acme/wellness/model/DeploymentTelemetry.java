package com.acme.wellness.model;

import jakarta.persistence.*;

/**
 * Entity tracking simulated CI/CD deployment telemetry.
 *
 * NOTE: This represents realistic mock telemetry designed for student demonstration
 * and UI simulation. It does not connect to or control an active external build server.
 */
@Entity
@Table(name = "deployment_telemetry")
public class DeploymentTelemetry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer buildNumber;

    @Column(nullable = false, length = 20)
    private String status; // RUNNING, STABLE, FAILED, OFFLINE

    private String branch;

    private String commitSha;

    private String pipelineTarget;

    private String triggerType;

    private String timestamp;

    private Boolean isDemoSimulation;

    private String disclaimer;

    public DeploymentTelemetry() {
    }

    public DeploymentTelemetry(Integer buildNumber, String status, String branch, String commitSha,
                               String pipelineTarget, String triggerType, String timestamp) {
        this.buildNumber = buildNumber;
        this.status = status;
        this.branch = branch;
        this.commitSha = commitSha;
        this.pipelineTarget = pipelineTarget;
        this.triggerType = triggerType;
        this.timestamp = timestamp;
        this.isDemoSimulation = true;
        this.disclaimer = "Illustrative DevOps telemetry for educational demonstration purposes.";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getBuildNumber() {
        return buildNumber;
    }

    public void setBuildNumber(Integer buildNumber) {
        this.buildNumber = buildNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public String getCommitSha() {
        return commitSha;
    }

    public void setCommitSha(String commitSha) {
        this.commitSha = commitSha;
    }

    public String getPipelineTarget() {
        return pipelineTarget;
    }

    public void setPipelineTarget(String pipelineTarget) {
        this.pipelineTarget = pipelineTarget;
    }

    public String getTriggerType() {
        return triggerType;
    }

    public void setTriggerType(String triggerType) {
        this.triggerType = triggerType;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public Boolean getIsDemoSimulation() {
        return isDemoSimulation;
    }

    public void setIsDemoSimulation(Boolean isDemoSimulation) {
        this.isDemoSimulation = isDemoSimulation;
    }

    public String getDisclaimer() {
        return disclaimer;
    }

    public void setDisclaimer(String disclaimer) {
        this.disclaimer = disclaimer;
    }
}
