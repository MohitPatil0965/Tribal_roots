package com.example.backend.controller;

import com.example.backend.model.CourseEnrollment;
import com.example.backend.model.LanguageCourse;
import com.example.backend.model.User;
import com.example.backend.repository.CourseEnrollmentRepository;
import com.example.backend.repository.CourseRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"})
public class CourseController {

    private final CourseRepository courseRepository;
    private final CourseEnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username).orElseThrow();
    }

    @GetMapping("/all")
    public List<LanguageCourse> getAllCourses() {
        return courseRepository.findAll();
    }

    @PostMapping("/enroll/{courseId}")
    public ResponseEntity<CourseEnrollment> enroll(@PathVariable Long courseId) {
        User learner = getCurrentUser();
        LanguageCourse course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        CourseEnrollment enrollment = CourseEnrollment.builder()
                .learner(learner)
                .course(course)
                .enrollmentDate(LocalDateTime.now())
                .amount(course.getPrice())
                .status("Enrolled")
                .build();

        return ResponseEntity.ok(enrollmentRepository.save(enrollment));
    }

    @GetMapping("/my-enrollments")
    public List<CourseEnrollment> getMyEnrollments() {
        return enrollmentRepository.findByLearner(getCurrentUser());
    }
}
