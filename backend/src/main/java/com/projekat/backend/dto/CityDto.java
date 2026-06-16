package com.projekat.backend.dto;

public class CityDto {

    private Long id;
    private String name;

    public CityDto() {
    }

    public CityDto(String name, Long id) {
        this.name = name;
        this.id = id;
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
}
