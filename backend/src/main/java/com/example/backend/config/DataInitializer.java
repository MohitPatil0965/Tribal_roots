package com.example.backend.config;

import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.TribalRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TribalRepository tribalRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Diagnostic: Try to create a default tribe to ensure the table exists
        if (tribalRepository.count() == 0) {
            try {
                tribalRepository.save(com.example.backend.model.TribalInfo.builder()
                        .tribeName("Warli")
                        .history("Ancient storytelling through geometric forms.")
                        .region("Maharashtra")
                        .mainArtForm("Painting")
                        .build());
                System.out.println("DIAGNOSTIC: TribalInfo table initialized successfully.");
            } catch (Exception e) {
                System.err.println("DIAGNOSTIC ERROR: Failed to create TribalInfo table. " + e.getMessage());
            }
        }

        if (userRepository.findByUsername("admin").isEmpty()) {
            userRepository.save(User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build());
        }
        if (userRepository.findByUsername("artist").isEmpty()) {
            userRepository.save(User.builder()
                    .username("artist")
                    .password(passwordEncoder.encode("artist123"))
                    .role(Role.ARTIST)
                    .build());
        }
        if (userRepository.findByUsername("user").isEmpty()) {
            userRepository.save(User.builder()
                    .username("user")
                    .password(passwordEncoder.encode("user123"))
                    .role(Role.USER)
                    .build());
        }
    }
}
