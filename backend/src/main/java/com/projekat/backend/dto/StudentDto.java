package com.projekat.backend.dto;

public class StudentDto {
    private Long idStudent;
    private String name;
    private String surname;
    private String username;
    private String password;
    private Long city_id;
    private String city_name;

    public StudentDto() {
    }

    public StudentDto(Long idStudent, String surname, String name, String username, String password, Long city_id, String city_name) {
        this.idStudent = idStudent;
        this.surname = surname;
        this.name = name;
        this.username = username;
        this.password = password;
        this.city_id = city_id;
        this.city_name = city_name;
    }

    public Long getIdStudent() {
        return idStudent;
    }

    public void setIdStudent(Long idStudent) {
        this.idStudent = idStudent;
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
