package com.skmstore.controller;

import com.skmstore.dto.response.ApiResponse;
import com.skmstore.service.SettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final SettingsService settingsService;

    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping("/public")
    public ResponseEntity<ApiResponse> getPublicSettings() {
        Map<String, String> settings = settingsService.getPublicSettings();
        return ResponseEntity.ok(ApiResponse.success("Settings retrieved", settings));
    }
}
