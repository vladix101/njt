package com.projekat.backend.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("INSTRUCTOR")
@Data
@EqualsAndHashCode(callSuper = true)
public class Instructor extends User {
    private Integer yearsOfExperience;

    @OneToMany(mappedBy = "instructor")
    private List<ListeningGroup> listeningGroups = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    public Instructor() {
    }
}
