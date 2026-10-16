package com.realestate.aura.blog;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    Optional<BlogPost> findBySlugAndPublishedTrue(String slug);
    Optional<BlogPost> findBySlug(String slug);
    Page<BlogPost> findByPublishedTrue(Pageable pageable);
    List<BlogPost> findTop3ByPublishedTrueOrderByPublishedAtDesc();
    Boolean existsBySlug(String slug);
}
