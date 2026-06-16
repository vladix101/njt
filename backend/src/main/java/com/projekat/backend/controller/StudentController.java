package com.projekat.backend.controller;

import com.projekat.backend.dto.StudentDto;
import com.projekat.backend.entity.Student;
import com.projekat.backend.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;

    @PostMapping("/student")
    public StudentDto postStudent(@RequestBody StudentDto studentDto){
        return studentService.postStudent(studentDto);
    }

    @GetMapping("/students")
    public List<StudentDto> getStudents(){
        return studentService.getStudents();
    }

    @DeleteMapping("/studentDel/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id){
        studentService.deleteStudent(id);
        return new ResponseEntity<>("Entity je izbrisan", HttpStatus.OK);
    }
}
