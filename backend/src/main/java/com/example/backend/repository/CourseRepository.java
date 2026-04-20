package com.example.backend.repository;

import com.example.backend.model.LanguageCourse;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository extends JpaRepository<LanguageCourse, Long> {
    List<LanguageCourse> findByTutor(User tutor);
}
