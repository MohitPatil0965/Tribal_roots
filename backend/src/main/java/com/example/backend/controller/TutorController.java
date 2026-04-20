package com.example.backend.controller;

import com.example.backend.model.LanguageCourse;
import com.example.backend.model.User;
import com.example.backend.repository.CourseEnrollmentRepository;
import com.example.backend.repository.CourseRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tutor")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"})
public class TutorController {

    private final CourseRepository courseRepository;
    private final CourseEnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username).orElseThrow();
    }

    @PostMapping("/courses/add")
    public ResponseEntity<LanguageCourse> addCourse(@RequestBody LanguageCourse course) {
        course.setTutor(getCurrentUser());
        return ResponseEntity.ok(courseRepository.save(course));
    }

    @GetMapping("/courses/my")
    public List<LanguageCourse> getMyCourses() {
        return courseRepository.findByTutor(getCurrentUser());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        User tutor = getCurrentUser();
        List<LanguageCourse> myCourses = courseRepository.findByTutor(tutor);
        long totalEnrollments = myCourses.stream()
                .mapToLong(enrollmentRepository::countByCourse)
                .sum();
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCourses", myCourses.size());
        stats.put("totalEnrollments", totalEnrollments);
        return ResponseEntity.ok(stats);
    }
}
