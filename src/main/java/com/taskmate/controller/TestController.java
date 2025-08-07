package com.taskmate.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/css-exists")
    public ResponseEntity<String> checkCssExists() {
        try {
            ClassPathResource resource = new ClassPathResource("static/css/style.css");
            if (resource.exists()) {
                return ResponseEntity.ok("CSS file exists and is accessible");
            } else {
                return ResponseEntity.ok("CSS file not found");
            }
        } catch (Exception e) {
            return ResponseEntity.ok("Error checking CSS: " + e.getMessage());
        }
    }

    @GetMapping("/static-resources")
    public ResponseEntity<String> listStaticResources() {
        try {
            ClassPathResource cssResource = new ClassPathResource("static/css/style.css");
            ClassPathResource jsResource = new ClassPathResource("static/js/app.js");
            
            StringBuilder result = new StringBuilder();
            result.append("CSS exists: ").append(cssResource.exists()).append("\n");
            result.append("JS exists: ").append(jsResource.exists()).append("\n");
            
            if (cssResource.exists()) {
                result.append("CSS file size: ").append(cssResource.getFile().length()).append(" bytes\n");
            }
            
            return ResponseEntity.ok(result.toString());
        } catch (Exception e) {
            return ResponseEntity.ok("Error checking static resources: " + e.getMessage());
        }
    }
}
