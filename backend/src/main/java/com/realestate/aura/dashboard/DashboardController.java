package com.realestate.aura.dashboard;

import com.realestate.aura.common.ApiResponse;
import com.realestate.aura.dashboard.dto.DashboardStatsDto;
import com.realestate.aura.enquiry.Enquiry;
import com.realestate.aura.enquiry.EnquiryRepository;
import com.realestate.aura.project.ProjectRepository;
import com.realestate.aura.property.Property;
import com.realestate.aura.property.PropertyRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
@Tag(name = "Admin CMS Dashboard", description = "Real-time statistics, portfolio summaries, and enquiry pipeline metrics")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR', 'PROPERTY_MANAGER')")
public class DashboardController {

    private final PropertyRepository propertyRepository;
    private final ProjectRepository projectRepository;
    private final EnquiryRepository enquiryRepository;

    public DashboardController(PropertyRepository propertyRepository, ProjectRepository projectRepository, EnquiryRepository enquiryRepository) {
        this.propertyRepository = propertyRepository;
        this.projectRepository = projectRepository;
        this.enquiryRepository = enquiryRepository;
    }

    @GetMapping
    @Operation(summary = "Get admin dashboard overview metrics and recent records")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats() {
        long totalProps = propertyRepository.count();
        long publishedProps = propertyRepository.countByPublishedTrue();
        long draftProps = propertyRepository.countByPublishedFalse();
        long totalProjects = projectRepository.count();
        long totalEnquiries = enquiryRepository.count();
        long newEnquiries = enquiryRepository.countByStatus("NEW");

        List<Property> recentProperties = propertyRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))
        ).getContent();

        List<Enquiry> recentEnquiries = enquiryRepository.findTop10ByOrderByCreatedAtDesc();

        DashboardStatsDto stats = new DashboardStatsDto(
                totalProps, publishedProps, draftProps, totalProjects,
                totalEnquiries, newEnquiries, recentProperties, recentEnquiries
        );

        return ResponseEntity.ok(ApiResponse.ok(stats));
    }
}
