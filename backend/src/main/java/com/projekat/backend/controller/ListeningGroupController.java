package com.projekat.backend.controller;

import com.projekat.backend.dto.CandidateWithGroupsDto;
import com.projekat.backend.dto.ListeningGroupDto;
import com.projekat.backend.dto.ListeningGroupRequestDto;
import com.projekat.backend.service.ListeningGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ListeningGroupController {

    private final ListeningGroupService listeningGroupService;

    @GetMapping("/listening-groups")
    public List<ListeningGroupDto> getListeningGroups() {
        return listeningGroupService.getListeningGroups();
    }

    @GetMapping("/listening-groups/{id}")
    public ListeningGroupDto getListeningGroup(@PathVariable Long id) {
        return listeningGroupService.getListeningGroup(id);
    }

    @PostMapping("/listening-groups")
    @ResponseStatus(HttpStatus.CREATED)
    public ListeningGroupDto createListeningGroup(@RequestBody ListeningGroupRequestDto requestDto) {
        return listeningGroupService.createListeningGroup(requestDto);
    }

    @PutMapping("/listening-groups/{id}")
    public ListeningGroupDto updateListeningGroup(@PathVariable Long id, @RequestBody ListeningGroupRequestDto requestDto) {
        return listeningGroupService.updateListeningGroup(id, requestDto);
    }

    @DeleteMapping("/listening-groups/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteListeningGroup(@PathVariable Long id) {
        listeningGroupService.deleteListeningGroup(id);
    }

    @GetMapping("/candidates/{candidateId}/listening-groups")
    public List<ListeningGroupDto> getListeningGroupsForCandidate(@PathVariable Long candidateId) {
        return listeningGroupService.getListeningGroupsForCandidate(candidateId);
    }

    @GetMapping("/candidates/with-listening-groups")
    public List<CandidateWithGroupsDto> getCandidatesWithListeningGroups() {
        return listeningGroupService.getCandidatesWithListeningGroups();
    }
}
