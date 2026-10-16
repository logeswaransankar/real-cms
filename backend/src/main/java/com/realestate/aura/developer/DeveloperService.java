package com.realestate.aura.developer;

import com.realestate.aura.common.ApiResponse;
import com.realestate.aura.exception.BadRequestException;
import com.realestate.aura.exception.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Service
public class DeveloperService {

    private final DeveloperRepository developerRepository;

    public DeveloperService(DeveloperRepository developerRepository) {
        this.developerRepository = developerRepository;
    }

    public List<Developer> getAllDevelopers() {
        return developerRepository.findAll();
    }

    public Developer getDeveloperById(Long id) {
        return developerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Developer not found with id: " + id));
    }

    public Developer getDeveloperBySlug(String slug) {
        return developerRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Developer not found with slug: " + slug));
    }

    @Transactional
    public Developer createDeveloper(Developer developer) {
        if (developerRepository.existsBySlug(developer.getSlug())) {
            throw new BadRequestException("Developer with slug already exists");
        }
        return developerRepository.save(developer);
    }

    @Transactional
    public Developer updateDeveloper(Long id, Developer details) {
        Developer existing = getDeveloperById(id);
        existing.setName(details.getName());
        existing.setLogoUrl(details.getLogoUrl());
        existing.setDescription(details.getDescription());
        existing.setWebsiteUrl(details.getWebsiteUrl());
        return developerRepository.save(existing);
    }

    @Transactional
    public void deleteDeveloper(Long id) {
        Developer existing = getDeveloperById(id);
        developerRepository.delete(existing);
    }
}
