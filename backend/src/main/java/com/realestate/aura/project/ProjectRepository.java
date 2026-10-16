package com.realestate.aura.project;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findBySlug(String slug);
    List<Project> findByPublishedTrue();
    List<Project> findByFeaturedTrueAndPublishedTrue();
    List<Project> findByLocationIdAndPublishedTrue(Long locationId);
    Boolean existsBySlug(String slug);
}
