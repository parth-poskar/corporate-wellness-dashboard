package com.acme.wellness.repository;

import com.acme.wellness.model.DeploymentTelemetry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeploymentTelemetryRepository extends JpaRepository<DeploymentTelemetry, Long> {
    Optional<DeploymentTelemetry> findTopByOrderByIdDesc();
    List<DeploymentTelemetry> findTop10ByOrderByIdDesc();
}
