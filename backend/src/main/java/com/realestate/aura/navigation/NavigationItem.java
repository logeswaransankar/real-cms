package com.realestate.aura.navigation;

import jakarta.persistence.*;

@Entity
@Table(name = "navigation_items")
public class NavigationItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "menu_location", nullable = false, length = 30)
    private String menuLocation = "HEADER"; // HEADER, FOOTER

    @Column(nullable = false, length = 100)
    private String label;

    @Column(nullable = false)
    private String path;

    @Column(name = "parent_id")
    private Long parentId;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(name = "is_active")
    private Boolean active = true;

    @Column(name = "is_external")
    private Boolean external = false;

    public NavigationItem() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMenuLocation() {
        return menuLocation;
    }

    public void setMenuLocation(String menuLocation) {
        this.menuLocation = menuLocation;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Boolean getExternal() {
        return external;
    }

    public void setExternal(Boolean external) {
        this.external = external;
    }
}
