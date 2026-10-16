package com.realestate.aura.property;

import com.realestate.aura.common.ApiResponse;
import com.realestate.aura.property.dto.PropertyRequestDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/properties")
@Tag(name = "Admin Properties", description = "Complete administrative CRUD for properties, pricing, 3D configs, and media")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR', 'PROPERTY_MANAGER')")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping
    @Operation(summary = "List all properties for administration (includes drafts & archived)")
    public ResponseEntity<ApiResponse<List<Property>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(propertyService.getAllPropertiesForAdmin()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get property by ID for editing")
    public ResponseEntity<ApiResponse<Property>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(propertyService.getPropertyById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PROPERTY_MANAGER')")
    @Operation(summary = "Create a new property listing")
    public ResponseEntity<ApiResponse<Property>> create(@RequestBody PropertyRequestDto dto) {
        Property created = propertyService.createProperty(dto);
        return ResponseEntity.ok(ApiResponse.ok("Property created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PROPERTY_MANAGER')")
    @Operation(summary = "Update an existing property listing")
    public ResponseEntity<ApiResponse<Property>> update(@PathVariable Long id, @RequestBody PropertyRequestDto dto) {
        Property updated = propertyService.updateProperty(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Property updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Delete property listing")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.ok(ApiResponse.ok("Property deleted successfully", null));
    }
}
