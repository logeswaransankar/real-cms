package com.realestate.aura.page;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PageRepository extends JpaRepository<Page, Long> {
    Optional<Page> findBySlugAndPublishedTrue(String slug);
    Optional<Page> findBySlug(String slug);
    Boolean existsBySlug(String slug);
}
