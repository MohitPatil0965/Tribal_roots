package com.example.backend.controller;

import com.example.backend.model.Order;
import com.example.backend.model.User;
import com.example.backend.model.Artifact;
import com.example.backend.repository.ArtifactRepository;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/purchase")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class PurchaseController {

    private final OrderRepository orderRepository;
    private final ArtifactRepository artifactRepository;
    private final UserRepository userRepository;

    @PostMapping("/buy/{artifactId}")
    public ResponseEntity<Order> buyArtifact(@PathVariable Long artifactId, Authentication authentication) {
        User buyer = userRepository.findByUsername(authentication.getName()).orElseThrow();
        Artifact artifact = artifactRepository.findById(artifactId).orElseThrow();
        
        Order order = Order.builder()
                .buyer(buyer)
                .artifact(artifact)
                .amount(artifact.getPrice())
                .orderDate(LocalDateTime.now())
                .status("Purchased") // Initial status
                .build();
                
        return ResponseEntity.ok(orderRepository.save(order));
    }

    @GetMapping("/my-orders")
    public List<Order> getMyOrders(Authentication authentication) {
        User buyer = userRepository.findByUsername(authentication.getName()).orElseThrow();
        return orderRepository.findByBuyer(buyer);
    }

    @GetMapping("/artist-sales")
    public List<Order> getArtistSales(Authentication authentication) {
        User artist = userRepository.findByUsername(authentication.getName()).orElseThrow();
        return orderRepository.findByArtifactArtist(artist);
    }
}
