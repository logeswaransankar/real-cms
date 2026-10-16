package com.realestate.aura.location;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    Optional<Location> findBySlug(String slug);
    List<Location> findByPopularTrue();
    Boolean existsBySlug(String slug);
}
