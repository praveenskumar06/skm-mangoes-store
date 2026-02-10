package com.skmstore.service;

import com.skmstore.model.AppSetting;
import com.skmstore.repository.AppSettingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class SettingsService {

    private final AppSettingRepository appSettingRepository;

    public SettingsService(AppSettingRepository appSettingRepository) {
        this.appSettingRepository = appSettingRepository;
    }

    public String getSetting(String key) {
        return appSettingRepository.findBySettingKey(key)
                .map(AppSetting::getSettingValue)
                .orElse(null);
    }

    public String getSetting(String key, String defaultValue) {
        return appSettingRepository.findBySettingKey(key)
                .map(AppSetting::getSettingValue)
                .orElse(defaultValue);
    }

    @Transactional
    public void setSetting(String key, String value) {
        AppSetting setting = appSettingRepository.findBySettingKey(key)
                .orElse(new AppSetting(key, value));
        setting.setSettingValue(value);
        appSettingRepository.save(setting);
    }

    public boolean isSeasonActive() {
        return "true".equalsIgnoreCase(getSetting("season_active", "false"));
    }

    public Map<String, String> getAllSettings() {
        Map<String, String> settings = new HashMap<>();
        appSettingRepository.findAll().forEach(s ->
                settings.put(s.getSettingKey(), s.getSettingValue()));
        return settings;
    }

    public Map<String, String> getPublicSettings() {
        Map<String, String> publicSettings = new HashMap<>();
        publicSettings.put("season_active", getSetting("season_active", "false"));
        publicSettings.put("season_banner_text", getSetting("season_banner_text", "Mango Season coming soon! 🥭"));
        publicSettings.put("delivery_zones", getSetting("delivery_zones", "Tamil Nadu,Pondicherry,Karnataka"));
        return publicSettings;
    }

    @Transactional
    public void updateSettings(Map<String, String> settings) {
        settings.forEach(this::setSetting);
    }
}
