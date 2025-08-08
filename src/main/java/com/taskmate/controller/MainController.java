package com.taskmate.controller;

import com.taskmate.service.DemoDataResetService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

    private final DemoDataResetService demoDataResetService;

    public MainController(DemoDataResetService demoDataResetService) {
        this.demoDataResetService = demoDataResetService;
    }

    @GetMapping("/")
    public String index() {
        // Ensure a fresh start for each new session/visit
        demoDataResetService.resetAllData();
        return "index";
    }

    @GetMapping("/index.html")
    public String indexHtml() {
        demoDataResetService.resetAllData();
        return "index";
    }
}
