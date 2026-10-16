package com.realestate.aura.enquiry;

import com.realestate.aura.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/enquiries")
@Tag(name = "Admin Inquiries & Leads", description = "Management of client inquiries, tour viewings, status updates, and notes")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PROPERTY_MANAGER')")
public class EnquiryController {

    private final EnquiryService enquiryService;

    public EnquiryController(EnquiryService enquiryService) {
        this.enquiryService = enquiryService;
    }

    @GetMapping
    @Operation(summary = "List all client enquiries")
    public ResponseEntity<ApiResponse<List<Enquiry>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(enquiryService.getAllEnquiries()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single enquiry details")
    public ResponseEntity<ApiResponse<Enquiry>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(enquiryService.getEnquiryById(id)));
    }

    public static class UpdateStatusRequest {
        public String status;
        public String adminNotes;
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update enquiry status (NEW, CONTACTED, QUALIFIED, CLOSED) and admin notes")
    public ResponseEntity<ApiResponse<Enquiry>> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest request
    ) {
        Enquiry updated = enquiryService.updateStatus(id, request.status, request.adminNotes);
        return ResponseEntity.ok(ApiResponse.ok("Enquiry status updated", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete enquiry lead")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        enquiryService.deleteEnquiry(id);
        return ResponseEntity.ok(ApiResponse.ok("Enquiry deleted", null));
    }
}
