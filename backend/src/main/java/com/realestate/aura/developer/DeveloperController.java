package com.realestate.aura.developer;

import com.realestate.aura.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/developers")
@Tag(name = "Admin Developers", description = "Management of master real estate developers")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR', 'PROPERTY_MANAGER')")
public class DeveloperController {

    private final DeveloperService developerService;

    public DeveloperController(DeveloperService developerService) {
        this.developerService = developerService;
    }

    @GetMapping
    @Operation(summary = "Get all developers")
    public ResponseEntity<ApiResponse<List<Developer>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(developerService.getAllDevelopers()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get developer by ID")
    public ResponseEntity<ApiResponse<Developer>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(developerService.getDeveloperById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Create developer")
    public ResponseEntity<ApiResponse<Developer>> create(@RequestBody Developer developer) {
        return ResponseEntity.ok(ApiResponse.ok("Developer created", developerService.createDeveloper(developer)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Update developer")
    public ResponseEntity<ApiResponse<Developer>> update(@PathVariable Long id, @RequestBody Developer developer) {
        return ResponseEntity.ok(ApiResponse.ok("Developer updated", developerService.updateDeveloper(id, developer)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Delete developer")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        developerService.deleteDeveloper(id);
        return ResponseEntity.ok(ApiResponse.ok("Developer deleted", null));
    }
}
