package com.projekat.backend.repository;

import com.projekat.backend.entity.ListeningGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ListeningGroupRepository extends JpaRepository<ListeningGroup, Long> {
    List<ListeningGroup> findByLcsCandidateId(Long candidateId);
    boolean existsByCourseIdAndStartDate(Long courseId, LocalDateTime startDate);
    boolean existsByCourseIdAndStartDateAndIdNot(Long courseId, LocalDateTime startDate, Long id);
}
