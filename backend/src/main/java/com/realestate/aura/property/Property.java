package com.realestate.aura.property;

import com.realestate.aura.developer.Developer;
import com.realestate.aura.location.Location;
import com.realestate.aura.project.Project;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "properties")
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "reference_number", nullable = false, unique = true, length = 50)
    private String referenceNumber;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    @Column(length = 10)
    private String currency = "AED";

    @Column(name = "transaction_type", nullable = false, length = 20)
    private String transactionType = "BUY"; // BUY, RENT

    @Column(name = "property_type", nullable = false, length = 50)
    private String propertyType; // APARTMENT, PENTHOUSE, VILLA, TOWNHOUSE, DUPLEX

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "location_id")
    private Location location;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "developer_id")
    private Developer developer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"images", "hibernateLazyInitializer", "handler"})
    private Project project;

    private String address;

    @Column(nullable = false)
    private Integer bedrooms = 1;

    @Column(nullable = false)
    private Integer bathrooms = 1;

    @Column(name = "area_sqft", nullable = false, precision = 10, scale = 2)
    private BigDecimal areaSqft;

    @Column(length = 30)
    private String status = "READY"; // READY, OFF_PLAN

    @Column(name = "furnished_status", length = 30)
    private String furnishedStatus = "FURNISHED"; // FURNISHED, SEMI_FURNISHED, UNFURNISHED

    @Column(name = "completion_date", length = 50)
    private String completionDate;

    @Column(name = "payment_plan")
    private String paymentPlan;

    @Column(name = "is_featured")
    private Boolean featured = false;

    @Column(name = "is_published")
    private Boolean published = true;

    @Column(name = "is_archived")
    private Boolean archived = false;

    // 3D Interactive Configuration
    @Column(name = "model_3d_url", length = 500)
    private String model3dUrl;

    @Column(name = "model_3d_enabled")
    private Boolean model3dEnabled = false;

    @Column(name = "model_3d_title", length = 150)
    private String model3dTitle;

    @Column(name = "model_3d_camera_preset", length = 50)
    private String model3dCameraPreset = "FRONT_ELEVATION";

    @Column(name = "model_3d_lighting_preset", length = 50)
    private String model3dLightingPreset = "GOLDEN_HOUR";

    @Column(name = "fallback_image_url", length = 500)
    private String fallbackImageUrl;

    @Column(name = "video_url", length = 500)
    private String videoUrl;

    @Column(name = "tour_360_url", length = 500)
    private String tour360Url;

    @Column(name = "floor_plans_json", columnDefinition = "TEXT")
    private String floorPlansJson;

    @Column(name = "nearby_landmarks_json", columnDefinition = "TEXT")
    private String nearbyLandmarksJson;

    // SEO Metadata
    @Column(name = "meta_title")
    private String metaTitle;

    @Column(name = "meta_description", length = 500)
    private String metaDescription;

    @Column(name = "canonical_url", length = 500)
    private String canonicalUrl;

    @Column(name = "og_image", length = 500)
    private String ogImage;

    @Column(name = "views_count")
    private Long viewsCount = 0L;

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    private List<PropertyImage> images = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "property_amenities",
        joinColumns = @JoinColumn(name = "property_id"),
        inverseJoinColumns = @JoinColumn(name = "amenity_id")
    )
    private Set<Amenity> amenities = new HashSet<>();

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    public Property() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public String getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(String propertyType) {
        this.propertyType = propertyType;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Developer getDeveloper() {
        return developer;
    }

    public void setDeveloper(Developer developer) {
        this.developer = developer;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Integer getBedrooms() {
        return bedrooms;
    }

    public void setBedrooms(Integer bedrooms) {
        this.bedrooms = bedrooms;
    }

    public Integer getBathrooms() {
        return bathrooms;
    }

    public void setBathrooms(Integer bathrooms) {
        this.bathrooms = bathrooms;
    }

    public BigDecimal getAreaSqft() {
        return areaSqft;
    }

    public void setAreaSqft(BigDecimal areaSqft) {
        this.areaSqft = areaSqft;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFurnishedStatus() {
        return furnishedStatus;
    }

    public void setFurnishedStatus(String furnishedStatus) {
        this.furnishedStatus = furnishedStatus;
    }

    public String getCompletionDate() {
        return completionDate;
    }

    public void setCompletionDate(String completionDate) {
        this.completionDate = completionDate;
    }

    public String getPaymentPlan() {
        return paymentPlan;
    }

    public void setPaymentPlan(String paymentPlan) {
        this.paymentPlan = paymentPlan;
    }

    public Boolean getFeatured() {
        return featured;
    }

    public void setFeatured(Boolean featured) {
        this.featured = featured;
    }

    public Boolean getPublished() {
        return published;
    }

    public void setPublished(Boolean published) {
        this.published = published;
    }

    public Boolean getArchived() {
        return archived;
    }

    public void setArchived(Boolean archived) {
        this.archived = archived;
    }

    public String getModel3dUrl() {
        return model3dUrl;
    }

    public void setModel3dUrl(String model3dUrl) {
        this.model3dUrl = model3dUrl;
    }

    public Boolean getModel3dEnabled() {
        return model3dEnabled;
    }

    public void setModel3dEnabled(Boolean model3dEnabled) {
        this.model3dEnabled = model3dEnabled;
    }

    public String getModel3dTitle() {
        return model3dTitle;
    }

    public void setModel3dTitle(String model3dTitle) {
        this.model3dTitle = model3dTitle;
    }

    public String getModel3dCameraPreset() {
        return model3dCameraPreset;
    }

    public void setModel3dCameraPreset(String model3dCameraPreset) {
        this.model3dCameraPreset = model3dCameraPreset;
    }

    public String getModel3dLightingPreset() {
        return model3dLightingPreset;
    }

    public void setModel3dLightingPreset(String model3dLightingPreset) {
        this.model3dLightingPreset = model3dLightingPreset;
    }

    public String getFallbackImageUrl() {
        return fallbackImageUrl;
    }

    public void setFallbackImageUrl(String fallbackImageUrl) {
        this.fallbackImageUrl = fallbackImageUrl;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public String getTour360Url() {
        return tour360Url;
    }

    public void setTour360Url(String tour360Url) {
        this.tour360Url = tour360Url;
    }

    public String getFloorPlansJson() {
        return floorPlansJson;
    }

    public void setFloorPlansJson(String floorPlansJson) {
        this.floorPlansJson = floorPlansJson;
    }

    public String getNearbyLandmarksJson() {
        return nearbyLandmarksJson;
    }

    public void setNearbyLandmarksJson(String nearbyLandmarksJson) {
        this.nearbyLandmarksJson = nearbyLandmarksJson;
    }

    public String getMetaTitle() {
        return metaTitle;
    }

    public void setMetaTitle(String metaTitle) {
        this.metaTitle = metaTitle;
    }

    public String getMetaDescription() {
        return metaDescription;
    }

    public void setMetaDescription(String metaDescription) {
        this.metaDescription = metaDescription;
    }

    public String getCanonicalUrl() {
        return canonicalUrl;
    }

    public void setCanonicalUrl(String canonicalUrl) {
        this.canonicalUrl = canonicalUrl;
    }

    public String getOgImage() {
        return ogImage;
    }

    public void setOgImage(String ogImage) {
        this.ogImage = ogImage;
    }

    public Long getViewsCount() {
        return viewsCount;
    }

    public void setViewsCount(Long viewsCount) {
        this.viewsCount = viewsCount;
    }

    public List<PropertyImage> getImages() {
        return images;
    }

    public void setImages(List<PropertyImage> images) {
        this.images = images;
    }

    public Set<Amenity> getAmenities() {
        return amenities;
    }

    public void setAmenities(Set<Amenity> amenities) {
        this.amenities = amenities;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
