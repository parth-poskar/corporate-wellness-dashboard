package com.acme.wellness.model;

import jakarta.persistence.*;

/**
 * Entity tracking historical organizational participation percentages benchmarked
 * against corporate health initiative targets.
 */
@Entity
@Table(name = "participation_trends")
public class ParticipationTrend {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String monthLabel; // e.g. "Aug '24", "Jan '25"

    private Double actualPercentage;

    private Double targetPercentage; // Typically 75.0%

    private Integer enrolledCount;

    public ParticipationTrend() {
    }

    public ParticipationTrend(String monthLabel, Double actualPercentage, Double targetPercentage, Integer enrolledCount) {
        this.monthLabel = monthLabel;
        this.actualPercentage = actualPercentage;
        this.targetPercentage = targetPercentage;
        this.enrolledCount = enrolledCount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMonthLabel() {
        return monthLabel;
    }

    public void setMonthLabel(String monthLabel) {
        this.monthLabel = monthLabel;
    }

    public Double getActualPercentage() {
        return actualPercentage;
    }

    public void setActualPercentage(Double actualPercentage) {
        this.actualPercentage = actualPercentage;
    }

    public Double getTargetPercentage() {
        return targetPercentage;
    }

    public void setTargetPercentage(Double targetPercentage) {
        this.targetPercentage = targetPercentage;
    }

    public Integer getEnrolledCount() {
        return enrolledCount;
    }

    public void setEnrolledCount(Integer enrolledCount) {
        this.enrolledCount = enrolledCount;
    }
}
