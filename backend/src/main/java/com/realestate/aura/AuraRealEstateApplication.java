package com.realestate.aura;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class AuraRealEstateApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuraRealEstateApplication.class, args);
    }
}
