package com.realestate.aura.cms;

import com.realestate.aura.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/admin/revisions")
@Tag(name = "Admin Content Revisions", description = "CMS revisions, draft snapshots, and rollback functionality")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR')")
public class RevisionController {

    private final RevisionService revisionService;

    public RevisionController(RevisionService revisionService) {
        this.revisionService = revisionService;
    }

    @GetMapping("/{entityType}/{entityId}")
    @Operation(summary = "Get revision history for an entity (PAGE, PROPERTY, SETTINGS)")
    public ResponseEntity<ApiResponse<List<ContentRevision>>> getRevisions(
            @PathVariable String entityType,
            @PathVariable Long entityId
    ) {
        return ResponseEntity.ok(ApiResponse.ok(revisionService.getRevisions(entityType.toUpperCase(), entityId)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single revision snapshot by ID")
    public ResponseEntity<ApiResponse<ContentRevision>> getRevisionById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(revisionService.getRevisionById(id)));
    }

    public static class SaveRevisionRequest {
        public String title;
        public String snapshotJson;
        public boolean isPublished;
    }

    @PostMapping("/{entityType}/{entityId}")
    @Operation(summary = "Save a new snapshot revision or draft")
    public ResponseEntity<ApiResponse<ContentRevision>> createRevision(
            @PathVariable String entityType,
            @PathVariable Long entityId,
            @RequestBody SaveRevisionRequest request,
            Principal principal
    ) {
        String createdBy = principal != null ? principal.getName() : "System Editor";
        ContentRevision created = revisionService.createRevision(
                entityType.toUpperCase(), entityId, request.title, request.snapshotJson, createdBy, request.isPublished
        );
        return ResponseEntity.ok(ApiResponse.ok("Revision created successfully", created));
    }

    @PostMapping("/{id}/rollback")
    @Operation(summary = "Rollback to a previous snapshot revision")
    public ResponseEntity<ApiResponse<ContentRevision>> rollbackRevision(@PathVariable Long id) {
        ContentRevision revision = revisionService.getRevisionById(id);
        return ResponseEntity.ok(ApiResponse.ok("Rolled back to revision #" + revision.getRevisionNumber(), revision));
    }
}
