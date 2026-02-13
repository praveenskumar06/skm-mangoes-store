package com.skmstore.controller;

import com.skmstore.dto.request.GoogleAuthRequest;
import com.skmstore.dto.request.LoginRequest;
import com.skmstore.dto.request.RegisterRequest;
import com.skmstore.dto.response.ApiResponse;
import com.skmstore.dto.response.AuthResponse;
import com.skmstore.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse authResponse = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success("Registration successful", authResponse));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse> googleLogin(@Valid @RequestBody GoogleAuthRequest request) {
        AuthResponse authResponse = authService.googleLogin(request);
        return ResponseEntity.ok(ApiResponse.success("Google login successful", authResponse));
    }
}
