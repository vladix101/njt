package com.projekat.backend.controller;

import com.projekat.backend.dto.CandidateDto;
import com.projekat.backend.service.CandidateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CandidateController {

    private final CandidateService candidateService;

    @PostMapping("/candidate")
    public CandidateDto postCandidate(@RequestBody CandidateDto candidateDto){
        return candidateService.postCandidate(candidateDto);
    }

    @GetMapping("/candidates")
    public List<CandidateDto> getCandidates(){
        return candidateService.getCandidates();
    }

    @DeleteMapping("/candidateDel/{id}")
    public ResponseEntity<?> deleteCandidate(@PathVariable Long id){
        candidateService.deleteCandidate(id);
        return new ResponseEntity<>("Entity je izbrisan", HttpStatus.OK);
    }
}
