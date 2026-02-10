package com.skmstore.service;

import com.skmstore.dto.request.LoginRequest;
import com.skmstore.dto.request.RegisterRequest;
import com.skmstore.dto.response.AuthResponse;
import com.skmstore.exception.BusinessException;
import com.skmstore.model.Role;
import com.skmstore.model.User;
import com.skmstore.repository.UserRepository;
import com.skmstore.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
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
}
