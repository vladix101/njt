package com.projekat.backend.service;

import com.projekat.backend.dto.CandidateDto;
import com.projekat.backend.entity.City;
import com.projekat.backend.entity.Candidate;
import com.projekat.backend.entity.UserProfile;
import com.projekat.backend.repository.CityRepository;
import com.projekat.backend.repository.CandidateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final CityRepository cityRepository;

    public CandidateDto postCandidate(CandidateDto candidateDto){
        City city = null;
        if (candidateDto.getCity_id() != null) {
            city = cityRepository.getReferenceById(candidateDto.getCity_id());
        }
        UserProfile userProfile = new UserProfile(null, candidateDto.getUsername(), candidateDto.getPassword());
        Candidate candidate = new Candidate(candidateDto.getIdCandidate(), candidateDto.getName(), candidateDto.getSurname(),
                candidateDto.getAge(), city, userProfile);
        Candidate c = candidateRepository.save(candidate);
        return toDto(c);
    }

    public List<CandidateDto> getCandidates() {
        List<CandidateDto> candidatesDto = new ArrayList<>();
        List<Candidate> candidates = candidateRepository.findAll();
        for (Candidate c : candidates){
            candidatesDto.add(toDto(c));
        }
        return candidatesDto;
    }

    public void deleteCandidate(Long id){
        candidateRepository.deleteById(id);
    }

    private CandidateDto toDto(Candidate candidate) {
        Long cityId = null;
        String cityName = null;
        if (candidate.getCity() != null) {
            cityId = candidate.getCity().getId();
            cityName = candidate.getCity().getName();
        }
        String username = null;
        String password = null;
        if (candidate.getUserProfile() != null) {
            username = candidate.getUserProfile().getUsername();
            password = candidate.getUserProfile().getPassword();
        }
        return new CandidateDto(candidate.getId(), candidate.getSurname(), candidate.getName(), username,
                password, candidate.getAge(), cityId, cityName);
    }
}
