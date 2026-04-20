package com.example.backend.repository;

import com.example.backend.model.TribalInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TribalRepository extends JpaRepository<TribalInfo, Long> {
}
