package com.realestate.aura.cms;

import com.realestate.aura.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RevisionService {

    private final RevisionRepository revisionRepository;

    public RevisionService(RevisionRepository revisionRepository) {
        this.revisionRepository = revisionRepository;
    }

    public List<ContentRevision> getRevisions(String entityType, Long entityId) {
        return revisionRepository.findByEntityTypeAndEntityIdOrderByRevisionNumberDesc(entityType, entityId);
    }

    public ContentRevision getRevisionById(Long id) {
        return revisionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Revision not found with id: " + id));
    }

    @Transactional
    public ContentRevision createRevision(String entityType, Long entityId, String title, String snapshotJson, String createdBy, boolean isPublished) {
        List<ContentRevision> existing = revisionRepository.findByEntityTypeAndEntityIdOrderByRevisionNumberDesc(entityType, entityId);
        int nextRevision = existing.isEmpty() ? 1 : existing.get(0).getRevisionNumber() + 1;

        ContentRevision revision = new ContentRevision();
        revision.setEntityType(entityType);
        revision.setEntityId(entityId);
        revision.setRevisionNumber(nextRevision);
        revision.setTitle(title != null ? title : "Revision #" + nextRevision);
        revision.setSnapshotJson(snapshotJson);
        revision.setCreatedBy(createdBy);
        revision.setPublished(isPublished);

        return revisionRepository.save(revision);
    }
}
