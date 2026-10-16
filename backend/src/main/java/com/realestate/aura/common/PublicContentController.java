package com.realestate.aura.common;

import com.realestate.aura.team.TeamMember;
import com.realestate.aura.team.TeamMemberRepository;
import com.realestate.aura.testimonial.Testimonial;
import com.realestate.aura.testimonial.TestimonialRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@Tag(name = "Public Content & Editorial", description = "Public testimonials, leadership team, and credentials")
public class PublicContentController {

    private final TestimonialRepository testimonialRepository;
    private final TeamMemberRepository teamMemberRepository;

    public PublicContentController(TestimonialRepository testimonialRepository, TeamMemberRepository teamMemberRepository) {
        this.testimonialRepository = testimonialRepository;
        this.teamMemberRepository = teamMemberRepository;
    }

    @GetMapping("/testimonials")
    @Operation(summary = "Get featured client endorsements and testimonials")
    public ResponseEntity<ApiResponse<List<Testimonial>>> getTestimonials() {
        return ResponseEntity.ok(ApiResponse.ok(testimonialRepository.findByFeaturedTrueOrderByDisplayOrderAsc()));
    }

    @GetMapping("/team")
    @Operation(summary = "Get leadership advisory team members")
    public ResponseEntity<ApiResponse<List<TeamMember>>> getTeam() {
        return ResponseEntity.ok(ApiResponse.ok(teamMemberRepository.findAllByOrderByDisplayOrderAsc()));
    }
}
