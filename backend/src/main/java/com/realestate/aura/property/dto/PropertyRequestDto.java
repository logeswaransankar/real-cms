package com.realestate.aura.property.dto;

import java.math.BigDecimal;
import java.util.List;

public class PropertyRequestDto {
    public String title;
    public String slug;
    public String referenceNumber;
    public String description;
    public BigDecimal price;
    public String currency = "AED";
    public String transactionType = "BUY";
    public String propertyType;
    public Long locationId;
    public Long developerId;
    public Long projectId;
    public String address;
    public Integer bedrooms;
    public Integer bathrooms;
    public BigDecimal areaSqft;
    public String status = "READY";
    public String furnishedStatus = "FURNISHED";
    public String completionDate;
    public String paymentPlan;
    public Boolean featured = false;
    public Boolean published = true;
    public Boolean archived = false;

    // 3D Model
    public String model3dUrl;
    public Boolean model3dEnabled = false;
    public String model3dTitle;
    public String model3dCameraPreset = "FRONT_ELEVATION";
    public String model3dLightingPreset = "GOLDEN_HOUR";
    public String fallbackImageUrl;

    public String videoUrl;
    public String tour360Url;
    public String floorPlansJson;
    public String nearbyLandmarksJson;

    // SEO
    public String metaTitle;
    public String metaDescription;
    public String canonicalUrl;
    public String ogImage;

    // Images and Amenities
    public List<String> imageUrls;
    public List<Long> amenityIds;
}
