package com.projekat.backend.controller;

import com.projekat.backend.dto.CandidateDto;
import com.projekat.backend.dto.CandidateVerificationDto;
import com.projekat.backend.dto.InstructorDto;
import com.projekat.backend.dto.InstructorVerificationDto;
import com.projekat.backend.dto.LoginRequestDto;
import com.projekat.backend.dto.LoginResponseDto;
import com.projekat.backend.dto.MessageResponseDto;
import com.projekat.backend.dto.ResendVerificationCodeRequestDto;
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
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @PostMapping("/register/candidate")
    public ResponseEntity<MessageResponseDto> startCandidateRegistration(@RequestBody CandidateDto candidateDto) {
        return ResponseEntity.ok(userService.startCandidateRegistration(candidateDto));
    }

    @PostMapping("/register/candidate/verify")
    public ResponseEntity<String> verifyAndRegisterCandidate(@RequestBody CandidateVerificationDto verificationDto) {
        userService.verifyAndRegisterCandidate(verificationDto);
        return new ResponseEntity<>("Candidate registered successfully", HttpStatus.CREATED);
    }

    @PostMapping("/register/instructor")
    public ResponseEntity<MessageResponseDto> startInstructorRegistration(@RequestBody InstructorDto instructorDto) {
        return ResponseEntity.ok(userService.startInstructorRegistration(instructorDto));
    }

    @PostMapping("/register/instructor/verify")
    public ResponseEntity<String> verifyAndRegisterInstructor(@RequestBody InstructorVerificationDto verificationDto) {
        userService.verifyAndRegisterInstructor(verificationDto);
        return new ResponseEntity<>("Instructor registered successfully", HttpStatus.CREATED);
    }

    @PostMapping("/auth/resend-verification-code")
    public ResponseEntity<MessageResponseDto> resendVerificationCode(@RequestBody ResendVerificationCodeRequestDto requestDto) {
        return ResponseEntity.ok(userService.resendVerificationCode(requestDto));
    }

    @PostMapping("/login")
    public LoginResponseDto login(@RequestBody LoginRequestDto loginRequestDto) {
        return userService.login(loginRequestDto);
    }
}
