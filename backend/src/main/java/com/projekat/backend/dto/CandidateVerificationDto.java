package com.projekat.backend.dto;

public class CandidateVerificationDto {
    private CandidateDto candidate;
    private String email;
    private String code;

    public CandidateDto getCandidate() {
        return candidate;
    }

    public void setCandidate(CandidateDto candidate) {
        this.candidate = candidate;
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
