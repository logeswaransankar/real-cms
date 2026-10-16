package com.realestate.aura.dashboard.dto;

import com.realestate.aura.enquiry.Enquiry;
import com.realestate.aura.property.Property;

import java.util.List;

public class DashboardStatsDto {

    public long totalProperties;
    public long publishedProperties;
    public long draftProperties;
    public long totalProjects;
    public long totalEnquiries;
    public long newEnquiries;
    public List<Property> recentProperties;
    public List<Enquiry> recentEnquiries;

    public DashboardStatsDto() {}

    public DashboardStatsDto(long totalProperties, long publishedProperties, long draftProperties,
                             long totalProjects, long totalEnquiries, long newEnquiries,
                             List<Property> recentProperties, List<Enquiry> recentEnquiries) {
        this.totalProperties = totalProperties;
        this.publishedProperties = publishedProperties;
        this.draftProperties = draftProperties;
        this.totalProjects = totalProjects;
        this.totalEnquiries = totalEnquiries;
        this.newEnquiries = newEnquiries;
        this.recentProperties = recentProperties;
        this.recentEnquiries = recentEnquiries;
    }
}
