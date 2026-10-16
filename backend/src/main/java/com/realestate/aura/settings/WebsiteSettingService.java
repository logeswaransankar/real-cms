package com.realestate.aura.settings;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class WebsiteSettingService {

    private final WebsiteSettingRepository settingRepository;

    public WebsiteSettingService(WebsiteSettingRepository settingRepository) {
        this.settingRepository = settingRepository;
    }

    public Map<String, String> getAllPublicSettings() {
        List<WebsiteSetting> settings = settingRepository.findAll();
        Map<String, String> map = new HashMap<>();
        for (WebsiteSetting s : settings) {
            map.put(s.getKey(), s.getValue());
        }
        return map;
    }

    public List<WebsiteSetting> getAllSettingsForAdmin() {
        return settingRepository.findAll();
    }

    @Transactional
    public void updateSettings(Map<String, String> updates) {
        for (Map.Entry<String, String> entry : updates.entrySet()) {
            WebsiteSetting setting = settingRepository.findByKey(entry.getKey())
                    .orElseGet(() -> {
                        WebsiteSetting s = new WebsiteSetting();
                        s.setKey(entry.getKey());
                        s.setGroup("GENERAL");
                        return s;
                    });
            setting.setValue(entry.getValue());
            settingRepository.save(setting);
        }
    }
}
