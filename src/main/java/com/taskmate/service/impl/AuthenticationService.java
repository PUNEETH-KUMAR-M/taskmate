package com.taskmate.service.impl;

import com.taskmate.dto.AuthenticationRequest;
import com.taskmate.dto.AuthenticationResponse;
import com.taskmate.dto.RegisterRequest;
import com.taskmate.model.Role;
import com.taskmate.model.Token;
import com.taskmate.model.User;
import com.taskmate.repository.TokenRepository;
import com.taskmate.repository.UserRepository;
import com.taskmate.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    
    // Clear all old tokens on startup
    @PostConstruct
    public void clearAllTokens() {
        System.out.println("🧹 Clearing all old tokens...");
        List<Token> allTokens = tokenRepository.findAll();
        for (Token token : allTokens) {
            token.setExpired(true);
            token.setRevoked(true);
        }
        tokenRepository.saveAll(allTokens);
        System.out.println("✅ Cleared " + allTokens.size() + " old tokens");
    }

    public AuthenticationResponse register(RegisterRequest request, Role role) {
        System.out.println("🔐 Registering user: " + request.getEmail() + " with role: " + role);
        
        // Check if user already exists
        Optional<User> existing = userRepository.findByEmail(request.getEmail());
        if (existing.isPresent()) {
            System.out.println("❌ User already exists: " + request.getEmail());
            throw new IllegalArgumentException("User already exists with this email");
        }

        // If trying to register as ADMIN, check if admin already exists
        if (role == Role.ADMIN) {
            long adminCount = userRepository.countByRole(Role.ADMIN);
            System.out.println("👑 Current admin count: " + adminCount);
            if (adminCount > 0) {
                System.out.println("❌ Admin already exists, registration denied");
                throw new IllegalArgumentException("Admin already exists. Only one admin is allowed.");
            }
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        User savedUser = userRepository.save(user);
        System.out.println("✅ User registered successfully: " + savedUser.getEmail() + " (ID: " + savedUser.getId() + ")");

        String jwtToken = jwtService.generateToken(user.getEmail());
        saveUserToken(user, jwtToken);

        return new AuthenticationResponse(jwtToken);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        System.out.println("🔐 Attempting authentication for: " + request.getEmail());
        
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            
            System.out.println("✅ Authentication successful for: " + request.getEmail());

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            revokeAllUserTokens(user);

            String jwtToken = jwtService.generateToken(user.getEmail());
            saveUserToken(user, jwtToken);

            return new AuthenticationResponse(jwtToken);
        } catch (Exception e) {
            System.out.println("❌ Authentication failed: " + e.getMessage());
            throw e;
        }
    }

    private void saveUserToken(User user, String jwtToken) {
        Token token = Token.builder()
                .user(user)
                .token(jwtToken)
                .expired(false)
                .revoked(false)
                .build();
        Token savedToken = tokenRepository.save(token);
        System.out.println("💾 Saved token: " + savedToken.getToken() + " for user: " + user.getEmail());
    }

    private void revokeAllUserTokens(User user) {
        List<Token> validTokens = tokenRepository.findAllByUser(user);
        for (Token t : validTokens) {
            t.setExpired(true);
            t.setRevoked(true);
        }
        tokenRepository.saveAll(validTokens);
    }
}
