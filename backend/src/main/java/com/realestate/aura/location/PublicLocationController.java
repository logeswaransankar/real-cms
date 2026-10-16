package com.realestate.aura.location;

import com.realestate.aura.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/locations")
@Tag(name = "Public Locations", description = "Public endpoints for exploring real estate locations and neighborhoods")
public class PublicLocationController {

    private final LocationService locationService;

    public PublicLocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping
    @Operation(summary = "Get all locations or filter by popular flag")
    public ResponseEntity<ApiResponse<List<Location>>> getLocations(@RequestParam(required = false) Boolean popular) {
        if (Boolean.TRUE.equals(popular)) {
            return ResponseEntity.ok(ApiResponse.ok(locationService.getPopularLocations()));
        }
        return ResponseEntity.ok(ApiResponse.ok(locationService.getAllLocations()));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get location profile by slug")
    public ResponseEntity<ApiResponse<Location>> getLocationBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(locationService.getLocationBySlug(slug)));
    }
}
