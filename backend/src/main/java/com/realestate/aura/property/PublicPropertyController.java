package com.realestate.aura.property;

import com.realestate.aura.common.ApiResponse;
import com.realestate.aura.common.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/public/properties")
@Tag(name = "Public Properties", description = "Public endpoints for browsing, filtering, and viewing luxury properties")
public class PublicPropertyController {

    private final PropertyService propertyService;

    public PublicPropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping
    @Operation(summary = "Search and filter properties with pagination")
    public ResponseEntity<ApiResponse<PagedResponse<Property>>> getProperties(
            @RequestParam(required = false) Long locationId,
            @RequestParam(required = false) String transactionType,
            @RequestParam(required = false) String propertyType,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer minBedrooms,
            @RequestParam(required = false) Integer minBathrooms,
            @RequestParam(required = false) String query,
            @RequestParam(required = false, defaultValue = "createdAt") String sortBy,
            @RequestParam(required = false, defaultValue = "DESC") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        PagedResponse<Property> result = propertyService.searchProperties(
                locationId, transactionType, propertyType, status,
                minPrice, maxPrice, minBedrooms, minBathrooms, query,
                sortBy, sortDir, page, size
        );
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured properties for home page showcase")
    public ResponseEntity<ApiResponse<List<Property>>> getFeaturedProperties() {
        return ResponseEntity.ok(ApiResponse.ok(propertyService.getFeaturedProperties()));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get single property by slug with full specs and 3D config")
    public ResponseEntity<ApiResponse<Property>> getPropertyBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(propertyService.getPublishedPropertyBySlug(slug)));
    }

    @GetMapping("/{id}/similar")
    @Operation(summary = "Get similar properties in the same neighborhood")
    public ResponseEntity<ApiResponse<List<Property>>> getSimilarProperties(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(propertyService.getSimilarProperties(id)));
    }

    @GetMapping("/amenities")
    @Operation(summary = "Get list of all standard amenities")
    public ResponseEntity<ApiResponse<List<Amenity>>> getAllAmenities() {
        return ResponseEntity.ok(ApiResponse.ok(propertyService.getAllAmenities()));
    }
}
