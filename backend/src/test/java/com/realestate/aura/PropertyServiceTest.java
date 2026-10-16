package com.realestate.aura;

import com.realestate.aura.developer.DeveloperRepository;
import com.realestate.aura.location.LocationRepository;
import com.realestate.aura.project.ProjectRepository;
import com.realestate.aura.property.AmenityRepository;
import com.realestate.aura.property.Property;
import com.realestate.aura.property.PropertyRepository;
import com.realestate.aura.property.PropertyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PropertyServiceTest {

    @Mock
    private PropertyRepository propertyRepository;
    @Mock
    private LocationRepository locationRepository;
    @Mock
    private DeveloperRepository developerRepository;
    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private AmenityRepository amenityRepository;

    private PropertyService propertyService;

    @BeforeEach
    void setUp() {
        propertyService = new PropertyService(
                propertyRepository, locationRepository, developerRepository,
                projectRepository, amenityRepository
        );
    }

    @Test
    void testGetFeaturedProperties() {
        Property prop = new Property();
        prop.setId(1L);
        prop.setTitle("Royal Sky Villa");
        prop.setPrice(new BigDecimal("15000000.00"));
        prop.setFeatured(true);
        prop.setPublished(true);

        when(propertyRepository.findByFeaturedTrueAndPublishedTrue()).thenReturn(List.of(prop));

        List<Property> featured = propertyService.getFeaturedProperties();

        assertNotNull(featured);
        assertEquals(1, featured.size());
        assertEquals("Royal Sky Villa", featured.get(0).getTitle());
        verify(propertyRepository, times(1)).findByFeaturedTrueAndPublishedTrue();
    }

    @Test
    void testGetPublishedPropertyBySlug() {
        Property prop = new Property();
        prop.setId(2L);
        prop.setSlug("sky-penthouse-castleton");
        prop.setPublished(true);
        prop.setViewsCount(10L);

        when(propertyRepository.findBySlugAndPublishedTrue("sky-penthouse-castleton"))
                .thenReturn(Optional.of(prop));
        when(propertyRepository.save(any(Property.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Property result = propertyService.getPublishedPropertyBySlug("sky-penthouse-castleton");

        assertNotNull(result);
        assertEquals(11L, result.getViewsCount());
    }
}
