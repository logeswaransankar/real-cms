package com.realestate.aura.location;

import com.realestate.aura.exception.BadRequestException;
import com.realestate.aura.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LocationService {

    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    public List<Location> getPopularLocations() {
        return locationRepository.findByPopularTrue();
    }

    public Location getLocationBySlug(String slug) {
        return locationRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found with slug: " + slug));
    }

    public Location getLocationById(Long id) {
        return locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found with id: " + id));
    }

    @Transactional
    public Location createLocation(Location location) {
        if (locationRepository.existsBySlug(location.getSlug())) {
            throw new BadRequestException("Location with slug '" + location.getSlug() + "' already exists");
        }
        return locationRepository.save(location);
    }

    @Transactional
    public Location updateLocation(Long id, Location updatedDetails) {
        Location existing = getLocationById(id);
        existing.setName(updatedDetails.getName());
        existing.setCity(updatedDetails.getCity());
        existing.setCountry(updatedDetails.getCountry());
        existing.setDescription(updatedDetails.getDescription());
        existing.setHeroImage(updatedDetails.getHeroImage());
        existing.setPopular(updatedDetails.getPopular());
        existing.setPropertyCount(updatedDetails.getPropertyCount());
        return locationRepository.save(existing);
    }

    @Transactional
    public void deleteLocation(Long id) {
        Location existing = getLocationById(id);
        locationRepository.delete(existing);
    }
}
