package com.example.backend.controller;

import com.example.backend.model.Artifact;
import com.example.backend.model.TribalInfo;
import com.example.backend.model.User;
import com.example.backend.repository.ArtifactRepository;
import com.example.backend.repository.TribalRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/artifacts")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ArtifactController {

    private final ArtifactRepository artifactRepository;
    private final UserRepository userRepository;
    private final TribalRepository tribalRepository;

    @GetMapping("/all")
    public List<Artifact> getAllArtifacts() {
        return artifactRepository.findAll();
    }

    @PostMapping("/add")
    public ResponseEntity<Artifact> addArtifact(@RequestBody Map<String, Object> payload, Authentication authentication) {
        User artist = userRepository.findByUsername(authentication.getName()).orElseThrow();
        
        Long tribeId = Long.parseLong(payload.get("tribeId").toString());
        TribalInfo tribe = tribalRepository.findById(tribeId).orElseThrow();

        Artifact artifact = Artifact.builder()
                .title(payload.get("title").toString())
                .description(payload.get("description").toString())
                .price(Double.parseDouble(payload.get("price").toString()))
                .imageUrl(payload.get("imageUrl").toString())
                .tribe(tribe)
                .artist(artist)
                .build();

        return ResponseEntity.ok(artifactRepository.save(artifact));
    }

    @GetMapping("/my")
    public List<Artifact> getMyArtifacts(Authentication authentication) {
        User artist = userRepository.findByUsername(authentication.getName()).orElseThrow();
        return artifactRepository.findByArtist(artist);
    }
}
