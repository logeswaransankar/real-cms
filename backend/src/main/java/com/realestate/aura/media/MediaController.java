package com.realestate.aura.media;

import com.realestate.aura.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/media")
@Tag(name = "Admin Media Library", description = "Management of uploaded imagery, videos, 3D glTF/GLB models, and brochures")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR', 'PROPERTY_MANAGER')")
public class MediaController {

    private final MediaService mediaService;

    public MediaController(MediaService mediaService) {
        this.mediaService = mediaService;
    }

    @GetMapping
    @Operation(summary = "List all media assets in the media library")
    public ResponseEntity<ApiResponse<List<MediaAsset>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(mediaService.getAllMedia()));
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload image, video or 3D asset file")
    public ResponseEntity<ApiResponse<MediaAsset>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "altText", required = false) String altText,
            @RequestParam(value = "caption", required = false) String caption,
            @RequestParam(value = "folder", required = false) String folder
    ) {
        MediaAsset asset = mediaService.uploadFile(file, altText, caption, folder);
        return ResponseEntity.ok(ApiResponse.ok("Asset uploaded successfully", asset));
    }

    @PostMapping("/register-external")
    @Operation(summary = "Register an external URL media asset (e.g. Unsplash, CDN, or Cloudinary)")
    public ResponseEntity<ApiResponse<MediaAsset>> registerExternal(@RequestBody MediaAsset asset) {
        return ResponseEntity.ok(ApiResponse.ok("Media asset registered", mediaService.registerExternalMedia(asset)));
    }

    public static class UpdateMediaRequest {
        public String altText;
        public String caption;
        public String folder;
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update media metadata")
    public ResponseEntity<ApiResponse<MediaAsset>> update(
            @PathVariable Long id,
            @RequestBody UpdateMediaRequest request
    ) {
        MediaAsset updated = mediaService.updateMedia(id, request.altText, request.caption, request.folder);
        return ResponseEntity.ok(ApiResponse.ok("Media metadata updated", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Delete media asset")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        mediaService.deleteMedia(id);
        return ResponseEntity.ok(ApiResponse.ok("Asset deleted successfully", null));
    }
}
