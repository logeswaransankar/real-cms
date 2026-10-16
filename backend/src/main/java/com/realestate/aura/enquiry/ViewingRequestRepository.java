package com.realestate.aura.enquiry;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ViewingRequestRepository extends JpaRepository<ViewingRequest, Long> {
}
