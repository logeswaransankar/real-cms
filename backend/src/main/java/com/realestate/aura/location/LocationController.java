package com.realestate.aura.location;

import com.realestate.aura.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/locations")
@Tag(name = "Admin Locations", description = "Management of real estate destinations and communities")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR', 'PROPERTY_MANAGER')")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping
    @Operation(summary = "List all locations for admin")
    public ResponseEntity<ApiResponse<List<Location>>> getAllLocations() {
        return ResponseEntity.ok(ApiResponse.ok(locationService.getAllLocations()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get location by id")
    public ResponseEntity<ApiResponse<Location>> getLocationById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(locationService.getLocationById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR')")
    @Operation(summary = "Create a new destination location")
    public ResponseEntity<ApiResponse<Location>> createLocation(@RequestBody Location location) {
        return ResponseEntity.ok(ApiResponse.ok("Location created", locationService.createLocation(location)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR')")
    @Operation(summary = "Update location")
    public ResponseEntity<ApiResponse<Location>> updateLocation(@PathVariable Long id, @RequestBody Location location) {
        return ResponseEntity.ok(ApiResponse.ok("Location updated", locationService.updateLocation(id, location)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Delete location")
    public ResponseEntity<ApiResponse<Void>> deleteLocation(@PathVariable Long id) {
        locationService.deleteLocation(id);
        return ResponseEntity.ok(ApiResponse.ok("Location deleted", null));
    }
}
