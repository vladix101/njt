package com.projekat.backend.repository;

import com.projekat.backend.entity.ListeningGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListeningGroupRepository extends JpaRepository<ListeningGroup, Long> {
    List<ListeningGroup> findByLcsCandidateId(Long candidateId);
}
