package com.realestate.aura.blog;

import com.realestate.aura.common.PagedResponse;
import com.realestate.aura.exception.BadRequestException;
import com.realestate.aura.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class BlogService {

    private final BlogPostRepository postRepository;
    private final BlogCategoryRepository categoryRepository;

    public BlogService(BlogPostRepository postRepository, BlogCategoryRepository categoryRepository) {
        this.postRepository = postRepository;
        this.categoryRepository = categoryRepository;
    }

    public PagedResponse<BlogPost> getPublishedArticles(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishedAt"));
        Page<BlogPost> pPage = postRepository.findByPublishedTrue(pageable);
        return new PagedResponse<>(
                pPage.getContent(), pPage.getNumber(), pPage.getSize(),
                pPage.getTotalElements(), pPage.getTotalPages(), pPage.isLast()
        );
    }

    public List<BlogPost> getLatestArticles() {
        return postRepository.findTop3ByPublishedTrueOrderByPublishedAtDesc();
    }

    @Transactional
    public BlogPost getArticleBySlug(String slug) {
        BlogPost post = postRepository.findBySlugAndPublishedTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found with slug: " + slug));
        post.setViewsCount(post.getViewsCount() != null ? post.getViewsCount() + 1 : 1L);
        return postRepository.save(post);
    }

    public List<BlogPost> getAllPostsForAdmin() {
        return postRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public BlogPost getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found with id: " + id));
    }

    @Transactional
    public BlogPost createPost(BlogPost post, Long categoryId) {
        if (postRepository.existsBySlug(post.getSlug())) {
            throw new BadRequestException("Article with slug already exists: " + post.getSlug());
        }
        if (categoryId != null) {
            post.setCategory(categoryRepository.findById(categoryId).orElse(null));
        }
        if (Boolean.TRUE.equals(post.getPublished()) && post.getPublishedAt() == null) {
            post.setPublishedAt(Instant.now());
        }
        return postRepository.save(post);
    }

    @Transactional
    public BlogPost updatePost(Long id, BlogPost updated, Long categoryId) {
        BlogPost existing = getPostById(id);
        existing.setTitle(updated.getTitle());
        existing.setSummary(updated.getSummary());
        existing.setContent(updated.getContent());
        existing.setFeaturedImage(updated.getFeaturedImage());
        existing.setAuthorName(updated.getAuthorName());
        existing.setAuthorAvatar(updated.getAuthorAvatar());
        existing.setMetaTitle(updated.getMetaTitle());
        existing.setMetaDescription(updated.getMetaDescription());
        existing.setPublished(updated.getPublished());

        if (categoryId != null) {
            existing.setCategory(categoryRepository.findById(categoryId).orElse(null));
        }
        return postRepository.save(existing);
    }

    @Transactional
    public void deletePost(Long id) {
        BlogPost existing = getPostById(id);
        postRepository.delete(existing);
    }

    public List<BlogCategory> getAllCategories() {
        return categoryRepository.findAll();
    }
}
