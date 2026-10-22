package com.acme.wellness.repository;

import com.acme.wellness.model.ParticipationTrend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipationTrendRepository extends JpaRepository<ParticipationTrend, Long> {
    List<ParticipationTrend> findAllByOrderByIdAsc();
}
