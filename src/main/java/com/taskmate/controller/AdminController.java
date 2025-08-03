package com.taskmate.controller;

import com.taskmate.model.Task;
import com.taskmate.model.User;
import com.taskmate.service.TaskService;
import com.taskmate.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/task")
@RequiredArgsConstructor
public class AdminController {

    private final TaskService taskService;
    private final UserService userService;

    // ✅ Get all tasks
    @GetMapping("")
    public ResponseEntity<List<Task>> getAllTasks() {
        try {
            List<Task> tasks = taskService.getAllTasks();
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
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

