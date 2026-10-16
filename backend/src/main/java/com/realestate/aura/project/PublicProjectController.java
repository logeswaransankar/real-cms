package com.realestate.aura.project;

import com.realestate.aura.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/projects")
@Tag(name = "Public Projects", description = "Public endpoints for exploring master architectural developments")
public class PublicProjectController {

    private final ProjectService projectService;

    public PublicProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    @Operation(summary = "Get published development projects with featured filter")
    public ResponseEntity<ApiResponse<List<Project>>> getProjects(@RequestParam(required = false) Boolean featured) {
        if (Boolean.TRUE.equals(featured)) {
            return ResponseEntity.ok(ApiResponse.ok(projectService.getFeaturedProjects()));
        }
        return ResponseEntity.ok(ApiResponse.ok(projectService.getAllPublishedProjects()));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get project details by slug")
    public ResponseEntity<ApiResponse<Project>> getProjectBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(projectService.getProjectBySlug(slug)));
    }
}
