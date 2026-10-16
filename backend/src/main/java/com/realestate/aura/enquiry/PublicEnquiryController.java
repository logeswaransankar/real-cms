package com.realestate.aura.enquiry;

import com.realestate.aura.common.ApiResponse;
import com.realestate.aura.enquiry.dto.EnquiryRequestDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
@Tag(name = "Public Inquiries & Viewing Bookings", description = "Public endpoints for submitting property inquiries, contact requests, and private viewings")
public class PublicEnquiryController {

    private final EnquiryService enquiryService;

    public PublicEnquiryController(EnquiryService enquiryService) {
        this.enquiryService = enquiryService;
    }

    @PostMapping("/enquiries")
    @Operation(summary = "Submit general inquiry, property inquiry, or project consultation")
    public ResponseEntity<ApiResponse<Enquiry>> submitEnquiry(@Valid @RequestBody EnquiryRequestDto dto) {
        Enquiry saved = enquiryService.submitEnquiry(dto);
        return ResponseEntity.ok(ApiResponse.ok("Thank you. Our private advisory concierge will contact you promptly.", saved));
    }

    @PostMapping("/viewing-requests")
    @Operation(summary = "Schedule an in-person or live video tour viewing request")
    public ResponseEntity<ApiResponse<Enquiry>> scheduleViewing(@Valid @RequestBody EnquiryRequestDto dto) {
        dto.enquiryType = "VIEWING_REQUEST";
        Enquiry saved = enquiryService.submitEnquiry(dto);
        return ResponseEntity.ok(ApiResponse.ok("Private viewing request submitted successfully.", saved));
    }
}
