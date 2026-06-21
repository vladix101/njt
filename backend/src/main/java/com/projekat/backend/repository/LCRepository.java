package com.projekat.backend.repository;

import com.projekat.backend.entity.LC;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LCRepository extends JpaRepository<LC, Long> {
    Optional<LC> findByCandidateIdAndListeningGroupId(Long candidateId, Long listeningGroupId);
}
