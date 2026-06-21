package com.projekat.backend.service;

import com.projekat.backend.dto.CandidateWithGroupsDto;
import com.projekat.backend.dto.ListeningGroupDto;
import com.projekat.backend.dto.ListeningGroupRequestDto;
import com.projekat.backend.entity.Candidate;
import com.projekat.backend.entity.Course;
import com.projekat.backend.entity.Instructor;
import com.projekat.backend.entity.LC;
import com.projekat.backend.entity.ListeningGroup;
import com.projekat.backend.repository.CandidateRepository;
import com.projekat.backend.repository.CourseRepository;
import com.projekat.backend.repository.InstructorRepository;
import com.projekat.backend.repository.LCRepository;
import com.projekat.backend.repository.ListeningGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListeningGroupService {

    private final ListeningGroupRepository listeningGroupRepository;
    private final CandidateRepository candidateRepository;
    private final CourseRepository courseRepository;
    private final InstructorRepository instructorRepository;
    private final LCRepository lcRepository;

    @Transactional(readOnly = true)
    public List<ListeningGroupDto> getListeningGroups() {
        return listeningGroupRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ListeningGroupDto getListeningGroup(Long id) {
        return toDto(listeningGroupRepository.getReferenceById(id));
    }

    @Transactional
    public ListeningGroupDto createListeningGroup(ListeningGroupRequestDto requestDto) {
        ListeningGroup listeningGroup = new ListeningGroup();
        applyRequest(listeningGroup, requestDto);
        return toDto(listeningGroupRepository.save(listeningGroup));
    }

    @Transactional
    public ListeningGroupDto updateListeningGroup(Long id, ListeningGroupRequestDto requestDto) {
        ListeningGroup listeningGroup = listeningGroupRepository.getReferenceById(id);
        applyRequest(listeningGroup, requestDto);
        return toDto(listeningGroupRepository.save(listeningGroup));
    }

    @Transactional
    public void deleteListeningGroup(Long id) {
        listeningGroupRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<ListeningGroupDto> getListeningGroupsForCandidate(Long candidateId) {
        return listeningGroupRepository.findByLcsCandidateId(candidateId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public ListeningGroupDto joinListeningGroup(Long candidateId, Long listeningGroupId) {
        Candidate candidate = candidateRepository.getReferenceById(candidateId);
        ListeningGroup listeningGroup = listeningGroupRepository.getReferenceById(listeningGroupId);

        lcRepository.findByCandidateIdAndListeningGroupId(candidateId, listeningGroupId)
                .orElseGet(() -> lcRepository.save(new LC(null, listeningGroup, candidate)));

        return toDto(listeningGroup);
    }

    @Transactional(readOnly = true)
    public List<CandidateWithGroupsDto> getCandidatesWithListeningGroups() {
        return candidateRepository.findAll()
                .stream()
                .map(this::toCandidateWithGroupsDto)
                .toList();
    }

    private void applyRequest(ListeningGroup listeningGroup, ListeningGroupRequestDto requestDto) {
        listeningGroup.setName(requestDto.getName());
        listeningGroup.setStartDate(requestDto.getStartDate());
        listeningGroup.setEndDate(requestDto.getEndDate());

        Course course = requestDto.getCourseId() == null ? null : courseRepository.getReferenceById(requestDto.getCourseId());
        Instructor instructor = requestDto.getInstructorId() == null ? null : instructorRepository.getReferenceById(requestDto.getInstructorId());

        listeningGroup.setCourse(course);
        listeningGroup.setInstructor(instructor);
    }

    private CandidateWithGroupsDto toCandidateWithGroupsDto(Candidate candidate) {
        List<ListeningGroupDto> groups = candidate.getLcs()
                .stream()
                .map(LC::getListeningGroup)
                .map(this::toDto)
                .toList();

        String username = candidate.getUserProfile() == null ? null : candidate.getUserProfile().getUsername();
        String cityName = candidate.getCity() == null ? null : candidate.getCity().getName();

        return new CandidateWithGroupsDto(candidate.getId(), candidate.getName(), candidate.getSurname(),
                username, candidate.getAge(), cityName, groups);
    }

    private ListeningGroupDto toDto(ListeningGroup listeningGroup) {
        Course course = listeningGroup.getCourse();
        Instructor instructor = listeningGroup.getInstructor();
        String instructorName = instructor == null ? null : instructor.getName() + " " + instructor.getSurname();

        return new ListeningGroupDto(
                listeningGroup.getId(),
                listeningGroup.getName(),
                listeningGroup.getStartDate(),
                listeningGroup.getEndDate(),
                course == null ? null : course.getId(),
                course == null ? null : course.getName(),
                instructor == null ? null : instructor.getId(),
                instructorName
        );
    }
}
