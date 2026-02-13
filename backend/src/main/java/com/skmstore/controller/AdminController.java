package com.skmstore.controller;

import com.skmstore.dto.request.ProductRequest;
import com.skmstore.dto.response.ApiResponse;
import com.skmstore.dto.response.DashboardResponse;
import com.skmstore.dto.response.OrderResponse;
import com.skmstore.dto.response.ProductResponse;
import com.skmstore.model.OrderStatus;
import com.skmstore.model.User;
import com.skmstore.service.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ProductService productService;
    private final OrderService orderService;
    private final UserService userService;
    private final SettingsService settingsService;
    private final DashboardService dashboardService;

    public AdminController(ProductService productService,
                           OrderService orderService,
                           UserService userService,
                           SettingsService settingsService,
                           DashboardService dashboardService) {
        this.productService = productService;
        this.orderService = orderService;
        this.userService = userService;
        this.settingsService = settingsService;
        this.dashboardService = dashboardService;
    }

    // ==================== DASHBOARD ====================

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse> getDashboard() {
        DashboardResponse dashboard = dashboardService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard data", dashboard));
    }

    @GetMapping("/dashboard/range")
    public ResponseEntity<ApiResponse> getDashboardByRange(
            @RequestParam("from") String from,
            @RequestParam("to") String to) {
        java.time.LocalDate fromDate = java.time.LocalDate.parse(from);
        java.time.LocalDate toDate = java.time.LocalDate.parse(to);
        DashboardResponse dashboard = dashboardService.getStatsByDateRange(fromDate, toDate);
        return ResponseEntity.ok(ApiResponse.success("Dashboard data for range", dashboard));
    }

    // ==================== PRODUCTS ====================

    @GetMapping("/products")
    public ResponseEntity<ApiResponse> getAllProducts() {
        List<ProductResponse> products = productService.getAllProducts();
        return ResponseEntity.ok(ApiResponse.success("All products", products));
    }

    @PostMapping("/products")
    public ResponseEntity<ApiResponse> addProduct(@Valid @RequestBody ProductRequest request) {
        ProductResponse product = productService.createProduct(request);
        return ResponseEntity.ok(ApiResponse.success("Product created", product));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ApiResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        ProductResponse product = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.success("Product updated", product));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deactivated"));
    }

    @PutMapping("/products/{id}/toggle-active")
    public ResponseEntity<ApiResponse> toggleProductActive(@PathVariable Long id) {
        ProductResponse product = productService.toggleActive(id);
        return ResponseEntity.ok(ApiResponse.success(
                product.isActive() ? "Product activated" : "Product deactivated", product));
    }

    @PutMapping("/products/{id}/toggle-special")
    public ResponseEntity<ApiResponse> toggleProductSpecial(@PathVariable Long id) {
        ProductResponse product = productService.toggleSpecial(id);
        return ResponseEntity.ok(ApiResponse.success(
                product.isSpecial() ? "Product marked as special" : "Product unmarked as special", product));
    }

    // ==================== ORDERS ====================

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse> getAllOrders(
            @RequestParam(required = false) String status) {
        List<OrderResponse> orders;
        if (status != null && !status.isBlank()) {
            orders = orderService.getOrdersByStatus(OrderStatus.valueOf(status.toUpperCase()));
        } else {
            orders = orderService.getAllOrders();
        }
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved", orders));
    }

    @GetMapping("/orders/today")
    public ResponseEntity<ApiResponse> getTodaysOrders(
            @RequestParam(required = false) String status) {
        List<OrderResponse> orders;
        if (status != null && !status.isBlank()) {
            orders = orderService.getTodaysOrdersByStatus(OrderStatus.valueOf(status.toUpperCase()));
        } else {
            orders = orderService.getTodaysOrders();
        }
        return ResponseEntity.ok(ApiResponse.success("Today's orders", orders));
    }

    @GetMapping("/orders/by-date")
    public ResponseEntity<ApiResponse> getOrdersByDate(@RequestParam String date) {
        List<OrderResponse> orders = orderService.getOrdersByDate(date);
        return ResponseEntity.ok(ApiResponse.success("Orders for " + date, orders));
    }

    @GetMapping("/orders/by-date/export")
    public ResponseEntity<String> exportOrdersByDate(@RequestParam String date) {
        return exportOrdersCsv(orderService.getOrdersByDate(date), "orders-" + date + ".csv");
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<ApiResponse> getOrderDetail(@PathVariable Long id) {
        OrderResponse order = orderService.getOrder(id);
        return ResponseEntity.ok(ApiResponse.success("Order detail", order));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        OrderStatus status = OrderStatus.valueOf(body.get("status").toUpperCase());
        OrderResponse order = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Order status updated", order));
    }

    @PutMapping("/orders/{id}/courier")
    public ResponseEntity<ApiResponse> updateCourierInfo(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        OrderResponse order = orderService.updateCourierInfo(
                id, body.get("courierName"), body.get("trackingId"));
        return ResponseEntity.ok(ApiResponse.success("Courier info updated", order));
    }

    @GetMapping("/orders/today/export")
    public ResponseEntity<String> exportTodaysOrders() {
        return exportOrdersCsv(orderService.getTodaysOrders(), "orders-today.csv");
    }

    @GetMapping("/orders/export")
    public ResponseEntity<String> exportAllOrders() {
        return exportOrdersCsv(orderService.getAllOrders(), "orders-all.csv");
    }

    private ResponseEntity<String> exportOrdersCsv(List<OrderResponse> orders, String filename) {
        StringBuilder csv = new StringBuilder();
        csv.append("Order ID,Date,Customer,Phone,Full Address,City,State,Pincode,Items,Total,Status,Courier,Tracking\n");

        for (OrderResponse order : orders) {
            String items = order.getItems().stream()
                    .map(i -> i.getProductName() + " " + i.getQuantityKg() + "kg")
                    .collect(Collectors.joining(" | "));

            OrderResponse.AddressInfo addr = order.getAddress();
            String fullAddress = String.join(", ",
                    addr.getFullName() != null ? addr.getFullName() : "",
                    addr.getAddressLine() != null ? addr.getAddressLine() : "",
                    addr.getCity() != null ? addr.getCity() : "",
                    addr.getState() != null ? addr.getState() : "",
                    addr.getPincode() != null ? addr.getPincode() : "");

            csv.append(String.format("%d,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%.2f,%s,\"%s\",\"%s\"\n",
                    order.getId(),
                    order.getOrderDate() != null ? order.getOrderDate().toString() : "",
                    order.getCustomer().getName(),
                    order.getCustomer().getPhone(),
                    fullAddress,
                    addr.getCity() != null ? addr.getCity() : "",
                    addr.getState() != null ? addr.getState() : "",
                    addr.getPincode() != null ? addr.getPincode() : "",
                    items,
                    order.getTotalAmount(),
                    order.getStatus(),
                    order.getCourierName() != null ? order.getCourierName() : "",
                    order.getTrackingId() != null ? order.getTrackingId() : ""));
        }

        return ResponseEntity.ok()
                .header("Content-Type", "text/csv")
                .header("Content-Disposition", "attachment; filename=" + filename)
                .body(csv.toString());
    }

    // ==================== USERS ====================

    @GetMapping("/users")
    public ResponseEntity<ApiResponse> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<Map<String, Object>> userList = users.stream().map(u -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", u.getId());
            map.put("name", u.getName());
            map.put("phone", u.getPhone() != null ? u.getPhone() : "");
            map.put("email", u.getEmail() != null ? u.getEmail() : "");
            map.put("role", u.getRole().name());
            map.put("active", u.getActive());
            map.put("createdAt", u.getCreatedAt().toString());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", userList));
    }

    @PutMapping("/users/{id}/promote")
    public ResponseEntity<ApiResponse> promoteUser(@PathVariable Long id) {
        userService.promoteToAdmin(id);
        return ResponseEntity.ok(ApiResponse.success("User promoted to admin"));
    }

    @PutMapping("/users/{id}/deactivate")
    public ResponseEntity<ApiResponse> deactivateUser(@PathVariable Long id) {
        userService.deactivateUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deactivated"));
    }

    @PutMapping("/users/{id}/activate")
    public ResponseEntity<ApiResponse> activateUser(@PathVariable Long id) {
        userService.activateUser(id);
        return ResponseEntity.ok(ApiResponse.success("User activated"));
    }

    // ==================== SETTINGS ====================

    @GetMapping("/settings")
    public ResponseEntity<ApiResponse> getSettings() {
        return ResponseEntity.ok(ApiResponse.success("Settings", settingsService.getAllSettings()));
    }

    @PutMapping("/settings")
    public ResponseEntity<ApiResponse> updateSettings(@RequestBody Map<String, String> settings) {
        settingsService.updateSettings(settings);
        return ResponseEntity.ok(ApiResponse.success("Settings updated"));
    }
}
