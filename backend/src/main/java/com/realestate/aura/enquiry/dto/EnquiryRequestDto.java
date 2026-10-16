package com.realestate.aura.enquiry.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public class EnquiryRequestDto {

    @NotBlank(message = "Full name is required")
    public String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Valid email is required")
    public String email;

    public String phone;

    @NotBlank(message = "Message is required")
    public String message;

    public String enquiryType = "GENERAL"; // GENERAL, PROPERTY_INQUIRY, PROJECT_INQUIRY, VIEWING_REQUEST

    public Long propertyId;
    public Long projectId;

    // Optional Viewing Request fields
    public LocalDate preferredDate;
    public String preferredTime;
    public String viewingType = "IN_PERSON";
}
