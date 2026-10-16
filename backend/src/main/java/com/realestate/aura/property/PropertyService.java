package com.realestate.aura.property;

import com.realestate.aura.common.PagedResponse;
import com.realestate.aura.developer.DeveloperRepository;
import com.realestate.aura.exception.BadRequestException;
import com.realestate.aura.exception.ResourceNotFoundException;
import com.realestate.aura.location.LocationRepository;
import com.realestate.aura.project.ProjectRepository;
import com.realestate.aura.property.dto.PropertyRequestDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final LocationRepository locationRepository;
    private final DeveloperRepository developerRepository;
    private final ProjectRepository projectRepository;
    private final AmenityRepository amenityRepository;

    public PropertyService(PropertyRepository propertyRepository, LocationRepository locationRepository,
                           DeveloperRepository developerRepository, ProjectRepository projectRepository,
                           AmenityRepository amenityRepository) {
        this.propertyRepository = propertyRepository;
        this.locationRepository = locationRepository;
        this.developerRepository = developerRepository;
        this.projectRepository = projectRepository;
        this.amenityRepository = amenityRepository;
    }

    public PagedResponse<Property> searchProperties(
            Long locationId, String transactionType, String propertyType, String status,
            BigDecimal minPrice, BigDecimal maxPrice, Integer minBedrooms, Integer minBathrooms,
            String searchQuery, String sortBy, String sortDir, int page, int size
    ) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir != null ? sortDir : "DESC"),
                sortBy != null ? sortBy : "createdAt");
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Property> propertiesPage = propertyRepository.findPropertiesWithFilter(
                locationId, transactionType, propertyType, status, minPrice, maxPrice,
                minBedrooms, minBathrooms, searchQuery, pageable
        );

        return new PagedResponse<>(
                propertiesPage.getContent(),
                propertiesPage.getNumber(),
                propertiesPage.getSize(),
                propertiesPage.getTotalElements(),
                propertiesPage.getTotalPages(),
                propertiesPage.isLast()
        );
    }

    public List<Property> getFeaturedProperties() {
        return propertyRepository.findByFeaturedTrueAndPublishedTrue();
    }

    @Transactional
    public Property getPublishedPropertyBySlug(String slug) {
        Property property = propertyRepository.findBySlugAndPublishedTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with slug: " + slug));
        property.setViewsCount(property.getViewsCount() != null ? property.getViewsCount() + 1 : 1L);
        return propertyRepository.save(property);
    }

    public List<Property> getSimilarProperties(Long propertyId) {
        Property property = propertyRepository.findById(propertyId).orElse(null);
        if (property != null && property.getLocation() != null) {
            return propertyRepository.findTop4ByLocationIdAndIdNotAndPublishedTrue(property.getLocation().getId(), propertyId);
        }
        return Collections.emptyList();
    }

    public List<Property> getAllPropertiesForAdmin() {
        return propertyRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public Property getPropertyById(Long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));
    }

    @Transactional
    public Property createProperty(PropertyRequestDto dto) {
        if (dto.slug == null || dto.slug.isBlank()) {
            dto.slug = dto.title.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        }
        if (propertyRepository.existsBySlug(dto.slug)) {
            dto.slug = dto.slug + "-" + System.currentTimeMillis();
        }

        if (dto.referenceNumber == null || dto.referenceNumber.isBlank()) {
            dto.referenceNumber = "ELY-" + (1000 + new Random().nextInt(9000));
        }

        Property property = new Property();
        mapDtoToProperty(dto, property);

        return propertyRepository.save(property);
    }

    @Transactional
    public Property updateProperty(Long id, PropertyRequestDto dto) {
        Property property = getPropertyById(id);
        mapDtoToProperty(dto, property);
        return propertyRepository.save(property);
    }

    private void mapDtoToProperty(PropertyRequestDto dto, Property property) {
        property.setTitle(dto.title);
        if (dto.slug != null && !dto.slug.isBlank()) property.setSlug(dto.slug);
        if (dto.referenceNumber != null && !dto.referenceNumber.isBlank()) property.setReferenceNumber(dto.referenceNumber);
        property.setDescription(dto.description);
        property.setPrice(dto.price);
        if (dto.currency != null) property.setCurrency(dto.currency);
        if (dto.transactionType != null) property.setTransactionType(dto.transactionType);
        property.setPropertyType(dto.propertyType);
        property.setAddress(dto.address);
        property.setBedrooms(dto.bedrooms != null ? dto.bedrooms : 1);
        property.setBathrooms(dto.bathrooms != null ? dto.bathrooms : 1);
        property.setAreaSqft(dto.areaSqft);
        if (dto.status != null) property.setStatus(dto.status);
        if (dto.furnishedStatus != null) property.setFurnishedStatus(dto.furnishedStatus);
        property.setCompletionDate(dto.completionDate);
        property.setPaymentPlan(dto.paymentPlan);
        if (dto.featured != null) property.setFeatured(dto.featured);
        if (dto.published != null) property.setPublished(dto.published);
        if (dto.archived != null) property.setArchived(dto.archived);

        // 3D Model Configuration
        property.setModel3dUrl(dto.model3dUrl);
        property.setModel3dEnabled(dto.model3dEnabled != null ? dto.model3dEnabled : false);
        property.setModel3dTitle(dto.model3dTitle);
        if (dto.model3dCameraPreset != null) property.setModel3dCameraPreset(dto.model3dCameraPreset);
        if (dto.model3dLightingPreset != null) property.setModel3dLightingPreset(dto.model3dLightingPreset);
        property.setFallbackImageUrl(dto.fallbackImageUrl);

        property.setVideoUrl(dto.videoUrl);
        property.setTour360Url(dto.tour360Url);
        property.setFloorPlansJson(dto.floorPlansJson);
        property.setNearbyLandmarksJson(dto.nearbyLandmarksJson);
        property.setMetaTitle(dto.metaTitle);
        property.setMetaDescription(dto.metaDescription);
        property.setCanonicalUrl(dto.canonicalUrl);
        property.setOgImage(dto.ogImage);

        // Foreign relationships
        if (dto.locationId != null) {
            property.setLocation(locationRepository.findById(dto.locationId).orElse(null));
        }
        if (dto.developerId != null) {
            property.setDeveloper(developerRepository.findById(dto.developerId).orElse(null));
        }
        if (dto.projectId != null) {
            property.setProject(projectRepository.findById(dto.projectId).orElse(null));
        }

        // Amenities
        if (dto.amenityIds != null) {
            Set<Amenity> amenities = new HashSet<>(amenityRepository.findAllById(dto.amenityIds));
            property.setAmenities(amenities);
        }

        // Images
        if (dto.imageUrls != null && !dto.imageUrls.isEmpty()) {
            property.getImages().clear();
            for (int i = 0; i < dto.imageUrls.size(); i++) {
                PropertyImage pImage = new PropertyImage();
                pImage.setProperty(property);
                pImage.setImageUrl(dto.imageUrls.get(i));
                pImage.setDisplayOrder(i + 1);
                pImage.setCover(i == 0);
                property.getImages().add(pImage);
            }
        }
    }

    @Transactional
    public void deleteProperty(Long id) {
        Property property = getPropertyById(id);
        propertyRepository.delete(property);
    }

    public List<Amenity> getAllAmenities() {
        return amenityRepository.findAll();
    }
}
