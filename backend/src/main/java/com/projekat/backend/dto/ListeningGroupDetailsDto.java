package com.projekat.backend.dto;

import java.util.List;

public class ListeningGroupDetailsDto {
    private ListeningGroupDto listeningGroup;
    private List<CandidateSummaryDto> candidates;
    private long totalCandidates;

    public ListeningGroupDetailsDto() {
    }

    public ListeningGroupDetailsDto(ListeningGroupDto listeningGroup, List<CandidateSummaryDto> candidates, long totalCandidates) {
        this.listeningGroup = listeningGroup;
        this.candidates = candidates;
        this.totalCandidates = totalCandidates;
    }

    public ListeningGroupDto getListeningGroup() {
        return listeningGroup;
    }

    public void setListeningGroup(ListeningGroupDto listeningGroup) {
        this.listeningGroup = listeningGroup;
    }

    public List<CandidateSummaryDto> getCandidates() {
        return candidates;
    }

    public void setCandidates(List<CandidateSummaryDto> candidates) {
        this.candidates = candidates;
    }

    public long getTotalCandidates() {
        return totalCandidates;
    }

    public void setTotalCandidates(long totalCandidates) {
        this.totalCandidates = totalCandidates;
    }
}
