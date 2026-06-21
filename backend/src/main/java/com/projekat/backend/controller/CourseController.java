package com.projekat.backend.controller;

import com.projekat.backend.dto.CourseDto;
import com.projekat.backend.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CourseController {

    private final CourseRepository courseRepository;

    @GetMapping("/courses")
    public List<CourseDto> getCourses() {
        return courseRepository.findAll()
                .stream()
                .map(course -> new CourseDto(course.getId(), course.getName(), course.getLevel()))
                .toList();
    }
}
