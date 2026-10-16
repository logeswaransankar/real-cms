package com.realestate.aura.project;

import com.realestate.aura.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/projects")
@Tag(name = "Admin Projects", description = "Management of developments, off-plan projects, and master communities")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR', 'PROPERTY_MANAGER')")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    @Operation(summary = "List all projects for administration")
    public ResponseEntity<ApiResponse<List<Project>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(projectService.getAllProjectsForAdmin()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get project by ID")
    public ResponseEntity<ApiResponse<Project>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(projectService.getProjectById(id)));
    }

    public static class ProjectDto {
        public Project project;
        public Long developerId;
        public Long locationId;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PROPERTY_MANAGER')")
    @Operation(summary = "Create a new development project")
    public ResponseEntity<ApiResponse<Project>> create(@RequestBody ProjectDto dto) {
        Project created = projectService.createProject(dto.project, dto.developerId, dto.locationId);
        return ResponseEntity.ok(ApiResponse.ok("Project created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PROPERTY_MANAGER')")
    @Operation(summary = "Update development project")
    public ResponseEntity<ApiResponse<Project>> update(@PathVariable Long id, @RequestBody ProjectDto dto) {
        Project updated = projectService.updateProject(id, dto.project, dto.developerId, dto.locationId);
        return ResponseEntity.ok(ApiResponse.ok("Project updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Delete development project")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.ok("Project deleted successfully", null));
    }
}
