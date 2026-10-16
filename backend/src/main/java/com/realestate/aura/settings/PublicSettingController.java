package com.realestate.aura.settings;

import com.realestate.aura.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/public/settings")
@Tag(name = "Public Settings", description = "Public endpoint to retrieve global branding, contact details, currency, and SEO tokens")
public class PublicSettingController {

    private final WebsiteSettingService settingService;

    public PublicSettingController(WebsiteSettingService settingService) {
        this.settingService = settingService;
    }

    @GetMapping
    @Operation(summary = "Get all public website configuration settings as key-value map")
    public ResponseEntity<ApiResponse<Map<String, String>>> getPublicSettings() {
        return ResponseEntity.ok(ApiResponse.ok(settingService.getAllPublicSettings()));
    }
}
