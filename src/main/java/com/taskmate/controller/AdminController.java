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
    private final UserService userService;
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
            for (Task task : tasks) {
                System.out.println("📋 Task: " + task.getTitle() + " (ID: " + task.getId() + ")");
            }
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
        System.out.println("🔧 AdminController: Creating task...");
        System.out.println("📝 Task title: " + task.getTitle());
        System.out.println("📝 Task description: " + task.getDescription());
        System.out.println("👤 User ID: " + userId);
        
        try {
            Task savedTask = taskService.createTask(task, userId);
            System.out.println("✅ Task created successfully with ID: " + savedTask.getId());
            System.out.println("✅ Task assigned to: " + savedTask.getAssignedTo().getName());
            return ResponseEntity.ok(savedTask);
        } catch (RuntimeException e) {
            System.out.println("❌ Failed to create task: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to create task: " + e.getMessage());
        }
    }
}

