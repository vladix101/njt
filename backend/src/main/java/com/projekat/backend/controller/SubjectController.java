package com.projekat.backend.controller;

import com.projekat.backend.dto.SubjectDto;
import com.projekat.backend.repository.SubjectRepository;
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
public class SubjectController {

    private final SubjectRepository subjectRepository;

    @GetMapping("/subjects")
    public List<SubjectDto> getSubjects() {
        return subjectRepository.findAll()
                .stream()
                .map(subject -> new SubjectDto(subject.getId(), subject.getName()))
                .toList();
    }
}
