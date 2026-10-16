package com.realestate.aura.enquiry;

import com.realestate.aura.enquiry.dto.EnquiryRequestDto;
import com.realestate.aura.exception.ResourceNotFoundException;
import com.realestate.aura.project.ProjectRepository;
import com.realestate.aura.property.PropertyRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EnquiryService {

    private final EnquiryRepository enquiryRepository;
    private final ViewingRequestRepository viewingRequestRepository;
    private final PropertyRepository propertyRepository;
    private final ProjectRepository projectRepository;

    public EnquiryService(EnquiryRepository enquiryRepository, ViewingRequestRepository viewingRequestRepository,
                          PropertyRepository propertyRepository, ProjectRepository projectRepository) {
        this.enquiryRepository = enquiryRepository;
        this.viewingRequestRepository = viewingRequestRepository;
        this.propertyRepository = propertyRepository;
        this.projectRepository = projectRepository;
    }

    public List<Enquiry> getAllEnquiries() {
        return enquiryRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public Enquiry getEnquiryById(Long id) {
        return enquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enquiry not found with id: " + id));
    }

    @Transactional
    public Enquiry submitEnquiry(EnquiryRequestDto dto) {
        Enquiry enquiry = new Enquiry();
        enquiry.setFullName(dto.fullName);
        enquiry.setEmail(dto.email);
        enquiry.setPhone(dto.phone);
        enquiry.setMessage(dto.message);
        enquiry.setEnquiryType(dto.enquiryType != null ? dto.enquiryType : "GENERAL");
        enquiry.setStatus("NEW");

        if (dto.propertyId != null) {
            enquiry.setProperty(propertyRepository.findById(dto.propertyId).orElse(null));
        }
        if (dto.projectId != null) {
            enquiry.setProject(projectRepository.findById(dto.projectId).orElse(null));
        }

        Enquiry saved = enquiryRepository.save(enquiry);

        if (dto.preferredDate != null && dto.preferredTime != null) {
            ViewingRequest vr = new ViewingRequest();
            vr.setEnquiry(saved);
            vr.setPreferredDate(dto.preferredDate);
            vr.setPreferredTime(dto.preferredTime);
            vr.setViewingType(dto.viewingType != null ? dto.viewingType : "IN_PERSON");
            viewingRequestRepository.save(vr);
            saved.setViewingRequest(vr);
        }

        return saved;
    }

    @Transactional
    public Enquiry updateStatus(Long id, String status, String adminNotes) {
        Enquiry enquiry = getEnquiryById(id);
        if (status != null && !status.isBlank()) {
            enquiry.setStatus(status.toUpperCase());
        }
        if (adminNotes != null) {
            enquiry.setAdminNotes(adminNotes);
        }
        return enquiryRepository.save(enquiry);
    }

    @Transactional
    public void deleteEnquiry(Long id) {
        Enquiry enquiry = getEnquiryById(id);
        enquiryRepository.delete(enquiry);
    }
}
