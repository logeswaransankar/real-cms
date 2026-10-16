package com.realestate.aura.media;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediaRepository extends JpaRepository<MediaAsset, Long> {
    List<MediaAsset> findByFolder(String folder);
    Page<MediaAsset> findByFileType(String fileType, Pageable pageable);
}
