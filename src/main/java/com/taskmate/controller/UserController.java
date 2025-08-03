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
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final TaskService taskService;
    private final UserService userService;

    // ✅ 1. View own tasks
    @GetMapping("/tasks")
    public ResponseEntity<List<Task>> getUserTasks(@RequestParam String email) {
        try {
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
            return ResponseEntity.ok(taskService.getTasksByUser(user));
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }
    @PostMapping("/create-user")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            User created = userService.saveUser(user);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }


    // ✅ 2. Update task status (pending, progress, completed)
    @PutMapping("/task/{taskId}")
    public ResponseEntity<Task> updateTaskStatus(@PathVariable Long taskId, @RequestParam String status) {
        try {
            Task updatedTask = taskService.updateTaskStatus(taskId, status);
            return ResponseEntity.ok(updatedTask);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
