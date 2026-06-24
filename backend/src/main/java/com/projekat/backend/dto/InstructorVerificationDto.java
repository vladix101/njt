package com.projekat.backend.dto;

public class InstructorVerificationDto {
    private InstructorDto instructor;
    private String email;
    private String code;

    public InstructorDto getInstructor() {
        return instructor;
    }

    public void setInstructor(InstructorDto instructor) {
        this.instructor = instructor;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
