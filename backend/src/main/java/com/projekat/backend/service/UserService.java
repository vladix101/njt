package com.projekat.backend.service;

import com.projekat.backend.dto.CandidateDto;
import com.projekat.backend.dto.InstructorDto;
import com.projekat.backend.entity.Candidate;
import com.projekat.backend.entity.City;
import com.projekat.backend.entity.Instructor;
import com.projekat.backend.entity.Subject;
import com.projekat.backend.entity.UserProfile;
import com.projekat.backend.repository.CandidateRepository;
import com.projekat.backend.repository.CityRepository;
import com.projekat.backend.repository.InstructorRepository;
import com.projekat.backend.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final CandidateRepository candidateRepository;
    private final InstructorRepository instructorRepository;
    private final CityRepository cityRepository;
    private final SubjectRepository subjectRepository;

    public Candidate registerCandidate(CandidateDto candidateDto) {
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
}
