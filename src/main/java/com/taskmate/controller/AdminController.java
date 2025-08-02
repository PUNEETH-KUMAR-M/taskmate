package com.taskmate.controller;

import com.taskmate.model.Task;
import com.taskmate.model.User;
import com.taskmate.service.TaskService;
import com.taskmate.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

@RestController
@RequestMapping("/api/task")
@RequiredArgsConstructor
public class AdminController {

    private final TaskService taskService;
    private final HttpServletRequest request;

    // ✅ Get all tasks
    @GetMapping("")
    public ResponseEntity<List<Task>> getAllTasks() {
        System.out.println("🔍 AdminController: Getting all tasks...");
        System.out.println("🔍 Request URI: " + request.getRequestURI());
        System.out.println("🔍 User: " + SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        System.out.println("🔍 Authorities: " + SecurityContextHolder.getContext().getAuthentication().getAuthorities());
        try {
            List<Task> tasks = taskService.getAllTasks();
            System.out.println("✅ Found " + tasks.size() + " tasks");
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            System.out.println("❌ Error getting tasks: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // ✅ Create task for a user
    @PostMapping("/create-task")
    public ResponseEntity<?> createTask(
            @RequestBody Task task,
            @RequestParam Long userId) {
        try {
            Task savedTask = taskService.createTask(task, userId);
            return ResponseEntity.ok(savedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Failed to create task: " + e.getMessage());
        }
        }
}

