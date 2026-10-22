package com.acme.wellness.repository;

import com.acme.wellness.model.EventAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventAuditLogRepository extends JpaRepository<EventAuditLog, Long> {
    List<EventAuditLog> findByEventCodeOrderByIdDesc(String eventCode);
    List<EventAuditLog> findTop20ByOrderByIdDesc();
}
