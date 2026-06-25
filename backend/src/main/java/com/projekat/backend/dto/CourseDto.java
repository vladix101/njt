package com.projekat.backend.dto;

public class CourseDto {
    private Long id;
    private String name;
    private String level;
    private String description;

    public CourseDto() {
    }

    public CourseDto(Long id, String name, String level, String description) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.description = description;
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

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
