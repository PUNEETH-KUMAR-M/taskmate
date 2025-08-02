package com.taskmate.security;

import com.taskmate.repository.TokenRepository;
import com.taskmate.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // Skip JWT processing for auth endpoints
        if (request.getRequestURI().startsWith("/api/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7); // remove "Bearer "
        userEmail = jwtService.extractUsername(jwt);

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            var user = userRepository.findByEmail(userEmail)
                    .orElse(null);

            if (user != null) {
                System.out.println("🔍 Found user: " + user.getEmail() + " with role: " + user.getRole());
                
                var isTokenValid = tokenRepository.findAllByUser(user).stream()
                        .anyMatch(token -> !token.isExpired() && !token.isRevoked() && token.getToken().equals(jwt));

                System.out.println("🔐 Token valid: " + isTokenValid);
                System.out.println("🔐 JWT valid: " + jwtService.isTokenValid(jwt, user));

                if (jwtService.isTokenValid(jwt, user)) {
                    var authToken = new UsernamePasswordAuthenticationToken(
                            user,
                            null,
                            user.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    
                    System.out.println("✅ Authentication set for user: " + user.getEmail());
                    System.out.println("🔑 Authorities: " + user.getAuthorities());
                    System.out.println("🔑 Role: " + user.getRole());
                    System.out.println("🔑 Role Authority: " + user.getRole().getAuthority());
                } else {
                    System.out.println("❌ JWT validation failed");
                }
            } else {
                System.out.println("❌ User not found: " + userEmail);
            }
        } else {
            System.out.println("🔍 No userEmail or already authenticated");
        }

        filterChain.doFilter(request, response);
    }
}
