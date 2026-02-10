package com.skmstore.dto.response;

public class AuthResponse {

    private String token;
    private String role;
    private Long userId;
    private String name;
    private String phone;

    public AuthResponse() {
    }

    public AuthResponse(String token, String role, Long userId, String name, String phone) {
        this.token = token;
        this.role = role;
        this.userId = userId;
        this.name = name;
        this.phone = phone;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
