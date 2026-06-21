package com.projekat.backend.service;

import com.projekat.backend.dto.CityDto;
import com.projekat.backend.repository.CityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CityService {

    private final CityRepository cityRepository;

    public List<CityDto> getCities(){
        return cityRepository.findAll()
                .stream()
                .map(city -> new CityDto(city.getName(), city.getId()))
                .toList();
    }
}
