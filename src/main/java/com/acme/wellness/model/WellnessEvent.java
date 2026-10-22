package com.acme.wellness.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Entity representing an enterprise wellness event (e.g., Yoga & Mindfulness,
 * Desk Ergonomics, Flu Vaccination, Biometric Screenings).
 */
@Entity
@Table(name = "wellness_events")
public class WellnessEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String eventCode;

    @NotBlank(message = "Event title is required")
    @Size(min = 5, max = 80, message = "Event title must be between 5 and 80 characters")
    @Column(nullable = false, length = 80)
    private String title;

    @NotBlank(message = "Department allocation is required")
    @Column(nullable = false)
    private String department;

    @NotBlank(message = "Event date is required")
    @Column(nullable = false)
    private String eventDate;

    private String timeSlot;

    private String format; // Onsite, Virtual, Hybrid

    private String venue; // Room name or Video conferencing URL

    private String facilitator;

    @NotNull(message = "Capacity is required")
    private Integer capacity;

    private Integer enrolled;

    private Integer wellnessCredits;

    @Column(nullable = false, length = 20)
    private String status; // ACTIVE, SCHEDULED, COMPLETED, AT_RISK, CANCELLED

    @Column(length = 2000)
    private String description;

    public WellnessEvent() {
    }

    public WellnessEvent(String eventCode, String title, String department, String eventDate, String timeSlot,
                         String format, String venue, String facilitator, Integer capacity, Integer enrolled,
                         Integer wellnessCredits, String status, String description) {
        this.eventCode = eventCode;
        this.title = title;
        this.department = department;
        this.eventDate = eventDate;
        this.timeSlot = timeSlot;
        this.format = format;
        this.venue = venue;
        this.facilitator = facilitator;
        this.capacity = capacity;
        this.enrolled = enrolled;
        this.wellnessCredits = wellnessCredits;
        this.status = status;
        this.description = description;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getEventDate() {
        return eventDate;
    }

    public void setEventDate(String eventDate) {
        this.eventDate = eventDate;
    }

    public String getTimeSlot() {
        return timeSlot;
    }

    public void setTimeSlot(String timeSlot) {
        this.timeSlot = timeSlot;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getFacilitator() {
        return facilitator;
    }

    public void setFacilitator(String facilitator) {
        this.facilitator = facilitator;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getEnrolled() {
        return enrolled;
    }

    public void setEnrolled(Integer enrolled) {
        this.enrolled = enrolled;
    }

    public Integer getWellnessCredits() {
        return wellnessCredits;
    }

    public void setWellnessCredits(Integer wellnessCredits) {
        this.wellnessCredits = wellnessCredits;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getEnrollmentPercentage() {
        if (capacity == null || capacity <= 0) return 0;
        int count = (enrolled != null) ? enrolled : 0;
        return (int) Math.min(100, Math.round(((double) count / capacity) * 100));
    }
}
