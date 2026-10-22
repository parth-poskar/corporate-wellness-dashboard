package com.acme.wellness.repository;

import com.acme.wellness.model.WellnessEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WellnessEventRepository extends JpaRepository<WellnessEvent, Long> {

    Optional<WellnessEvent> findByEventCode(String eventCode);

    List<WellnessEvent> findByDepartment(String department);

    List<WellnessEvent> findByStatus(String status);

    @Query("SELECT e FROM WellnessEvent e WHERE " +
           "(:department = 'all' OR LOWER(e.department) LIKE LOWER(CONCAT('%', :department, '%'))) AND " +
           "(:status = 'all' OR LOWER(e.status) = LOWER(:status)) AND " +
           "(:query IS NULL OR :query = '' OR LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(e.facilitator) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(e.venue) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<WellnessEvent> searchEvents(@Param("query") String query,
                                    @Param("department") String department,
                                    @Param("status") String status);

    long countByStatus(String status);
}
