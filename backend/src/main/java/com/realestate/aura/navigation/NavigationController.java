package com.realestate.aura.navigation;

import com.realestate.aura.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/navigation")
@Tag(name = "Admin Navigation", description = "Management of header, footer, and submenus")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR')")
public class NavigationController {

    private final NavigationService navigationService;

    public NavigationController(NavigationService navigationService) {
        this.navigationService = navigationService;
    }

    @GetMapping
    @Operation(summary = "List all navigation items (filter by location optional)")
    public ResponseEntity<ApiResponse<List<NavigationItem>>> getAll(@RequestParam(required = false) String location) {
        return ResponseEntity.ok(ApiResponse.ok(navigationService.getAllNavigation(location)));
    }

    @PostMapping
    @Operation(summary = "Add navigation item")
    public ResponseEntity<ApiResponse<NavigationItem>> create(@RequestBody NavigationItem item) {
        return ResponseEntity.ok(ApiResponse.ok("Menu item created", navigationService.create(item)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update navigation item")
    public ResponseEntity<ApiResponse<NavigationItem>> update(@PathVariable Long id, @RequestBody NavigationItem item) {
        return ResponseEntity.ok(ApiResponse.ok("Menu item updated", navigationService.update(id, item)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete navigation item")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        navigationService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Menu item deleted", null));
    }
}
