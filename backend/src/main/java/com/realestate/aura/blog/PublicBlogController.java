package com.realestate.aura.blog;

import com.realestate.aura.common.ApiResponse;
import com.realestate.aura.common.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/blog")
@Tag(name = "Public Editorial Journal", description = "Public endpoints for real estate articles and architectural insights")
public class PublicBlogController {

    private final BlogService blogService;

    public PublicBlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping
    @Operation(summary = "Get paginated published articles")
    public ResponseEntity<ApiResponse<PagedResponse<BlogPost>>> getArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        return ResponseEntity.ok(ApiResponse.ok(blogService.getPublishedArticles(page, size)));
    }

    @GetMapping("/latest")
    @Operation(summary = "Get latest articles for homepage")
    public ResponseEntity<ApiResponse<List<BlogPost>>> getLatest() {
        return ResponseEntity.ok(ApiResponse.ok(blogService.getLatestArticles()));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get single article by slug")
    public ResponseEntity<ApiResponse<BlogPost>> getArticleBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(blogService.getArticleBySlug(slug)));
    }

    @GetMapping("/categories")
    @Operation(summary = "Get all article categories")
    public ResponseEntity<ApiResponse<List<BlogCategory>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.ok(blogService.getAllCategories()));
    }
}
