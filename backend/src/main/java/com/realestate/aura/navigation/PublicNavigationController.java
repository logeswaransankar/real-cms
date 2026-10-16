package com.realestate.aura.navigation;

import com.realestate.aura.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/navigation")
@Tag(name = "Public Navigation", description = "Public endpoints for dynamic header and footer menus")
public class PublicNavigationController {

    private final NavigationService navigationService;

    public PublicNavigationController(NavigationService navigationService) {
        this.navigationService = navigationService;
    }

    @GetMapping
    @Operation(summary = "Get active navigation items by location (HEADER, FOOTER)")
    public ResponseEntity<ApiResponse<List<NavigationItem>>> getNavigation(@RequestParam(defaultValue = "HEADER") String location) {
        return ResponseEntity.ok(ApiResponse.ok(navigationService.getPublicNavigation(location)));
    }
}
