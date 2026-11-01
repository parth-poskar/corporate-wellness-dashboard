

package com.acme.wellness;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class CorporateWellnessApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Application Context Loads Successfully")
    void contextLoads() {
        // Confirms Spring Boot context, JPA repositories, and H2 database initialize properly
    }

    @Test
    @DisplayName("Actuator Health Endpoint returns HTTP 200 and status UP")
    void actuatorHealthReturnsUp() throws Exception {
        mockMvc.perform(get("/actuator/health")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("UP")));
    }

    @Test
    @DisplayName("Events List Endpoint returns HTTP 200 and pre-seeded database events")
    void eventsListEndpointReturnsEvents() throws Exception {
        mockMvc.perform(get("/api/events")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].eventCode", notNullValue()))
                .andExpect(jsonPath("$[0].title", notNullValue()));
    }
}
