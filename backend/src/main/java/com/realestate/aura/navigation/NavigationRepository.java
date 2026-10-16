package com.realestate.aura.navigation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NavigationRepository extends JpaRepository<NavigationItem, Long> {
    List<NavigationItem> findByMenuLocationAndActiveTrueOrderByDisplayOrderAsc(String menuLocation);
    List<NavigationItem> findByMenuLocationOrderByDisplayOrderAsc(String menuLocation);
}
