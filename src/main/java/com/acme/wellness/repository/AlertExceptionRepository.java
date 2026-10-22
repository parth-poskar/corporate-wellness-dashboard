package com.acme.wellness.repository;

import com.acme.wellness.model.AlertException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlertExceptionRepository extends JpaRepository<AlertException, Long> {

    Optional<AlertException> findByExceptionCode(String exceptionCode);

    List<AlertException> findByStatus(String status);

    List<AlertException> findBySeverity(String severity);

    long countByStatus(String status);

    long countBySeverity(String severity);
}
