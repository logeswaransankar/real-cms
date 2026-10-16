package com.realestate.aura.page;

import com.realestate.aura.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/pages")
@Tag(name = "Public Pages", description = "Public endpoint to dynamically fetch published page content and sections")
public class PublicPageController {

    private final PageService pageService;

    public PublicPageController(PageService pageService) {
        this.pageService = pageService;
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get published page by slug with active configured sections")
    public ResponseEntity<ApiResponse<Page>> getPageBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(pageService.getPageBySlug(slug)));
    }
}
