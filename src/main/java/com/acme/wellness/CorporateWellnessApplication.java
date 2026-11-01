package com.acme.wellness;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.ConfigurableApplicationContext;

/**
 * Main Entry Point for the Corporate Wellness Dashboard application.
 *
 * Extends SpringBootServletInitializer to support both:
 *  1. Standalone Spring Boot JAR execution (java -jar)
 *  2. External Apache Tomcat WAR deployment
 *
 * This Spring Boot application serves:
 * 1. REST APIs for dashboard statistics, wellness events, alerts, reports, and deployment status.
 * 2. High-fidelity static web assets (HTML/CSS/JS) styled with the Stitch "Clinical Clarity & Executive Vitality" theme.
 * 3. An in-memory H2 database pre-seeded with realistic organizational demo data.
 */
@SpringBootApplication
public class CorporateWellnessApplication extends SpringBootServletInitializer {

    /**
     * Used by external Tomcat to bootstrap the Spring context as a WAR.
     */
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(CorporateWellnessApplication.class);
    }

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(CorporateWellnessApplication.class, args);
        String port = context.getEnvironment().getProperty("server.port", "8081");
        System.out.println("==================================================================");
        System.out.println(" Corporate Wellness Dashboard successfully started!");
        System.out.println(" Application URL: http://localhost:" + port);
        System.out.println(" H2 Database Console: http://localhost:" + port + "/h2-console");
        System.out.println(" Health Endpoint: http://localhost:" + port + "/actuator/health");
        System.out.println(" (JDBC URL: jdbc:h2:mem:wellnessdb | User: sa | Password: [empty])");
        System.out.println("==================================================================");
    }
}
