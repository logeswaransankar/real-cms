package com.realestate.aura.settings;

import com.realestate.aura.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/settings")
@Tag(name = "Admin Settings", description = "Management of global brand identity, styling, contact details, currency, and SEO tokens")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
public class WebsiteSettingController {

    private final WebsiteSettingService settingService;

    public WebsiteSettingController(WebsiteSettingService settingService) {
        this.settingService = settingService;
    }

    @GetMapping
    @Operation(summary = "List all website settings for admin")
    public ResponseEntity<ApiResponse<List<WebsiteSetting>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(settingService.getAllSettingsForAdmin()));
    }

    @PutMapping
    @Operation(summary = "Batch update website settings as key-value pairs")
    public ResponseEntity<ApiResponse<Void>> updateSettings(@RequestBody Map<String, String> updates) {
        settingService.updateSettings(updates);
        return ResponseEntity.ok(ApiResponse.ok("Settings updated successfully", null));
    }
}
