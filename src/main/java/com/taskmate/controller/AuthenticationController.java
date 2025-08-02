package com.taskmate.controller;

import com.taskmate.dto.AuthenticationRequest;
import com.taskmate.dto.AuthenticationResponse;
import com.taskmate.dto.RegisterRequest;
import com.taskmate.model.Role;
import com.taskmate.service.impl.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authService;

    @PostMapping("/register-admin")
    public AuthenticationResponse registerAdmin(@RequestBody RegisterRequest request) {
        return authService.register(request, Role.ADMIN);
    }

    @PostMapping("/register-user")
    public AuthenticationResponse registerUser(@RequestBody RegisterRequest request) {
        return authService.register(request, Role.USER);
    }

    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody AuthenticationRequest request) {
        return authService.authenticate(request);
    }
}
