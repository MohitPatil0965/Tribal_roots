package com.example.backend.controller;

import com.example.backend.model.TribalInfo;
import com.example.backend.repository.TribalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tribes")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class TribeController {

    private final TribalRepository tribalRepository;

    @GetMapping("/all")
    public List<TribalInfo> getAllTribes() {
        return tribalRepository.findAll();
    }
}
