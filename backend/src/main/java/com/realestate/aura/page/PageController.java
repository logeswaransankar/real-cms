package com.realestate.aura.page;

import com.realestate.aura.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/pages")
@Tag(name = "Admin CMS Pages", description = "Dynamic CMS page and visual section builder operations")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR')")
public class PageController {

    private final PageService pageService;

    public PageController(PageService pageService) {
        this.pageService = pageService;
    }

    @GetMapping
    @Operation(summary = "List all pages for CMS administration")
    public ResponseEntity<ApiResponse<List<Page>>> getAllPages() {
        return ResponseEntity.ok(ApiResponse.ok(pageService.getAllPages()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single page with all configured sections")
    public ResponseEntity<ApiResponse<Page>> getPageById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(pageService.getPageForAdmin(id)));
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get page with all sections by slug for preview or editing")
    public ResponseEntity<ApiResponse<Page>> getPageBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(pageService.getPageBySlugForAdmin(slug)));
    }

    @PostMapping
    @Operation(summary = "Create a new page")
    public ResponseEntity<ApiResponse<Page>> createPage(@RequestBody Page page) {
        return ResponseEntity.ok(ApiResponse.ok("Page created successfully", pageService.createPage(page)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update page details and publishing status")
    public ResponseEntity<ApiResponse<Page>> updatePage(@PathVariable Long id, @RequestBody Page page) {
        return ResponseEntity.ok(ApiResponse.ok("Page updated successfully", pageService.updatePage(id, page)));
    }

    @PostMapping("/{pageId}/sections")
    @Operation(summary = "Add a section to a page")
    public ResponseEntity<ApiResponse<PageSection>> addSection(@PathVariable Long pageId, @RequestBody PageSection section) {
        return ResponseEntity.ok(ApiResponse.ok("Section added successfully", pageService.addSection(pageId, section)));
    }

    @PutMapping("/sections/{sectionId}")
    @Operation(summary = "Update a page section")
    public ResponseEntity<ApiResponse<PageSection>> updateSection(@PathVariable Long sectionId, @RequestBody PageSection section) {
        return ResponseEntity.ok(ApiResponse.ok("Section updated successfully", pageService.updateSection(sectionId, section)));
    }

    @DeleteMapping("/sections/{sectionId}")
    @Operation(summary = "Delete a page section")
    public ResponseEntity<ApiResponse<Void>> deleteSection(@PathVariable Long sectionId) {
        pageService.deleteSection(sectionId);
        return ResponseEntity.ok(ApiResponse.ok("Section deleted successfully", null));
    }

    public static class ReorderRequest {
        public List<Long> sectionIds;
    }

    @PostMapping("/{pageId}/sections/reorder")
    @Operation(summary = "Reorder page sections")
    public ResponseEntity<ApiResponse<Void>> reorderSections(@PathVariable Long pageId, @RequestBody ReorderRequest request) {
        pageService.reorderSections(pageId, request.sectionIds);
        return ResponseEntity.ok(ApiResponse.ok("Sections reordered successfully", null));
    }
}
