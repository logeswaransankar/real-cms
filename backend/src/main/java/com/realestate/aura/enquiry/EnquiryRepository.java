package com.realestate.aura.enquiry;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {
    Page<Enquiry> findByStatus(String status, Pageable pageable);
    List<Enquiry> findTop10ByOrderByCreatedAtDesc();
    long countByStatus(String status);
}
