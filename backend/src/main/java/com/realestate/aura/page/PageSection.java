package com.realestate.aura.page;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "page_sections")
public class PageSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "page_id", nullable = false)
    @JsonIgnore
    private Page page;

    @Column(name = "section_type", nullable = false, length = 50)
    private String sectionType; // HERO_SECTION, FEATURED_PROPERTIES, DEVELOPMENTS_SHOWCASE, LOCATIONS_GRID, ABOUT_OVERVIEW, TESTIMONIALS, LATEST_ARTICLES, NEWSLETTER_CTA, RICH_TEXT, CONTACT_FORM

    private String title;

    private String subtitle;

    @Column(name = "content_json", columnDefinition = "LONGTEXT")
    private String contentJson;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(name = "is_visible")
    private Boolean visible = true;

    @Column(name = "background_image", length = 500)
    private String backgroundImage;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    public PageSection() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Page getPage() {
        return page;
    }

    public void setPage(Page page) {
        this.page = page;
    }

    public String getSectionType() {
        return sectionType;
    }

    public void setSectionType(String sectionType) {
        this.sectionType = sectionType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public String getContentJson() {
        return contentJson;
    }

    public void setContentJson(String contentJson) {
        this.contentJson = contentJson;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public Boolean getVisible() {
        return visible;
    }

    public void setVisible(Boolean visible) {
        this.visible = visible;
    }

    public Boolean getIsActive() {
        return visible;
    }

    public void setIsActive(Boolean active) {
        if (active != null) this.visible = active;
    }

    public Integer getSortOrder() {
        return displayOrder;
    }

    public void setSortOrder(Integer order) {
        if (order != null) this.displayOrder = order;
    }

    public String getBackgroundImage() {
        return backgroundImage;
    }

    public void setBackgroundImage(String backgroundImage) {
        this.backgroundImage = backgroundImage;
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
