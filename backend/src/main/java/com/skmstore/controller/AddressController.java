package com.skmstore.controller;

import com.skmstore.dto.request.AddressRequest;
import com.skmstore.dto.response.ApiResponse;
import com.skmstore.model.Address;
import com.skmstore.security.JwtUtil;
import com.skmstore.service.AddressService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;
    private final JwtUtil jwtUtil;

    public AddressController(AddressService addressService, JwtUtil jwtUtil) {
        this.addressService = addressService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getMyAddresses(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        List<Address> addresses = addressService.getUserAddresses(userId);
        return ResponseEntity.ok(ApiResponse.success("Addresses retrieved", addresses));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> addAddress(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody AddressRequest request) {
        Long userId = extractUserId(authHeader);
        Address address = addressService.addAddress(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Address added", address));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteAddress(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        Long userId = extractUserId(authHeader);
        addressService.deleteAddress(userId, id);
        return ResponseEntity.ok(ApiResponse.success("Address deleted"));
    }

    private Long extractUserId(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.getUserIdFromToken(token);
    }
}
