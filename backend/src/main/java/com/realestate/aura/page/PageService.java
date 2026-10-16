package com.realestate.aura.page;

import com.realestate.aura.exception.BadRequestException;
import com.realestate.aura.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class PageService {

    private final PageRepository pageRepository;
    private final PageSectionRepository pageSectionRepository;

    public PageService(PageRepository pageRepository, PageSectionRepository pageSectionRepository) {
        this.pageRepository = pageRepository;
        this.pageSectionRepository = pageSectionRepository;
    }

    public List<Page> getAllPages() {
        return pageRepository.findAll();
    }

    public Page getPageBySlug(String slug) {
        Page page = pageRepository.findBySlugAndPublishedTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Published page not found with slug: " + slug));
        List<PageSection> visibleSections = pageSectionRepository.findByPageIdAndVisibleTrueOrderByDisplayOrderAsc(page.getId());
        page.setSections(visibleSections);
        return page;
    }

    public Page getPageForAdmin(Long id) {
        Page page = pageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Page not found with id: " + id));
        List<PageSection> allSections = pageSectionRepository.findByPageIdOrderByDisplayOrderAsc(page.getId());
        page.setSections(allSections);
        return page;
    }

    public Page getPageBySlugForAdmin(String slug) {
        Page page = pageRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Page not found with slug: " + slug));
        List<PageSection> allSections = pageSectionRepository.findByPageIdOrderByDisplayOrderAsc(page.getId());
        page.setSections(allSections);
        return page;
    }

    @Transactional
    public Page createPage(Page page) {
        if (pageRepository.existsBySlug(page.getSlug())) {
            throw new BadRequestException("Page with slug already exists: " + page.getSlug());
        }
        return pageRepository.save(page);
    }

    @Transactional
    public Page updatePage(Long id, Page details) {
        Page existing = getPageForAdmin(id);
        existing.setTitle(details.getTitle());
        existing.setMetaTitle(details.getMetaTitle());
        existing.setMetaDescription(details.getMetaDescription());
        existing.setOgImage(details.getOgImage());
        if (details.getPublished() != null) {
            existing.setPublished(details.getPublished());
            if (details.getPublished()) {
                existing.setPublishedAt(Instant.now());
                existing.setVersion(existing.getVersion() != null ? existing.getVersion() + 1 : 1);
            }
        }
        return pageRepository.save(existing);
    }

    @Transactional
    public PageSection addSection(Long pageId, PageSection section) {
        Page page = getPageForAdmin(pageId);
        section.setPage(page);
        return pageSectionRepository.save(section);
    }

    @Transactional
    public PageSection updateSection(Long sectionId, PageSection details) {
        PageSection section = pageSectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Page section not found with id: " + sectionId));
        section.setTitle(details.getTitle());
        section.setSubtitle(details.getSubtitle());
        section.setSectionType(details.getSectionType());
        section.setContentJson(details.getContentJson());
        section.setBackgroundImage(details.getBackgroundImage());
        section.setDisplayOrder(details.getDisplayOrder());
        section.setVisible(details.getVisible());
        return pageSectionRepository.save(section);
    }

    @Transactional
    public void deleteSection(Long sectionId) {
        PageSection section = pageSectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Page section not found with id: " + sectionId));
        pageSectionRepository.delete(section);
    }

    @Transactional
    public void reorderSections(Long pageId, List<Long> sectionIdsInOrder) {
        for (int i = 0; i < sectionIdsInOrder.size(); i++) {
            Long sId = sectionIdsInOrder.get(i);
            PageSection section = pageSectionRepository.findById(sId).orElse(null);
            if (section != null && section.getPage().getId().equals(pageId)) {
                section.setDisplayOrder(i + 1);
                pageSectionRepository.save(section);
            }
        }
    }
}
