package com.taskmate.controller;

import com.taskmate.dto.AuthenticationRequest;
import com.taskmate.dto.AuthenticationResponse;
import com.taskmate.dto.RegisterRequest;
import com.taskmate.model.Role;
import com.taskmate.service.impl.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authService;

    @PostMapping("/register-admin")
    public ResponseEntity<?> registerAdmin(@RequestBody RegisterRequest request) {
        try {
            AuthenticationResponse response = authService.register(request, Role.ADMIN);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/register-user")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        try {
            AuthenticationResponse response = authService.register(request, Role.USER);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody AuthenticationRequest request) {
        return authService.authenticate(request);
    }
}
