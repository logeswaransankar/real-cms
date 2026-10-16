package com.realestate.aura;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("dev")
class AuraRealEstateApplicationTests {

    @Test
    void contextLoads() {
        // Verifies Spring application context loads with in-memory dev profile and Flyway migrations
    }
}
