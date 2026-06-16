package com.projekat.backend.service;

import com.projekat.backend.entity.City;
import com.projekat.backend.repository.CityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CityService {

    private final CityRepository cityRepository;

    public List<City> getCities(){
        return cityRepository.findAll();
    }
}
