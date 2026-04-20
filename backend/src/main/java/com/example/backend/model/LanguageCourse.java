package com.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "language_courses")
public class LanguageCourse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String language; // e.g., "Gondi", "Bhili", "Santhali"

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private String imageUrl;

    @Column(nullable = false)
    private Integer durationWeeks;

    @Column(nullable = false)
    private String level; // Beginner, Intermediate, Advanced

    @ManyToOne
    @JoinColumn(name = "tutor_id", nullable = false)
    private User tutor;
}
