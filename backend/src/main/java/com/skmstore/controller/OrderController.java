package com.skmstore.controller;

import com.skmstore.dto.request.PlaceOrderRequest;
import com.skmstore.dto.response.ApiResponse;
import com.skmstore.dto.response.OrderResponse;
import com.skmstore.security.JwtUtil;
import com.skmstore.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final JwtUtil jwtUtil;

    public OrderController(OrderService orderService, JwtUtil jwtUtil) {
        this.orderService = orderService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<ApiResponse> placeOrder(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody PlaceOrderRequest request) {
        Long userId = extractUserId(authHeader);
        OrderResponse order = orderService.placeOrder(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Order placed successfully", order));
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getMyOrders(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        List<OrderResponse> orders = orderService.getUserOrders(userId);
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved", orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getOrder(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        OrderResponse order = orderService.getOrder(id);
        return ResponseEntity.ok(ApiResponse.success("Order retrieved", order));
    }

    private Long extractUserId(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.getUserIdFromToken(token);
    }
}
