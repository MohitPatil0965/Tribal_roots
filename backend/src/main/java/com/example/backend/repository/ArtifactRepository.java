package com.example.backend.repository;

import com.example.backend.model.Artifact;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArtifactRepository extends JpaRepository<Artifact, Long> {
    List<Artifact> findByArtist(User artist);
}
