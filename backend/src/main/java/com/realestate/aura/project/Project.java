package com.realestate.aura.project;

import com.realestate.aura.developer.Developer;
import com.realestate.aura.location.Location;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, unique = true, length = 200)
    private String slug;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "developer_id")
    private Developer developer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "location_id")
    private Location location;

    @Column(name = "starting_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal startingPrice;

    @Column(length = 10)
    private String currency = "AED";

    @Column(name = "completion_date", length = 50)
    private String completionDate;

    @Column(length = 50)
    private String status = "OFF_PLAN"; // OFF_PLAN, UNDER_CONSTRUCTION, READY

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "hero_image", length = 500)
    private String heroImage;

    @Column(name = "is_featured")
    private Boolean featured = false;

    @Column(name = "is_published")
    private Boolean published = true;

    @Column(name = "amenities_json", columnDefinition = "TEXT")
    private String amenitiesJson;

    @Column(name = "payment_plan_json", columnDefinition = "TEXT")
    private String paymentPlanJson;

    @Column(name = "unit_types_json", columnDefinition = "TEXT")
    private String unitTypesJson;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectImage> images = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    public Project() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public Developer getDeveloper() {
        return developer;
    }

    public void setDeveloper(Developer developer) {
        this.developer = developer;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public BigDecimal getStartingPrice() {
        return startingPrice;
    }

    public void setStartingPrice(BigDecimal startingPrice) {
        this.startingPrice = startingPrice;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getCompletionDate() {
        return completionDate;
    }

    public void setCompletionDate(String completionDate) {
        this.completionDate = completionDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getHeroImage() {
        return heroImage;
    }

    public void setHeroImage(String heroImage) {
        this.heroImage = heroImage;
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

    public String getAmenitiesJson() {
        return amenitiesJson;
    }

    public void setAmenitiesJson(String amenitiesJson) {
        this.amenitiesJson = amenitiesJson;
    }

    public String getPaymentPlanJson() {
        return paymentPlanJson;
    }

    public void setPaymentPlanJson(String paymentPlanJson) {
        this.paymentPlanJson = paymentPlanJson;
    }

    public String getUnitTypesJson() {
        return unitTypesJson;
    }

    public void setUnitTypesJson(String unitTypesJson) {
        this.unitTypesJson = unitTypesJson;
    }

    public List<ProjectImage> getImages() {
        return images;
    }

    public void setImages(List<ProjectImage> images) {
        this.images = images;
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
