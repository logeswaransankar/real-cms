package com.realestate.aura.property;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {

    Optional<Property> findBySlugAndPublishedTrue(String slug);

    Optional<Property> findBySlug(String slug);

    Optional<Property> findByReferenceNumber(String referenceNumber);

    List<Property> findByFeaturedTrueAndPublishedTrue();

    @Query("SELECT p FROM Property p WHERE p.published = true AND p.archived = false " +
           "AND (:locationId IS NULL OR p.location.id = :locationId) " +
           "AND (:transactionType IS NULL OR p.transactionType = :transactionType) " +
           "AND (:propertyType IS NULL OR p.propertyType = :propertyType) " +
           "AND (:status IS NULL OR p.status = :status) " +
           "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR p.price <= :maxPrice) " +
           "AND (:minBedrooms IS NULL OR p.bedrooms >= :minBedrooms) " +
           "AND (:minBathrooms IS NULL OR p.bathrooms >= :minBathrooms) " +
           "AND (:searchQuery IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :searchQuery, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :searchQuery, '%')))")
    Page<Property> findPropertiesWithFilter(
            @Param("locationId") Long locationId,
            @Param("transactionType") String transactionType,
            @Param("propertyType") String propertyType,
            @Param("status") String status,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("minBedrooms") Integer minBedrooms,
            @Param("minBathrooms") Integer minBathrooms,
            @Param("searchQuery") String searchQuery,
            Pageable pageable
    );

    List<Property> findTop4ByLocationIdAndIdNotAndPublishedTrue(Long locationId, Long id);

    Boolean existsBySlug(String slug);

    Boolean existsByReferenceNumber(String referenceNumber);

    long countByPublishedTrue();

    long countByPublishedFalse();
}
