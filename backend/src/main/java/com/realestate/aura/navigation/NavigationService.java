package com.realestate.aura.navigation;

import com.realestate.aura.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NavigationService {

    private final NavigationRepository navigationRepository;

    public NavigationService(NavigationRepository navigationRepository) {
        this.navigationRepository = navigationRepository;
    }

    public List<NavigationItem> getPublicNavigation(String menuLocation) {
        return navigationRepository.findByMenuLocationAndActiveTrueOrderByDisplayOrderAsc(menuLocation.toUpperCase());
    }

    public List<NavigationItem> getAllNavigation(String menuLocation) {
        if (menuLocation != null && !menuLocation.isBlank()) {
            return navigationRepository.findByMenuLocationOrderByDisplayOrderAsc(menuLocation.toUpperCase());
        }
        return navigationRepository.findAll();
    }

    public NavigationItem getById(Long id) {
        return navigationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Navigation item not found with id: " + id));
    }

    @Transactional
    public NavigationItem create(NavigationItem item) {
        return navigationRepository.save(item);
    }

    @Transactional
    public NavigationItem update(Long id, NavigationItem item) {
        NavigationItem existing = getById(id);
        existing.setLabel(item.getLabel());
        existing.setPath(item.getPath());
        existing.setMenuLocation(item.getMenuLocation());
        existing.setParentId(item.getParentId());
        existing.setDisplayOrder(item.getDisplayOrder());
        existing.setActive(item.getActive());
        existing.setExternal(item.getExternal());
        return navigationRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        NavigationItem existing = getById(id);
        navigationRepository.delete(existing);
    }
}
