package com.realestate.aura.project;

import com.realestate.aura.developer.DeveloperRepository;
import com.realestate.aura.exception.BadRequestException;
import com.realestate.aura.exception.ResourceNotFoundException;
import com.realestate.aura.location.LocationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final DeveloperRepository developerRepository;
    private final LocationRepository locationRepository;

    public ProjectService(ProjectRepository projectRepository, DeveloperRepository developerRepository, LocationRepository locationRepository) {
        this.projectRepository = projectRepository;
        this.developerRepository = developerRepository;
        this.locationRepository = locationRepository;
    }

    public List<Project> getAllPublishedProjects() {
        return projectRepository.findByPublishedTrue();
    }

    public List<Project> getFeaturedProjects() {
        return projectRepository.findByFeaturedTrueAndPublishedTrue();
    }

    public Project getProjectBySlug(String slug) {
        return projectRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Development project not found with slug: " + slug));
    }

    public List<Project> getAllProjectsForAdmin() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    @Transactional
    public Project createProject(Project project, Long developerId, Long locationId) {
        if (projectRepository.existsBySlug(project.getSlug())) {
            throw new BadRequestException("Project slug already in use: " + project.getSlug());
        }

        if (developerId != null) {
            project.setDeveloper(developerRepository.findById(developerId).orElse(null));
        }
        if (locationId != null) {
            project.setLocation(locationRepository.findById(locationId).orElse(null));
        }

        return projectRepository.save(project);
    }

    @Transactional
    public Project updateProject(Long id, Project updated, Long developerId, Long locationId) {
        Project existing = getProjectById(id);
        existing.setName(updated.getName());
        existing.setStartingPrice(updated.getStartingPrice());
        existing.setCurrency(updated.getCurrency());
        existing.setCompletionDate(updated.getCompletionDate());
        existing.setStatus(updated.getStatus());
        existing.setDescription(updated.getDescription());
        existing.setHeroImage(updated.getHeroImage());
        existing.setFeatured(updated.getFeatured());
        existing.setPublished(updated.getPublished());
        existing.setAmenitiesJson(updated.getAmenitiesJson());
        existing.setPaymentPlanJson(updated.getPaymentPlanJson());
        existing.setUnitTypesJson(updated.getUnitTypesJson());

        if (developerId != null) {
            existing.setDeveloper(developerRepository.findById(developerId).orElse(null));
        }
        if (locationId != null) {
            existing.setLocation(locationRepository.findById(locationId).orElse(null));
        }

        return projectRepository.save(existing);
    }

    @Transactional
    public void deleteProject(Long id) {
        Project existing = getProjectById(id);
        projectRepository.delete(existing);
    }
}
