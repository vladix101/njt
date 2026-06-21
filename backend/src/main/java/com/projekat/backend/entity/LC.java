package com.projekat.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class LC {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_listening_group")
    private ListeningGroup listeningGroup;

    @ManyToOne
    @JoinColumn(name = "id_candidate")
    private Candidate candidate;

    public LC() {
    }

    public LC(Long id, ListeningGroup listeningGroup, Candidate candidate) {
        this.id = id;
        this.listeningGroup = listeningGroup;
        this.candidate = candidate;
    }
}
