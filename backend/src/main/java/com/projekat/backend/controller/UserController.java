package com.projekat.backend.controller;

import com.projekat.backend.dto.CandidateDto;
import com.projekat.backend.dto.InstructorDto;
import com.projekat.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/register")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @PostMapping("/candidate")
    public ResponseEntity<String> registerCandidate(@RequestBody CandidateDto candidateDto) {
        userService.registerCandidate(candidateDto);
        return new ResponseEntity<>("Candidate registered successfully", HttpStatus.CREATED);
    }

    @PostMapping("/instructor")
    public ResponseEntity<String> registerInstructor(@RequestBody InstructorDto instructorDto) {
        userService.registerInstructor(instructorDto);
        return new ResponseEntity<>("Instructor registered successfully", HttpStatus.CREATED);
    }
}
