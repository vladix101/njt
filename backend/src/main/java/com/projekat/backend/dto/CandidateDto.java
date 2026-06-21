package com.projekat.backend.dto;

public class CandidateDto {
    private Long idCandidate;
    private String name;
    private String surname;
    private String username;
    private String password;
    private Integer age;
    private Long city_id;
    private String city_name;

    public CandidateDto() {
    }

    public CandidateDto(Long idCandidate, String surname, String name, String username, String password, Integer age, Long city_id, String city_name) {
        this.idCandidate = idCandidate;
        this.surname = surname;
        this.name = name;
        this.username = username;
        this.password = password;
        this.age = age;
        this.city_id = city_id;
        this.city_name = city_name;
    }

    public Long getIdCandidate() {
        return idCandidate;
    }

    public void setIdCandidate(Long idCandidate) {
        this.idCandidate = idCandidate;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Long getCity_id() {
        return city_id;
    }

    public void setCity_id(Long city_id) {
        this.city_id = city_id;
    }

    public String getCity_name() {
        return city_name;
    }

    public void setCity_name(String city_name) {
        this.city_name = city_name;
    }
}
