package com.projekat.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("CANDIDATE")
@Data
@EqualsAndHashCode(callSuper = true)
public class Candidate extends User {
    private Integer age;

    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL)
    private List<LC> lcs = new ArrayList<>();

    public Candidate() {
    }

    public Candidate(Long id, String name, String surname, Integer age, City city, UserProfile userProfile) {
        super(id, name, surname, userProfile);
        this.age = age;
        this.city = city;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public City getCity() {
        return city;
    }

    public void setCity(City city) {
        this.city = city;
    }
}
