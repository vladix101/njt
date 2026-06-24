package com.projekat.backend.service;

import com.projekat.backend.dto.CandidateDto;
import com.projekat.backend.dto.CandidateVerificationDto;
import com.projekat.backend.dto.InstructorDto;
import com.projekat.backend.dto.InstructorVerificationDto;
import com.projekat.backend.dto.LoginRequestDto;
import com.projekat.backend.dto.LoginResponseDto;
import com.projekat.backend.dto.MessageResponseDto;
import com.projekat.backend.dto.ResendVerificationCodeRequestDto;
import com.projekat.backend.entity.Candidate;
import com.projekat.backend.entity.City;
import com.projekat.backend.entity.Instructor;
import com.projekat.backend.entity.Subject;
import com.projekat.backend.entity.User;
import com.projekat.backend.entity.UserProfile;
import com.projekat.backend.exception.ValidationException;
import com.projekat.backend.repository.CandidateRepository;
import com.projekat.backend.repository.CityRepository;
import com.projekat.backend.repository.InstructorRepository;
import com.projekat.backend.repository.SubjectRepository;
import com.projekat.backend.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class UserService {

    private final CandidateRepository candidateRepository;
    private final InstructorRepository instructorRepository;
    private final CityRepository cityRepository;
    private final SubjectRepository subjectRepository;
    private final UserProfileRepository userProfileRepository;
    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username:}")
    private String mailSenderAddress;

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private static final String VERIFICATION_PROPERTY_PREFIX = "courseapp.email.verification.";
    private final Map<String, VerificationCodeData> verificationCodes = new ConcurrentHashMap<>();
    private final Map<String, CandidateDto> pendingCandidateRegistrations = new ConcurrentHashMap<>();
    private final Map<String, InstructorDto> pendingInstructorRegistrations = new ConcurrentHashMap<>();

    public MessageResponseDto startCandidateRegistration(CandidateDto candidateDto) {
        if (candidateDto == null) {
            throwValidationError("form", "Registration data is missing");
        }
        validateRegistration(candidateDto.getUsername(), candidateDto.getPassword(), candidateDto.getEmail());
        sendVerificationCode(candidateDto.getEmail(), false);
        pendingCandidateRegistrations.put(normalizeEmail(candidateDto.getEmail()), candidateDto);
        return new MessageResponseDto("Verification code sent successfully", candidateDto.getEmail());
    }

    public MessageResponseDto startInstructorRegistration(InstructorDto instructorDto) {
        if (instructorDto == null) {
            throwValidationError("form", "Registration data is missing");
        }
        validateRegistration(instructorDto.getUsername(), instructorDto.getPassword(), instructorDto.getEmail());
        sendVerificationCode(instructorDto.getEmail(), false);
        pendingInstructorRegistrations.put(normalizeEmail(instructorDto.getEmail()), instructorDto);
        return new MessageResponseDto("Verification code sent successfully", instructorDto.getEmail());
    }

    public Candidate verifyAndRegisterCandidate(CandidateVerificationDto verificationDto) {
        if (verificationDto == null || verificationDto.getCandidate() == null) {
            throwValidationError("form", "Registration data is missing");
        }

        String verificationEmail = resolveVerificationEmail(verificationDto.getEmail(), verificationDto.getCandidate().getEmail());
        CandidateDto candidateDto = pendingCandidateRegistrations.getOrDefault(
                normalizeEmail(verificationEmail),
                verificationDto.getCandidate()
        );
        candidateDto.setEmail(verificationEmail);
        validateVerificationCode(verificationEmail, verificationDto.getCode());

        Candidate candidate = registerCandidate(candidateDto);
        removeVerificationCode(verificationEmail);
        pendingCandidateRegistrations.remove(normalizeEmail(verificationEmail));
        return candidate;
    }

    public Instructor verifyAndRegisterInstructor(InstructorVerificationDto verificationDto) {
        if (verificationDto == null || verificationDto.getInstructor() == null) {
            throwValidationError("form", "Registration data is missing");
        }

        String verificationEmail = resolveVerificationEmail(verificationDto.getEmail(), verificationDto.getInstructor().getEmail());
        InstructorDto instructorDto = pendingInstructorRegistrations.getOrDefault(
                normalizeEmail(verificationEmail),
                verificationDto.getInstructor()
        );
        instructorDto.setEmail(verificationEmail);
        validateVerificationCode(verificationEmail, verificationDto.getCode());

        Instructor instructor = registerInstructor(instructorDto);
        removeVerificationCode(verificationEmail);
        pendingInstructorRegistrations.remove(normalizeEmail(verificationEmail));
        return instructor;
    }

    public MessageResponseDto resendVerificationCode(ResendVerificationCodeRequestDto requestDto) {
        if (requestDto == null || requestDto.getEmail() == null || requestDto.getEmail().isBlank()) {
            throwValidationError("email", "Email is required");
        }

        Map<String, String> fieldErrors = new LinkedHashMap<>();
        validateEmail(requestDto.getEmail(), fieldErrors);
        if (!fieldErrors.isEmpty()) {
            throw new ValidationException(fieldErrors);
        }

        sendVerificationCode(requestDto.getEmail(), true);
        return new MessageResponseDto("Verification code resent successfully", requestDto.getEmail());
    }

    public Candidate registerCandidate(CandidateDto candidateDto) {
        validateRegistration(candidateDto.getUsername(), candidateDto.getPassword(), candidateDto.getEmail());

        City city = null;
        if (candidateDto.getCityId() != null) {
            city = cityRepository.getReferenceById(candidateDto.getCityId());
        }

        UserProfile userProfile = new UserProfile(null, candidateDto.getUsername(), candidateDto.getPassword());
        Candidate candidate = new Candidate(null, candidateDto.getName(), candidateDto.getSurname(),
                candidateDto.getAge(), city, userProfile);

        return candidateRepository.save(candidate);
    }

    public Instructor registerInstructor(InstructorDto instructorDto) {
        validateRegistration(instructorDto.getUsername(), instructorDto.getPassword(), instructorDto.getEmail());

        Subject subject = null;
        if (instructorDto.getSubjectId() != null) {
            subject = subjectRepository.getReferenceById(instructorDto.getSubjectId());
        }

        UserProfile userProfile = new UserProfile(null, instructorDto.getUsername(), instructorDto.getPassword());
        Instructor instructor = new Instructor();
        instructor.setName(instructorDto.getName());
        instructor.setSurname(instructorDto.getSurname());
        instructor.setYearsOfExperience(instructorDto.getYearsOfExperience());
        instructor.setSubject(subject);
        instructor.setUserProfile(userProfile);

        return instructorRepository.save(instructor);
    }

    private void validateRegistration(String username, String password, String email) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();

        if (username == null || username.isBlank()) {
            fieldErrors.put("username", "Username is required");
        } else if (userProfileRepository.existsByUsername(username)) {
            fieldErrors.put("username", "Username already exists");
        }

        if (password == null || password.length() <= 6) {
            fieldErrors.put("password", "Password must have more than 6 characters");
        }

        validateEmail(email, fieldErrors);

        if (!fieldErrors.isEmpty()) {
            throw new ValidationException(fieldErrors);
        }
    }

    private void validateEmail(String email, Map<String, String> fieldErrors) {
        if (email == null || email.isBlank()) {
            fieldErrors.put("email", "Email is required");
        } else if (!EMAIL_PATTERN.matcher(email).matches()) {
            fieldErrors.put("email", "Email format is not valid");
        }
    }

    private synchronized void sendVerificationCode(String email, boolean replaceExistingCode) {
        String normalizedEmail = normalizeEmail(email);
        VerificationCodeData existingCodeData = findVerificationCode(normalizedEmail);
        boolean canReuseExistingCode = !replaceExistingCode
                && existingCodeData != null
                && LocalDateTime.now().isBefore(existingCodeData.expiresAt());

        String code = canReuseExistingCode
                ? existingCodeData.code()
                : String.format("%06d", SECURE_RANDOM.nextInt(1_000_000));
        LocalDateTime expiresAt = canReuseExistingCode
                ? existingCodeData.expiresAt()
                : LocalDateTime.now().plusMinutes(10);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailSenderAddress);
        message.setTo(email);
        message.setSubject("Email verification code");
        message.setText("Your verification code is: " + code + "\n\nThis code expires in 10 minutes.");

        try {
            javaMailSender.send(message);
            storeVerificationCode(normalizedEmail, code, expiresAt);
        } catch (MailException exception) {
            throwValidationError("form", "Verification email could not be sent. Check mail configuration.");
        }
    }

    private void validateVerificationCode(String email, String code) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        validateEmail(email, fieldErrors);

        String enteredCode = code == null ? "" : code.trim();

        if (!enteredCode.matches("\\d{6}")) {
            fieldErrors.put("code", "Verification code must contain exactly 6 digits");
        }

        if (!fieldErrors.isEmpty()) {
            throw new ValidationException(fieldErrors);
        }

        String normalizedEmail = normalizeEmail(email);
        VerificationCodeData codeData = findVerificationCode(normalizedEmail);

        if (codeData == null) {
            throwValidationError("code", "Verification code was not requested or has expired");
        }

        if (LocalDateTime.now().isAfter(codeData.expiresAt())) {
            removeVerificationCode(normalizedEmail);
            throwValidationError("code", "Verification code has expired");
        }

        if (!codeData.code().trim().equals(enteredCode)) {
            throwValidationError("code", "Verification code is not correct");
        }
    }

    private String resolveVerificationEmail(String requestEmail, String registrationEmail) {
        if (requestEmail != null && !requestEmail.isBlank()) {
            return requestEmail;
        }
        return registrationEmail;
    }

    private void storeVerificationCode(String normalizedEmail, String code, LocalDateTime expiresAt) {
        VerificationCodeData codeData = new VerificationCodeData(code, expiresAt);
        verificationCodes.put(normalizedEmail, codeData);
        System.setProperty(verificationPropertyKey(normalizedEmail), code + "|" + expiresAt);
    }

    private VerificationCodeData findVerificationCode(String normalizedEmail) {
        VerificationCodeData codeData = verificationCodes.get(normalizedEmail);
        if (codeData != null) {
            return codeData;
        }

        String storedValue = System.getProperty(verificationPropertyKey(normalizedEmail));
        if (storedValue == null || storedValue.isBlank()) {
            return null;
        }

        String[] parts = storedValue.split("\\|", 2);
        if (parts.length != 2) {
            removeVerificationCode(normalizedEmail);
            return null;
        }

        try {
            return new VerificationCodeData(parts[0], LocalDateTime.parse(parts[1]));
        } catch (RuntimeException exception) {
            removeVerificationCode(normalizedEmail);
            return null;
        }
    }

    private void removeVerificationCode(String email) {
        String normalizedEmail = normalizeEmail(email);
        verificationCodes.remove(normalizedEmail);
        System.clearProperty(verificationPropertyKey(normalizedEmail));
    }

    private String verificationPropertyKey(String normalizedEmail) {
        return VERIFICATION_PROPERTY_PREFIX + normalizedEmail;
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private void throwValidationError(String field, String message) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        fieldErrors.put(field, message);
        throw new ValidationException(fieldErrors);
    }

    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        UserProfile userProfile = userProfileRepository.findByUsername(loginRequestDto.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password"));

        if (!userProfile.getPassword().equals(loginRequestDto.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }

        User user = userProfile.getUser();
        return new LoginResponseDto(user.getId(), user.getName(), user.getSurname(), userProfile.getUsername(), getUserType(user));
    }

    private String getUserType(User user) {
        if (user instanceof Candidate) {
            return "CANDIDATE";
        }
        if (user instanceof Instructor) {
            return "INSTRUCTOR";
        }
        return "USER";
    }

    private record VerificationCodeData(String code, LocalDateTime expiresAt) {
    }
}
