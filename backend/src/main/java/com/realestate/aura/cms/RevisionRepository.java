package com.realestate.aura.cms;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RevisionRepository extends JpaRepository<ContentRevision, Long> {
    List<ContentRevision> findByEntityTypeAndEntityIdOrderByRevisionNumberDesc(String entityType, Long entityId);
}
