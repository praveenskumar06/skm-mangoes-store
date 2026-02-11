package com.skmstore.controller;

import com.skmstore.dto.response.ApiResponse;
import com.skmstore.model.User;
import com.skmstore.security.JwtUtil;
import com.skmstore.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public ProfileController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getProfile(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        User user = userService.getUserById(userId);
        Map<String, Object> profile = Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "phone", user.getPhone(),
                "email", user.getEmail() != null ? user.getEmail() : ""
        );
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved", profile));
    }

    @PutMapping
    public ResponseEntity<ApiResponse> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> updates) {
        Long userId = extractUserId(authHeader);
        userService.updateProfile(userId, updates.get("name"), updates.get("email"));
        return ResponseEntity.ok(ApiResponse.success("Profile updated"));
    }

    private Long extractUserId(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.getUserIdFromToken(token);
    }
}
