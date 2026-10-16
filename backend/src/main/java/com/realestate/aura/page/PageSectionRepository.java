package com.realestate.aura.page;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PageSectionRepository extends JpaRepository<PageSection, Long> {
    List<PageSection> findByPageIdOrderByDisplayOrderAsc(Long pageId);
    List<PageSection> findByPageIdAndVisibleTrueOrderByDisplayOrderAsc(Long pageId);
}
