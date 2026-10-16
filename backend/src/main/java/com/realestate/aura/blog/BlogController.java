package com.realestate.aura.blog;

import com.realestate.aura.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/blog")
@Tag(name = "Admin Editorial & Journal", description = "Management of articles, publication state, and categories")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR')")
public class BlogController {

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping
    @Operation(summary = "List all articles for admin")
    public ResponseEntity<ApiResponse<List<BlogPost>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(blogService.getAllPostsForAdmin()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get article by ID")
    public ResponseEntity<ApiResponse<BlogPost>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(blogService.getPostById(id)));
    }

    public static class BlogPostDto {
        public BlogPost post;
        public Long categoryId;
    }

    @PostMapping
    @Operation(summary = "Create a new editorial article")
    public ResponseEntity<ApiResponse<BlogPost>> create(@RequestBody BlogPostDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Article created successfully", blogService.createPost(dto.post, dto.categoryId)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update editorial article")
    public ResponseEntity<ApiResponse<BlogPost>> update(@PathVariable Long id, @RequestBody BlogPostDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Article updated successfully", blogService.updatePost(id, dto.post, dto.categoryId)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete editorial article")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        blogService.deletePost(id);
        return ResponseEntity.ok(ApiResponse.ok("Article deleted successfully", null));
    }
}
