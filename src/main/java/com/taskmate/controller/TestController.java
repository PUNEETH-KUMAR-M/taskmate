package com.taskmate.controller;

import com.taskmate.model.Role;
import com.taskmate.model.User;
import com.taskmate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/create-test-user")
    public String createTestUser() {
        try {
            // Create a test admin user
            User testUser = User.builder()
                    .name("Test Admin")
                    .email("test@taskmate.com")
                    .password(passwordEncoder.encode("password123"))
                    .role(Role.ADMIN)
                    .build();

            userRepository.save(testUser);
            return "Test user created successfully! Email: test@taskmate.com, Password: password123";
        } catch (Exception e) {
            return "Error creating test user: " + e.getMessage();
        }
    }

    @GetMapping("/generate-hash")
    public String generateHash() {
        String password = "password123";
        String encodedPassword = passwordEncoder.encode(password);
        return "Password: " + password + "\nEncoded: " + encodedPassword;
    }
} 