package com.example.backend.repository;

import com.example.backend.model.CourseEnrollment;
import com.example.backend.model.User;
import com.example.backend.model.LanguageCourse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, Long> {
    List<CourseEnrollment> findByLearner(User learner);
    List<CourseEnrollment> findByCourse(LanguageCourse course);
    long countByCourse(LanguageCourse course);
}
