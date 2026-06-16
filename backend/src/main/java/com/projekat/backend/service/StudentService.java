package com.projekat.backend.service;

import com.projekat.backend.dto.StudentDto;
import com.projekat.backend.entity.City;
import com.projekat.backend.entity.Student;
import com.projekat.backend.repository.CityRepository;
import com.projekat.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final CityRepository cityRepository;

    public StudentDto postStudent(StudentDto studentDto){
        City city = cityRepository.getReferenceById(studentDto.getCity_id());
        Student student = new Student(studentDto.getIdStudent(),studentDto.getUsername(), studentDto.getPassword(),
                studentDto.getName(),studentDto.getSurname(),city);
        Student s = studentRepository.save(student);
        return new StudentDto(s.getId(),s.getName(),s.getSurname(),s.getUsername(),s.getPassword(),s.getCity().getId(),s.getCity().getName());
    }

    public List<StudentDto> getStudents() {
        List<StudentDto> studentsDto = new ArrayList<>();
        List<Student> students = studentRepository.findAll();
        for (Student s : students){
            studentsDto.add(new StudentDto(s.getId(),s.getSurname(),s.getName(),s.getUsername(),s.getPassword(),s.getCity().getId(),s.getCity().getName()));
        }
        return studentsDto;
    }

    public void deleteStudent(Long id){
        studentRepository.deleteById(id);
    }
}
