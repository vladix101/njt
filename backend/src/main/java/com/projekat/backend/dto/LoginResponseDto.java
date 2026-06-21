package com.projekat.backend.dto;

public class LoginResponseDto {
    private Long userId;
    private String name;
    private String surname;
    private String username;
    private String userType;

    public LoginResponseDto() {
    }

    public LoginResponseDto(Long userId, String name, String surname, String username, String userType) {
        this.userId = userId;
        this.name = name;
        this.surname = surname;
        this.username = username;
        this.userType = userType;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }
}
