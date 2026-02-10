package com.skmstore.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "app_settings", indexes = {
    @Index(name = "idx_setting_key", columnList = "setting_key", unique = true)
})
public class AppSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Column(name = "setting_key", unique = true, nullable = false, length = 100)
    private String settingKey;

    @NotBlank
    @Size(max = 500)
    @Column(name = "setting_value", nullable = false, length = 500)
    private String settingValue;

    public AppSetting() {
    }

    public AppSetting(String settingKey, String settingValue) {
        this.settingKey = settingKey;
        this.settingValue = settingValue;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSettingKey() { return settingKey; }
    public void setSettingKey(String settingKey) { this.settingKey = settingKey; }

    public String getSettingValue() { return settingValue; }
    public void setSettingValue(String settingValue) { this.settingValue = settingValue; }
}
