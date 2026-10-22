package com.acme.wellness.model;

import jakarta.persistence.*;

/**
 * Entity representing an enterprise department or business unit participating
 * in corporate wellness programs.
 */
@Entity
@Table(name = "departments")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, length = 20)
    private String code;

    private Integer totalEmployees;

    private Integer enrolledEmployees;

    private Double participationRate;

    public Department() {
    }

    public Department(String name, String code, Integer totalEmployees, Integer enrolledEmployees, Double participationRate) {
        this.name = name;
        this.code = code;
        this.totalEmployees = totalEmployees;
        this.enrolledEmployees = enrolledEmployees;
        this.participationRate = participationRate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Integer getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(Integer totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public Integer getEnrolledEmployees() {
        return enrolledEmployees;
    }

    public void setEnrolledEmployees(Integer enrolledEmployees) {
        this.enrolledEmployees = enrolledEmployees;
    }

    public Double getParticipationRate() {
        return participationRate;
    }

    public void setParticipationRate(Double participationRate) {
        this.participationRate = participationRate;
    }
}
