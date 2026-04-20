package com.example.backend.controller;

import com.example.backend.model.Role;
import com.example.backend.model.TribalInfo;
import com.example.backend.model.User;
import com.example.backend.repository.ArtifactRepository;
import com.example.backend.repository.TribalRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"})
public class AdminController {

    private final UserRepository userRepository;
    private final ArtifactRepository artifactRepository;
    private final TribalRepository tribalRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalArtifacts", artifactRepository.count());
        stats.put("totalUsers", userRepository.countByRole(Role.USER));
        stats.put("totalArtists", userRepository.countByRole(Role.ARTIST));
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/tribal-info")
    public ResponseEntity<TribalInfo> addTribalInfo(@RequestBody TribalInfo info) {
        return ResponseEntity.ok(tribalRepository.save(info));
    }

    @DeleteMapping("/tribes/{id}")
    public ResponseEntity<Void> deleteTribe(@PathVariable Long id) {
        tribalRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/tribes/{id}")
    public ResponseEntity<TribalInfo> updateTribe(@PathVariable Long id, @RequestBody TribalInfo updatedInfo) {
        return tribalRepository.findById(id)
                .map(tribe -> {
                    tribe.setTribeName(updatedInfo.getTribeName());
                    tribe.setRegion(updatedInfo.getRegion());
                    tribe.setHistory(updatedInfo.getHistory());
                    return ResponseEntity.ok(tribalRepository.save(tribe));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
