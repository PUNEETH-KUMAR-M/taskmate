package com.taskmate.service.impl;

import com.taskmate.model.Task;
import com.taskmate.model.TaskStatus;
import com.taskmate.model.User;
import com.taskmate.repository.TaskRepository;
import com.taskmate.repository.UserRepository;
import com.taskmate.service.TaskService;
import com.taskmate.service.WebSocketService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final WebSocketService webSocketService;

    @Override
    public Task createTask(Task task, Long userId) {
        System.out.println("🔧 TaskService: Creating task for user ID: " + userId);
        System.out.println("📝 Task details: " + task.getTitle() + " - " + task.getDescription());
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        System.out.println("👤 Found user: " + user.getName() + " (" + user.getEmail() + ")");
        
        task.setAssignedTo(user);
        task.setStatus(TaskStatus.PENDING); // Ensure status is set
        
        Task savedTask = taskRepository.save(task);
        System.out.println("✅ Task saved with ID: " + savedTask.getId());
        
        // Notify via WebSocket
        try {
            webSocketService.notifyTaskCreated(savedTask);
            System.out.println("📡 WebSocket notification sent");
        } catch (Exception e) {
            System.out.println("⚠️ WebSocket notification failed: " + e.getMessage());
        }
        
        return savedTask;
    }

    @Override
    public List<Task> getTasksByUser(User user) {
        return taskRepository.findByAssignedTo(user);
    }

    @Override
    public Task updateTaskStatus(Long taskId, String status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        TaskStatus newStatus = TaskStatus.valueOf(status.toUpperCase());
        task.setStatus(newStatus);

        Task updatedTask = taskRepository.save(task);
        webSocketService.notifyTaskStatusChanged(updatedTask);
        
        return updatedTask;
    }

    @Override
    public List<Task> getAllTasks() {
        System.out.println("🔍 TaskService: Getting all tasks from repository...");
        List<Task> tasks = taskRepository.findAll();
        System.out.println("✅ TaskService: Found " + tasks.size() + " tasks");
        return tasks;
    }
}
