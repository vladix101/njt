package com.projekat.backend.dto;

import java.util.List;

public class CandidateWithGroupsDto {
    private Long id;
    private String name;
    private String surname;
    private String username;
    private Integer age;
    private String cityName;
    private List<ListeningGroupDto> listeningGroups;

    public CandidateWithGroupsDto() {
    }

    public CandidateWithGroupsDto(Long id, String name, String surname, String username, Integer age,
                                  String cityName, List<ListeningGroupDto> listeningGroups) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.username = username;
        this.age = age;
        this.cityName = cityName;
        this.listeningGroups = listeningGroups;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    public List<ListeningGroupDto> getListeningGroups() {
        return listeningGroups;
    }

    public void setListeningGroups(List<ListeningGroupDto> listeningGroups) {
        this.listeningGroups = listeningGroups;
    }
}
