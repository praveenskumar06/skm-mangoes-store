package com.skmstore.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.skmstore.dto.request.GoogleAuthRequest;
import com.skmstore.dto.request.LoginRequest;
import com.skmstore.dto.request.RegisterRequest;
import com.skmstore.dto.response.AuthResponse;
import com.skmstore.exception.BusinessException;
import com.skmstore.model.Role;
import com.skmstore.model.User;
import com.skmstore.repository.UserRepository;
import com.skmstore.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final GoogleIdTokenVerifier googleVerifier;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       AuthenticationManager authenticationManager,
                       @Value("${app.google.client-id}") String googleClientId) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.googleVerifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(), GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(googleClientId))
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new BusinessException("Phone number already registered");
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()
                && userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ROLE_USER);

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getPhone(), user.getRole().name(), user.getId());

        return new AuthResponse(token, user.getRole().name(), user.getId(), user.getName(), user.getPhone());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getPhone(), request.getPassword())
        );

        User user = userRepository.findByPhone(request.getPhone())
                .orElseThrow(() -> new BusinessException("User not found"));

        if (!user.getActive()) {
            throw new BusinessException("Account is deactivated");
        }

        String token = jwtUtil.generateToken(user.getPhone(), user.getRole().name(), user.getId());

        return new AuthResponse(token, user.getRole().name(), user.getId(), user.getName(), user.getPhone());
    }

    @Transactional
    public AuthResponse googleLogin(GoogleAuthRequest request) {
        GoogleIdToken idToken;
        try {
            idToken = googleVerifier.verify(request.getCredential());
        } catch (Exception e) {
            throw new BusinessException("Failed to verify Google token");
        }

        if (idToken == null) {
            throw new BusinessException("Invalid Google token");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        String googleId = payload.getSubject();
        String email = payload.getEmail();
        String name = (String) payload.get("name");

        // Try to find existing user by Google ID or email
        User user = userRepository.findByGoogleId(googleId).orElse(null);

        if (user == null && email != null) {
            user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                // Link Google ID to existing account
                user.setGoogleId(googleId);
                user = userRepository.save(user);
            }
        }

        if (user == null) {
            // Create new user from Google profile
            user = new User();
            user.setName(name != null ? name : "Google User");
            user.setEmail(email);
            user.setGoogleId(googleId);
            user.setRole(Role.ROLE_USER);
            user = userRepository.save(user);
        }

        if (!user.getActive()) {
            throw new BusinessException("Account is deactivated");
        }

        String subject = user.getPhone() != null ? user.getPhone() : user.getEmail();
        String token = jwtUtil.generateToken(subject, user.getRole().name(), user.getId());

        return new AuthResponse(token, user.getRole().name(), user.getId(), user.getName(), user.getPhone());
    }
}
